import { Card, CardContent } from "./ui/card";
import { Pyramid } from "lucide-react";

export default function LogoCard() {
    return (
        <Card className="w-fit h-fit py-2 flex items-center justify-center text-foreground rounded-lg shadow-lg pointer-events-auto">
            <CardContent className="flex items-center justify-center px-4">
                <div className="flex items-center gap-3">
                    <Pyramid size={24} />
                    <div>
                        <div className="text-sm font-semibold leading-tight">LandAnalytix</div>
                        <div className="text-xs text-muted-foreground leading-tight">
                            GIS Platform v2.4
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
