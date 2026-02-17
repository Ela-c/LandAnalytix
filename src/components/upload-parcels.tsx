import React, { useMemo, useRef, useState } from "react";

import { geojsonLoader } from "@/loaders/geojsonLoader";
import type { ParcelFeature, ParcelLoader } from "@/types/parcels";

type UploadParcelsProps = {
    onAddParcels: (parcels: ParcelFeature[]) => void;
};

export default function UploadParcels({ onAddParcels }: UploadParcelsProps) {
    const [status, setStatus] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const loaders: ParcelLoader[] = useMemo(() => [geojsonLoader], []);

    const processFiles = async (files: FileList | File[] | null | undefined) => {
        const file = files?.[0];
        if (!file) return;

        const loader = loaders.find((candidate) => candidate.canLoad(file));
        if (!loader) {
            setStatus(`Unsupported file: ${file.name}`);
            return;
        }

        try {
            const parsed = await loader.load(file);
            onAddParcels(parsed);
            setStatus(`Loaded ${parsed.length} parcels from ${file.name}`);
        } catch (error) {
            setStatus(
                error instanceof Error
                    ? `Could not load ${file.name}: ${error.message}`
                    : "Could not load the uploaded file"
            );
        }
    };

    const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        await processFiles(event.target.files);
        event.target.value = "";
    };

    const handleDrop: React.DragEventHandler<HTMLLabelElement> = async (event) => {
        event.preventDefault();
        dragCounter.current = 0;
        setIsDragging(false);
        await processFiles(event.dataTransfer?.files);
    };

    const handleDragEnter: React.DragEventHandler<HTMLLabelElement> = (event) => {
        event.preventDefault();
        dragCounter.current += 1;
        setIsDragging(true);
    };

    const handleDragLeave: React.DragEventHandler<HTMLLabelElement> = (event) => {
        event.preventDefault();
        dragCounter.current = Math.max(0, dragCounter.current - 1);
        if (dragCounter.current === 0) setIsDragging(false);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-2 text-sm text-neutral-500">
                <span>Upload parcels (GeoJSON)</span>
                <span className="text-xs text-neutral-500">Adds to search</span>
            </div>
            <label
                onDragOver={(event) => {
                    event.preventDefault();
                    if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
                }}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`flex cursor-pointer items-center justify-center rounded border border-dashed px-3 py-3 text-sm transition
					${
                        isDragging
                            ? "border-emerald-400 bg-emerald-400/10 text-emerald-200 shadow-[0_0_0_1px_rgba(52,211,153,0.35)]"
                            : "border-neutral-700 hover:border-emerald-400 hover:text-emerald-300"
                    }
				`}
            >
                <input
                    type="file"
                    accept=".geojson,application/geo+json,application/json,application/vnd.geo+json"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <span>{isDragging ? "Release to upload" : "Drop or select a GeoJSON file"}</span>
            </label>
            {status && <div className="mt-2 text-xs text-neutral-400">{status}</div>}
        </>
    );
}
