import { Upload } from "lucide-react"; // Standard icon library for shadcn
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import UploadParcels from "@/components/upload-parcels";
import type { ParcelFeature } from "@/types/parcels";

// Inside your App component or a new component:

export default function ParcelUploadButton({
    setUploadedParcels,
}: {
    setUploadedParcels: React.Dispatch<React.SetStateAction<ParcelFeature[]>>;
}) {
    return (
        <Dialog>
            <Tooltip>
                {/* DialogTrigger renders as the Button */}
                <DialogTrigger asChild>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-md bg-white"
                        >
                            <Upload className="h-5 w-5" />
                            <span className="sr-only">Upload parcels</span>
                        </Button>
                    </TooltipTrigger>
                </DialogTrigger>

                <TooltipContent side="right">
                    <p>Upload Parcels</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Parcel Data</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <UploadParcels
                        onAddParcels={(parcels) =>
                            setUploadedParcels((prev) => [...prev, ...parcels])
                        }
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
