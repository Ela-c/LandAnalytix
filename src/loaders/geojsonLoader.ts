import type { ParcelFeature, ParcelGeometry, ParcelLoader } from "../types/parcels";

const validExtensions = [".geojson", ".json"];
const validMimeTypes = ["application/geo+json", "application/json", "application/vnd.geo+json"];

const isPolygonGeometry = (geometry: unknown): geometry is ParcelGeometry => {
	if (!geometry || typeof geometry !== "object") return false;
	const g = geometry as { type?: string; coordinates?: unknown };
	const allowed = g.type === "Polygon" || g.type === "MultiPolygon";
	return allowed && Array.isArray(g.coordinates);
};

const coerceId = (value: unknown, fallback: string) => {
	if (typeof value === "string" && value.trim().length) return value;
	if (typeof value === "number") return value.toString();
	return fallback;
};

const coerceName = (value: unknown, fallback: string) => {
	if (typeof value === "string" && value.trim().length) return value;
	return fallback;
};

const normalizeGeoJSONInput = (raw: unknown): ParcelFeature[] => {
	if (!raw || typeof raw !== "object") {
		throw new Error("Uploaded file is empty or not an object");
	}

	const payload = raw as { type?: string; features?: unknown; geometry?: unknown; properties?: unknown; id?: unknown };

	if (payload.type === "FeatureCollection") {
		if (!Array.isArray(payload.features)) {
			throw new Error("FeatureCollection is missing a valid features array");
		}

		return payload.features
			.map((feature, index) => normalizeFeature(feature, index))
			.filter(Boolean) as ParcelFeature[];
	}

	if (payload.type === "Feature") {
		return [normalizeFeature(payload, 0)] as ParcelFeature[];
	}

	// Raw geometry with optional properties
	if (isPolygonGeometry(payload as unknown as ParcelGeometry)) {
		return [
			{
				id: "geojson-geometry",
				name: "Uploaded geometry",
				geometry: payload as ParcelGeometry,
				properties: payload.properties as Record<string, unknown> | undefined,
			},
		];
	}

	throw new Error("Unsupported GeoJSON structure. Provide a Feature or FeatureCollection with Polygon geometries.");
};

const normalizeFeature = (feature: unknown, index: number): ParcelFeature => {
	if (!feature || typeof feature !== "object") {
		throw new Error("Feature is not an object");
	}

	const candidate = feature as {
		id?: unknown;
		type?: string;
		geometry?: unknown;
		properties?: Record<string, unknown>;
	};

	if (candidate.type !== "Feature") {
		throw new Error("Encountered an item that is not a GeoJSON Feature");
	}

	if (!isPolygonGeometry(candidate.geometry)) {
		throw new Error("Feature geometry must be a Polygon or MultiPolygon");
	}

	const fallbackId = `geojson-${index}-${Date.now()}`;
	const id = coerceId(candidate.id ?? candidate.properties?.id, fallbackId);
	const name = coerceName(
		candidate.properties?.name ?? candidate.properties?.title ?? candidate.properties?.label,
		`Parcel ${index + 1}`,
	);

	return {
		id,
		name,
		geometry: candidate.geometry,
		properties: candidate.properties,
	};
};

export const geojsonLoader: ParcelLoader = {
	id: "geojson",
	label: "GeoJSON",
	fileExtensions: validExtensions,
	canLoad: (file: File) => {
		const lowerName = file.name.toLowerCase();
		const matchesExtension = validExtensions.some((ext) => lowerName.endsWith(ext));
		const matchesMime = validMimeTypes.includes(file.type);
		return matchesExtension || matchesMime;
	},
	load: async (file: File) => {
		const text = await file.text();
		const parsed = JSON.parse(text) as unknown;
		return normalizeGeoJSONInput(parsed);
	},
};
