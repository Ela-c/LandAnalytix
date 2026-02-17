import { RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export default function ResetViewButton({ onResetView }: { onResetView: () => void }) {
    return (
        <Tooltip>
            {/* DialogTrigger renders as the Button */}
            <TooltipTrigger asChild>
                <Button
                    onClick={onResetView}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-md bg-white"
                >
                    <RotateCcw className="h-5 w-5" />
                    <span className="sr-only">Reset View</span>
                </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
                <p>Reset View</p>
            </TooltipContent>
        </Tooltip>
    );
}
