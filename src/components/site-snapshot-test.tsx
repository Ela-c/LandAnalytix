import { MapPin, Maximize2, AlertCircle, FileText, ExternalLink, ArrowRight } from "lucide-react";

type SiteSnapshotProps = {
    title?: string;
    zoning: string;
    zoningSchedule: string;
    precinctName: string;
    precinctUrl: string;
    grossAreaHa: string;
    encumberedAreaHa: string;
    netDevelopableAreaHa: string;
    onClose?: () => void; // Added for side-sheet UX
};

export default function SiteSnapshot({
    title = "Parcel Analysis",
    zoning,
    zoningSchedule,
    precinctName,
    precinctUrl,
    grossAreaHa,
    encumberedAreaHa,
    netDevelopableAreaHa,
    onClose,
}: SiteSnapshotProps) {
    return (
        <div className="flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl font-sans text-slate-900">
            {/* --- HEADER --- */}
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                            <MapPin className="h-3 w-3" />
                            <span>Selected Parcel</span>
                        </div>
                        <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Planning & Zoning Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                        Planning Controls
                    </h3>

                    <div className="grid gap-3">
                        {/* Zoning Card */}
                        <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-emerald-200 hover:shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-emerald-600">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase">
                                            Zoning Code
                                        </p>
                                        <p className="font-bold text-slate-900">{zoningSchedule}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 border-t border-slate-200 pt-3">
                                <p className="text-sm font-medium text-slate-700 leading-snug">
                                    {zoning}
                                </p>
                            </div>
                        </div>

                        {/* Precinct Link */}
                        <a
                            href={precinctUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/30 group"
                        >
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase">
                                    Precinct Structure Plan
                                </p>
                                <p className="font-semibold text-blue-700 group-hover:underline decoration-blue-300 underline-offset-2">
                                    {precinctName}
                                </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500" />
                        </a>
                    </div>
                </section>

                {/* Areas Calculation Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                        Area Analysis
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Gross Area */}
                        <div className="rounded-lg border border-slate-200 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-slate-500">
                                <Maximize2 size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                    Gross Area
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-slate-900">{grossAreaHa}</p>
                            <p className="text-[10px] text-slate-400">GIS Calculated</p>
                        </div>

                        {/* Encumbered Area */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                            <div className="mb-1 flex items-center gap-1.5 text-amber-600">
                                <AlertCircle size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                    Encumbered
                                </span>
                            </div>
                            <p className="text-lg font-semibold text-slate-700">
                                {encumberedAreaHa}
                            </p>
                            <p className="text-[10px] text-slate-400">Easements & Floodway</p>
                        </div>
                    </div>

                    {/* NDA - The Hero Metric */}
                    <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                        <div className="absolute right-0 top-0 -mt-2 -mr-2 h-16 w-16 rounded-full bg-emerald-100/50 blur-xl"></div>

                        <div className="relative z-10 flex items-end justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                                    Net Developable Area
                                </p>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-emerald-950 tracking-tight">
                                        {netDevelopableAreaHa}
                                    </span>
                                    <span className="text-sm font-medium text-emerald-700">ha</span>
                                </div>
                                <p className="mt-1 text-xs text-emerald-600/80 font-medium">
                                    Yieldable surface area
                                </p>
                            </div>
                            <div className="rounded-full bg-white/80 p-2 text-emerald-600 shadow-sm">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer / Actions */}
                <div className="pt-2 flex flex-col gap-2">
                    <button className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                        Generate Analysis Report
                    </button>
                    <button className="w-full rounded-lg py-3 text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                        {"Export Data (CSV/SHP)"}
                    </button>
                </div>
            </div>
        </div>
    );
}
