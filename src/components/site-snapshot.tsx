type SiteSnapshotProps = {
	title?: string;
	zoning: string;
	zoningSchedule: string;
	precinctName: string;
	precinctUrl: string;
	grossAreaHa: string;
	encumberedAreaHa: string;
	netDevelopableAreaHa: string;
	onResetView?: () => void;
};

export default function SiteSnapshot({
	title = "Site snapshot",
	zoning,
	zoningSchedule,
	precinctName,
	precinctUrl,
	grossAreaHa,
	encumberedAreaHa,
	netDevelopableAreaHa,
	onResetView,
}: SiteSnapshotProps) {
	return (
		<div className="rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-in fade-in-0 slide-in-from-top-2 duration-700">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-[11px] uppercase tracking-[0.3em] text-emerald-300">
						Instant GIS check
					</p>
					<h2 className="mt-2 text-xl font-semibold text-white">
						{title}
					</h2>
				</div>
				{onResetView && (
					<button
						onClick={onResetView}
						className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-200 transition hover:border-emerald-400 hover:text-emerald-200"
					>
						Reset view
					</button>
				)}
			</div>

			<div className="mt-4 grid gap-3">
				<div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
					<div className="flex items-center justify-between text-xs uppercase tracking-wide text-emerald-200">
						<span>Zoning</span>
						<span className="rounded-full border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-100">
							{zoningSchedule}
						</span>
					</div>
					<p className="mt-2 text-base font-semibold text-white">
						{zoning}
					</p>
				</div>

				<div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2">
					<div className="text-xs uppercase tracking-wide text-neutral-400">
						Precinct structure plan
					</div>
					<a
						href={precinctUrl}
						target="_blank"
						rel="noreferrer"
						className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-emerald-400/60 decoration-2 underline-offset-4 transition hover:text-emerald-200"
					>
						{precinctName}
						<span className="text-xs text-neutral-400">
							View plan
						</span>
					</a>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2">
						<div className="text-xs uppercase tracking-wide text-neutral-400">
							Gross area
						</div>
						<p className="mt-2 text-lg font-semibold text-white">
							{grossAreaHa}
						</p>
						<p className="text-xs text-neutral-500">
							Measured perfectly
						</p>
					</div>
					<div className="rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2">
						<div className="text-xs uppercase tracking-wide text-neutral-400">
							Encumbered area
						</div>
						<p className="mt-2 text-lg font-semibold text-white">
							{encumberedAreaHa}
						</p>
						<p className="text-xs text-neutral-500">
							Floodway + easements + conservation
						</p>
					</div>
				</div>

				<div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-400/15 via-emerald-400/5 to-transparent px-4 py-3">
					<div className="text-xs uppercase tracking-wide text-emerald-200">
						Net developable area
					</div>
					<p className="mt-2 text-2xl font-semibold text-white">
						{netDevelopableAreaHa}
					</p>
					<p className="text-xs text-emerald-200/70">
						The land that makes you money
					</p>
				</div>
			</div>
		</div>
	);
}
