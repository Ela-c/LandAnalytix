import { useEffect, useMemo, useRef, useState } from "react";

import type { ParcelFeature } from "@/types/parcels";
import { matchesSearch } from "@/utils/geo";
import { Search, MapPin, Hash, ChevronRight } from "lucide-react";

type SearchPanelProps = {
	parcels: ParcelFeature[];
	selectedParcelId?: string | null;
	mapboxToken: string;
	mapReady: boolean;
	onParcelSelect: (parcel: ParcelFeature) => void;
	onAddressSelect: (feature: GeocodeFeature) => void;
};

export type GeocodeFeature = {
	id: string;
	place_name: string;
	region_details: string;
	center: [number, number];
};

interface SearchResult {
	id: string;
	type: "lot" | "address";
	label: string;
	sublabel: string;
}

// TODO: Consider incorparating the status message into the component again. Consider using the mapReady prop again.

export default function SearchPanel({
	parcels,
	mapboxToken,
	mapReady,
	onParcelSelect,
	onAddressSelect,
}: SearchPanelProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [addressResults, setAddressResults] = useState<GeocodeFeature[]>([]);
	const [addressLoading, setAddressLoading] = useState(false);
	const [geocodeStatus, setGeocodeStatus] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const parcelResults = useMemo(() => {
		const term = searchTerm.trim();
		if (!term) return parcels.slice(0, 8);
		return parcels
			.filter((parcel) =>
				matchesSearch(`${parcel.name} ${parcel.id}`, term),
			)
			.slice(0, 20);
	}, [parcels, searchTerm]);

	const results: SearchResult[] = useMemo(() => {
		const lotResults = parcelResults.map((parcel) => ({
			id: parcel.id,
			type: "lot" as const,
			label: parcel.name ?? "Unnamed lot",
			sublabel:
				(parcel.properties?.address as string) ??
				"No address available",
		}));
		const addrResults = addressResults.map((feature) => ({
			id: feature.id,
			type: "address" as const,
			label: feature.place_name ?? "Unnamed address",
			sublabel: feature.region_details ?? "No region details available",
		}));
		return [...lotResults, ...addrResults];
	}, [parcelResults, addressResults]);

	const hasResults = parcelResults.length > 0 || addressResults.length > 0;

	const onSelectResult = (id: string) => {
		const parcel = parcels.find((p) => p.id === id);
		if (parcel) {
			onParcelSelect(parcel);
			return;
		}
		const feature = addressResults.find((f) => f.id === id);
		if (feature) {
			onAddressSelect(feature);
		}
	};

	const statusMessage = addressLoading
		? "Searching..."
		: (geocodeStatus ??
			(searchTerm.trim() && !hasResults
				? "No matches. Try another term."
				: null));

	useEffect(() => {
		const query = searchTerm.trim();
		if (!query) {
			setAddressResults([]);
			setAddressLoading(false);
			setGeocodeStatus(null);
			return;
		}

		const controller = new AbortController();
		const debounce = setTimeout(async () => {
			setAddressLoading(true);
			try {
				// Use Mapbox Geocoding API to search for addresses matching the query
				const response = await fetch(
					`https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
						query,
					)}&access_token=${mapboxToken}&autocomplete=true&limit=5&country=au`,
					{ signal: controller.signal },
				);
				if (!response.ok) {
					setGeocodeStatus("Geocoding request failed");
					setAddressResults([]);
					return;
				}

				const data = await response.json();
				console.log("Geocoding response:", data);
				const features: GeocodeFeature[] = (data?.features ?? [])
					.filter(
						(feature: any) =>
							Array.isArray(feature?.geometry?.coordinates) &&
							feature.geometry.coordinates.length === 2, // Validate that coordinates is a [lng, lat] array
					)
					.map((feature: any) => ({
						id: feature.id as string,
						place_name: `${feature.properties.name_preferred} ${feature.properties.context.locality?.name}`,
						region_details: `${feature.properties.context.region?.name}, ${feature.properties.context.postcode?.name}`,
						center: [
							feature.geometry.coordinates[0],
							feature.geometry.coordinates[1],
						] as [number, number],
					}));

				setAddressResults(features);
				setGeocodeStatus(features.length ? null : "No address matches");
			} catch (error) {
				if (controller.signal.aborted) return;
				setAddressResults([]);
				setGeocodeStatus(
					error instanceof Error
						? `Search failed: ${error.message}`
						: "Search failed",
				);
			} finally {
				setAddressLoading(false);
			}
		}, 250);

		return () => {
			clearTimeout(debounce);
			controller.abort();
		};
	}, [mapboxToken, searchTerm]);

	const showDropdown =
		isFocused &&
		(addressResults.length > 0 || searchTerm.trim().length > 0);

	return (
		<div className="relative">
			<div
				className={`flex items-center gap-2 rounded-lg border bg-neutral-900 px-3 py-2.5 transition-all ${
					isFocused ? "border-emerald-400" : "border-neutral-700"
				}`}
			>
				<Search className="h-4 w-4 shrink-0 text-muted-foreground" />
				<input
					ref={inputRef}
					type="text"
					placeholder="Search by lot number, plan ID, or address..."
					className="h-full w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setTimeout(() => setIsFocused(false), 200)}
				/>
				{searchTerm && (
					<button
						className="text-xs text-muted-foreground hover:text-emerald-400"
						onClick={() => setSearchTerm("")}
					>
						Clear
					</button>
				)}
			</div>
			{showDropdown && (
				<div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
					{results.length > 0 ? (
						<div className="py-1">
							<div className="px-3 py-1.5">
								<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Results
								</span>
							</div>
							{results.map((result) => (
								<button
									key={result.id}
									className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
									onClick={() => {
										onSelectResult(result.id);
										setSearchTerm(result.label);
										setIsFocused(false);
									}}
								>
									<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
										{result.type === "lot" ? (
											<Hash className="h-3.5 w-3.5" />
										) : (
											<MapPin className="h-3.5 w-3.5" />
										)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-foreground">
											{result.label}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{result.sublabel}
										</p>
									</div>
									<ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
								</button>
							))}
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
