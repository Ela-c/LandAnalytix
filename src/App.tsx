import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import defaultParcels from "@/data/defaultParcels";
import type { ParcelFeature } from "@/types/parcels";
import {
	buildFeatureCollection,
	boundsFromGeometry,
	centroidFromGeometry,
} from "@/utils/geo";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import UploadParcels from "@/components/upload-parcels";
import SearchPanel, { type GeocodeFeature } from "@/components/search-panel";
import SiteSnapshot from "@/components/site-snapshot";
import { Switch } from "@/components/ui/switch";
import { Separator } from "./components/ui/separator";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "INVALID_TOKEN";
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";
const INITIAL_VIEW = {
	center: [144.5804, -37.6845] as [number, number],
	zoom: 12.5,
};
const TERRAIN_ZOOM_THRESHOLD = 14.5;

type DrawnParcelPayload = {
	name: string;
	notes: string;
	geometry: ParcelFeature["geometry"];
};

const saveDrawnParcel = (_payload: DrawnParcelPayload) => {
	// TODO: Implement backend persistence once the API is available.
};

function App() {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const addressMarkerRef = useRef<mapboxgl.Marker | null>(null);
	const drawRef = useRef<MapboxDraw | null>(null);
	const drawPopupRef = useRef<mapboxgl.Popup | null>(null);
	const [mapReady, setMapReady] = useState(false);
	const [terrainAvailable, setTerrainAvailable] = useState(false);
	const [terrainEnabled, setTerrainEnabled] = useState(false);
	const [terrainTouched, setTerrainTouched] = useState(false);

	const [uploadedParcels, setUploadedParcels] = useState<ParcelFeature[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const allParcels = useMemo(
		() => [...defaultParcels, ...uploadedParcels],
		[uploadedParcels],
	);

	useEffect(() => {
		mapboxgl.accessToken = MAPBOX_TOKEN;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: MAP_STYLE,
			center: INITIAL_VIEW.center,
			zoom: INITIAL_VIEW.zoom,
		});

		map.on("load", () => {
			map.addSource("mapbox-dem", {
				type: "raster-dem",
				url: "mapbox://mapbox.mapbox-terrain-dem-v1",
				tileSize: 512,
				maxzoom: 14,
			});

			if (!map.getLayer("sky")) {
				map.addLayer({
					id: "sky",
					type: "sky",
					paint: {
						"sky-type": "atmosphere",
						"sky-atmosphere-sun": [0.0, 90.0],
						"sky-atmosphere-sun-intensity": 10,
					},
				});
			}

			map.addSource("parcels", {
				type: "geojson",
				data: buildFeatureCollection(defaultParcels),
			});

			map.addLayer({
				id: "parcels-fill",
				type: "fill",
				source: "parcels",
				paint: {
					"fill-color": "#22c55e",
					"fill-opacity": 0.12,
				},
			});

			map.addLayer({
				id: "parcels-outline",
				type: "line",
				source: "parcels",
				paint: {
					"line-color": "#22c55e",
					"line-width": 1.25,
				},
			});

			map.addLayer({
				id: "parcel-highlight",
				type: "line",
				source: "parcels",
				paint: {
					"line-color": "#f97316",
					"line-width": 3,
				},
				filter: ["==", ["get", "id"], ""],
			});

			drawRef.current = new MapboxDraw({
				displayControlsDefault: false,
				controls: {
					polygon: true,
					trash: true,
				},
			});
			map.addControl(drawRef.current, "top-right");

			setMapReady(true);
		});

		mapRef.current = map;

		return () => {
			addressMarkerRef.current?.remove();
			drawPopupRef.current?.remove();
			if (drawRef.current) {
				map.removeControl(drawRef.current);
				drawRef.current = null;
			}
			map.remove();
		};
	}, []);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;
		const map = mapRef.current;

		const updateTerrainAvailability = () => {
			const zoom = map.getZoom();
			const available = zoom >= TERRAIN_ZOOM_THRESHOLD;
			setTerrainAvailable(available);
			if (available && !terrainTouched) {
				setTerrainEnabled(true);
			}
		};

		updateTerrainAvailability();
		map.on("zoom", updateTerrainAvailability);

		return () => {
			map.off("zoom", updateTerrainAvailability);
		};
	}, [mapReady, terrainTouched]);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;
		const map = mapRef.current;
		if (!terrainAvailable) {
			map.setTerrain(null);
			return;
		}
		map.setTerrain(
			terrainEnabled
				? { source: "mapbox-dem", exaggeration: 1.25 }
				: null,
		);
	}, [mapReady, terrainAvailable, terrainEnabled]);

	useEffect(() => {
		if (!mapReady) return;
		const map = mapRef.current;
		const source = map?.getSource("parcels") as
			| mapboxgl.GeoJSONSource
			| undefined;
		if (source) {
			source.setData(buildFeatureCollection(allParcels));
		}
	}, [allParcels, mapReady]);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;
		mapRef.current.setFilter("parcel-highlight", [
			"==",
			["get", "id"],
			selectedId ?? "",
		]);
	}, [selectedId, mapReady]);

	const clearSelections = useCallback(() => {
		setSelectedId(null);
		addressMarkerRef.current?.remove();
		addressMarkerRef.current = null;
	}, []);

	useEffect(() => {
		if (!mapReady || !mapRef.current) return;
		const map = mapRef.current;

		const handleClick = (event: mapboxgl.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(event.point, {
				layers: ["parcels-fill", "parcels-outline"],
			});
			const match = features.find((feature) => feature.properties?.id);
			if (!match?.properties?.id) return;
			const id = String(match.properties.id);
			const parcel = allParcels.find((p) => p.id === id);
			if (parcel) {
				handleSelect(parcel);
			}
		};

		const setPointer = () => {
			map.getCanvas().style.cursor = "pointer";
		};
		const unsetPointer = () => {
			map.getCanvas().style.cursor = "";
		};
		const handleMapClick = (event: mapboxgl.MapMouseEvent) => {
			const features = map.queryRenderedFeatures(event.point, {
				layers: ["parcels-fill", "parcels-outline"],
			});
			if (features.some((feature) => feature.properties?.id)) return;
			clearSelections();
		};

		map.on("click", "parcels-fill", handleClick);
		map.on("click", "parcels-outline", handleClick);
		map.on("mouseenter", "parcels-fill", setPointer);
		map.on("mouseleave", "parcels-fill", unsetPointer);
		map.on("click", handleMapClick);

		return () => {
			map.off("click", "parcels-fill", handleClick);
			map.off("click", "parcels-outline", handleClick);
			map.off("mouseenter", "parcels-fill", setPointer);
			map.off("mouseleave", "parcels-fill", unsetPointer);
			map.off("click", handleMapClick);
		};
	}, [allParcels, clearSelections, mapReady]);

	const flyToParcel = (parcel: ParcelFeature) => {
		const map = mapRef.current;
		if (!map) return;
		const bounds = boundsFromGeometry(parcel.geometry);
		map.fitBounds(bounds, { padding: 60, duration: 900 });
	};

	const handleResetView = () => {
		setSelectedId(null);
		const map = mapRef.current;
		if (!map) return;
		map.easeTo({
			center: INITIAL_VIEW.center,
			zoom: INITIAL_VIEW.zoom,
			bearing: 0,
			pitch: 0,
			duration: 800,
		});
	};

	const handleTerrainToggle = (checked: boolean) => {
		setTerrainTouched(true);
		setTerrainEnabled(checked);
	};

	const handleSelect = (parcel: ParcelFeature) => {
		setSelectedId(parcel.id);
		flyToParcel(parcel);
	};

	const flyToAddress = (center: [number, number]) => {
		const map = mapRef.current;
		if (!map) return;

		map.flyTo({ center, zoom: 16, duration: 900 });
	};

	const focusAddress = (feature: GeocodeFeature) => {
		const map = mapRef.current;
		if (!map) return;
		setSelectedId(null);
		addressMarkerRef.current?.remove();
		addressMarkerRef.current = new mapboxgl.Marker({ color: "#22c55e" })
			.setLngLat(feature.center)
			.addTo(map);
		flyToAddress(feature.center);
	};

	const openDrawPopup = (
		geometry: ParcelFeature["geometry"],
		center: [number, number],
	) => {
		const map = mapRef.current;
		if (!map) return;

		drawPopupRef.current?.remove();

		const container = document.createElement("div");
		container.className = "space-y-2 text-sm text-neutral-100";

		const title = document.createElement("div");
		title.className = "text-sm font-semibold";
		title.textContent = "New parcel details";

		const nameLabel = document.createElement("label");
		nameLabel.className = "block text-xs text-neutral-300";
		nameLabel.textContent = "Parcel name";
		const nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.placeholder = "Untitled parcel";
		nameInput.className =
			"mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 focus:border-emerald-400 focus:outline-none";

		const notesLabel = document.createElement("label");
		notesLabel.className = "block text-xs text-neutral-300";
		notesLabel.textContent = "Notes";
		const notesInput = document.createElement("textarea");
		notesInput.rows = 2;
		notesInput.placeholder = "Add quick notes";
		notesInput.className =
			"mt-1 w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 focus:border-emerald-400 focus:outline-none";

		const actions = document.createElement("div");
		actions.className = "flex items-center justify-end gap-2 pt-1";

		const cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.textContent = "Cancel";
		cancelButton.className =
			"rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-400";

		const saveButton = document.createElement("button");
		saveButton.type = "button";
		saveButton.textContent = "Save";
		saveButton.className =
			"rounded border border-emerald-400/60 px-2 py-1 text-xs text-emerald-200 hover:border-emerald-300";

		cancelButton.addEventListener("click", () => {
			drawPopupRef.current?.remove();
			drawPopupRef.current = null;
		});

		saveButton.addEventListener("click", () => {
			saveDrawnParcel({
				name: nameInput.value.trim() || "Untitled parcel",
				notes: notesInput.value.trim(),
				geometry,
			});
			drawPopupRef.current?.remove();
			drawPopupRef.current = null;
		});

		actions.append(cancelButton, saveButton);
		nameLabel.appendChild(nameInput);
		notesLabel.appendChild(notesInput);
		container.append(title, nameLabel, notesLabel, actions);

		drawPopupRef.current = new mapboxgl.Popup({
			closeOnClick: false,
			closeButton: true,
			maxWidth: "260px",
		})
			.setLngLat(center)
			.setDOMContent(container)
			.addTo(map);
	};

	useEffect(() => {
		if (!mapReady || !mapRef.current || !drawRef.current) return;
		const map = mapRef.current;

		type DrawEvent = {
			features: Array<{ geometry: ParcelFeature["geometry"] }>;
		};

		const handleDrawCreate = (event: DrawEvent) => {
			const feature = event.features[0];
			if (!feature || feature.geometry.type !== "Polygon") return;
			const center = centroidFromGeometry(feature.geometry) as [
				number,
				number,
			];
			openDrawPopup(feature.geometry, center);
		};

		const handleDrawUpdate = (event: DrawEvent) => {
			const feature = event.features[0];
			if (!feature || feature.geometry.type !== "Polygon") return;
			const center = centroidFromGeometry(feature.geometry) as [
				number,
				number,
			];
			openDrawPopup(feature.geometry, center);
		};

		map.on("draw.create", handleDrawCreate);
		map.on("draw.update", handleDrawUpdate);

		return () => {
			map.off("draw.create", handleDrawCreate);
			map.off("draw.update", handleDrawUpdate);
		};
	}, [mapReady]);

	return (
		<div className="flex absolute inset-0 h-full w-full bg-neutral-900 text-white">
			<div className="w-[400px] p-4 border-r border-neutral-800 bg-neutral-950/70 backdrop-blur h-full overflow-y-auto">
				<SiteSnapshot
					onResetView={handleResetView}
					zoning="Urban Growth Zone"
					zoningSchedule="Schedule 3"
					precinctName="Rockbank North PSP"
					precinctUrl="https://www.planning.vic.gov.au/permits-and-development/precinct-structure-plans"
					grossAreaHa="43.2 hectares"
					encumberedAreaHa="12.1 hectares"
					netDevelopableAreaHa="33.1 hectares"
				/>
				<Separator className="bg-neutral-800 my-4" />
				<SearchPanel
					parcels={allParcels}
					selectedParcelId={selectedId}
					mapboxToken={MAPBOX_TOKEN}
					mapReady={mapReady}
					onParcelSelect={handleSelect}
					onAddressSelect={focusAddress}
				/>
				{terrainAvailable && (
					<div className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-3 py-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-wide text-neutral-400">
									Terrain mode
								</p>
								<p className="text-sm font-semibold text-white">
									3D terrain
								</p>
							</div>
							<Switch
								checked={terrainEnabled}
								onCheckedChange={handleTerrainToggle}
								aria-label="Toggle 3D terrain"
							/>
						</div>
						<p className="mt-2 text-xs text-neutral-400">
							Zoom 14.5+ enables terrain relief.
						</p>
					</div>
				)}
				<Separator className="bg-neutral-800 my-4" />
				<UploadParcels
					onAddParcels={(parcels) =>
						setUploadedParcels((prev) => [...prev, ...parcels])
					}
				/>
			</div>

			<div className="flex-1">
				<div id="map" className="h-full w-full" ref={mapContainerRef} />
			</div>
		</div>
	);
}

export default App;
