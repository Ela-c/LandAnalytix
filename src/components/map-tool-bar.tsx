"use client";

import {
	MousePointer2,
	PenTool,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Layers,
	Undo2,
	Upload,
	RotateCcw,
	Mountain,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "./ui/separator";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import UploadParcels from "@/components/upload-parcels";
import type { ParcelFeature } from "@/types/parcels";

interface MapToolbarProps {
	drawingMode: boolean;
	onToggleDrawing: () => void;
	onUndo: () => void;
	canUndo: boolean;
	setUploadedParcels: React.Dispatch<React.SetStateAction<ParcelFeature[]>>;
	onResetView: () => void;
	terrainAvailable: boolean;
	terrainEnabled: boolean;
	onTerrainToggle: (checked: boolean) => void;
}

function ToolButton({
	icon: Icon,
	label,
	active = false,
	disabled = false,
	onClick,
}: {
	icon: React.ElementType;
	label: string;
	active?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className={`flex h-10 w-10 items-center justify-center rounded-md transition-all ${
						active
							? "bg-primary text-primary-foreground shadow-sm"
							: disabled
								? "text-muted-foreground/40 cursor-not-allowed"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
					}`}
					onClick={onClick}
					disabled={disabled}
					aria-label={label}
				>
					<Icon className="h-5 w-5" />
				</button>
			</TooltipTrigger>
			<TooltipContent side="right" className="text-xs">
				{label}
			</TooltipContent>
		</Tooltip>
	);
}

export function MapToolbar({
	drawingMode,
	onToggleDrawing,
	onUndo,
	canUndo,
	setUploadedParcels,
	onResetView,
	terrainAvailable,
	terrainEnabled,
	onTerrainToggle,
}: MapToolbarProps) {
	return (
		<TooltipProvider delayDuration={200}>
			<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-1 shadow-md pointer-events-auto">
				<ToolButton
					icon={MousePointer2}
					label="Select Parcel"
					active={!drawingMode}
					onClick={() => drawingMode && onToggleDrawing()}
				/>
				<ToolButton
					icon={PenTool}
					label="Draw Boundary"
					active={drawingMode}
					onClick={() => !drawingMode && onToggleDrawing()}
				/>
				<ToolButton
					icon={Undo2}
					label="Undo Last Point"
					disabled={!canUndo}
					onClick={onUndo}
				/>
				<Separator className="my-0.5" />
				<ToolButton
					icon={RotateCcw}
					label="Reset View"
					onClick={onResetView}
				/>
				<ToolButton icon={ZoomIn} label="Zoom In" />
				<ToolButton icon={ZoomOut} label="Zoom Out" />
				<ToolButton icon={Maximize2} label="Fit to View" />
				<Separator className="my-0.5" />
				<ToolButton icon={Layers} label="Map Layers" />
				<ToolButton
					icon={Mountain}
					label="Toggle 3D Terrain"
					active={terrainEnabled}
					onClick={() => onTerrainToggle(!terrainEnabled)}
					disabled={!terrainAvailable}
				/>

				<Dialog>
					{/* DialogTrigger renders as the Button */}
					<DialogTrigger asChild>
						<ToolButton icon={Upload} label="Upload" />
					</DialogTrigger>

					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Upload Parcel Data</DialogTitle>
						</DialogHeader>
						<div className="py-4">
							<UploadParcels
								onAddParcels={(parcels) =>
									setUploadedParcels((prev) => [
										...prev,
										...parcels,
									])
								}
							/>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</TooltipProvider>
	);
}
