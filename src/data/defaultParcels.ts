import type { ParcelFeature } from "../types/parcels";

// Small seed dataset near Washington DC for search + fly demo
const defaultParcels: ParcelFeature[] = [
	{
		id: "lot-101",
		name: "Lot 101 - Logan Circle",
		geometry: {
			"coordinates": [
				[
					[
					144.5720048994719,
					-37.66571796600363
					],
					[
					144.57567955757992,
					-37.666190647747605
					],
					[
					144.5760240567779,
					-37.663918111806694
					],
					[
					144.57464605998763,
					-37.66404537565898
					],
					[
					144.57303839706424,
					-37.663299969994114
					],
					[
					144.57248719834888,
					-37.66319088561074
					],
					[
					144.5720048994719,
					-37.66571796600363
					]
				]
			],
			"type": "Polygon"
		},
		properties: {
			address: "13th St NW, Washington DC",
			source: "default",
		},
	},
	{
		id: "lot-202",
		name: "Lot 202 - Mount Vernon",
		geometry: {
			"coordinates": [
				[
					[
					144.5344810978159,
					-37.66892788396164
					],
					[
					144.53116890269803,
					-37.68627956135769
					],
					[
					144.53511219306307,
					-37.68619649709501
					],
					[
					144.54031749391504,
					-37.685905337940206
					],
					[
					144.54320853075706,
					-37.66975991405448
					],
					[
					144.5344810978159,
					-37.66892788396164
					]
				]
			],
			"type": "Polygon"
		},
		properties: {
			address: "7th St NW, Washington DC",
			source: "default",
		},
	},
	{
		id: "lot-303",
		name: "Lot 303 - Navy Yard",
		geometry: {
			"coordinates": [
				[
					[
					144.5105908526122,
					-37.743060101088744
					],
					[
					144.51064657969408,
					-37.75313331266746
					],
					[
					144.51927520429945,
					-37.754595707997915
					],
					[
					144.53123321877928,
					-37.75191395302044
					],
					[
					144.53020435982916,
					-37.74280253707839
					],
					[
					144.5219646347427,
					-37.741872247897355
					],
					[
					144.51527052146088,
					-37.742572101431335
					],
					[
					144.5105908526122,
					-37.743060101088744
					]
				]
			],
			"type": "Polygon"
      	},
		properties: {
			address: "Navy Yard, Washington DC",
			source: "default",
		},
	},
];

export default defaultParcels;
