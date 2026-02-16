import type { ParcelFeature, ParcelGeometry, Position } from "../types/parcels";

type GeoJSONFeature = {
	type: "Feature";
	geometry: ParcelGeometry;
	properties: Record<string, unknown>;
};

type GeoJSONFeatureCollection = {
	type: "FeatureCollection";
	features: GeoJSONFeature[];
};

export const buildFeatureCollection = (
	parcels: ParcelFeature[],
): GeoJSONFeatureCollection => ({
	type: "FeatureCollection",
	features: parcels.map((parcel) => ({
		type: "Feature",
		geometry: parcel.geometry,
		properties: {
			id: parcel.id,
			name: parcel.name,
			...parcel.properties,
		},
	})),
});

const flattenCoordinates = (geometry: ParcelGeometry): Position[] => {
	if (geometry.type === "Polygon") {
		return geometry.coordinates.flat();
	}
	return geometry.coordinates.flat(2);
};

export type BoundsTuple = [[number, number], [number, number]];

export const boundsFromGeometry = (geometry: ParcelGeometry): BoundsTuple => {
	const coords = flattenCoordinates(geometry);
	let minLng = coords[0]?.[0] ?? 0;
	let minLat = coords[0]?.[1] ?? 0;
	let maxLng = minLng;
	let maxLat = minLat;

	coords.forEach(([lng, lat]) => {
		minLng = Math.min(minLng, lng);
		minLat = Math.min(minLat, lat);
		maxLng = Math.max(maxLng, lng);
		maxLat = Math.max(maxLat, lat);
	});

	return [
		[minLng, minLat],
		[maxLng, maxLat],
	];
};

export const centroidFromGeometry = (geometry: ParcelGeometry): Position => {
	const coords = flattenCoordinates(geometry);
	if (!coords.length) return [0, 0];
	const sum = coords.reduce(
		(acc, [lng, lat]) => ({ lng: acc.lng + lng, lat: acc.lat + lat }),
		{ lng: 0, lat: 0 },
	);
	return [sum.lng / coords.length, sum.lat / coords.length];
};

export const normalizeSearchText = (value: string) => value.trim().toLowerCase();

/**
 * Simple case-insensitive substring match for search functionality
 * 
 * TODO: Consider more advanced matching (e.g., fuzzy search) if needed in the future
 */
export const matchesSearch = (candidate: string, term: string) =>
	normalizeSearchText(candidate).includes(normalizeSearchText(term));
