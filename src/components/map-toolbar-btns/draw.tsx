import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";

export default function DrawPolygonButton() {
    return (
        <Tooltip>
            {/* DialogTrigger renders as the Button */}
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-md bg-white">
                    <PenTool className="h-5 w-5" />
                    <span className="sr-only">Draw Parcel</span>
                </Button>
            </TooltipTrigger>

            <TooltipContent side="right">
                <p>Draw Parcel</p>
            </TooltipContent>
        </Tooltip>
    );
}
