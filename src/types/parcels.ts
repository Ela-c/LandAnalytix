export type Position = [number, number];
export type PolygonCoords = Position[][]; // array of linear rings
export type MultiPolygonCoords = PolygonCoords[];

export type ParcelGeometry =
	| { type: "Polygon"; coordinates: PolygonCoords }
	| { type: "MultiPolygon"; coordinates: MultiPolygonCoords };

export type ParcelFeature = {
	id: string;
	name: string;
	geometry: ParcelGeometry;
	properties?: Record<string, unknown>;
};

export type ParcelLoader = {
	id: string;
	label: string;
	fileExtensions: string[];
	canLoad: (file: File) => boolean;
	load: (file: File) => Promise<ParcelFeature[]>;
};
