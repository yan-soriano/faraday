import { Card, CardContent } from "@/components/ui/card";
import { Film } from "lucide-react";

const ReelHistory = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Reels</h1>
      <p className="text-muted-foreground mt-1">View your generated Reels and download them.</p>
    </div>

    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="h-10 w-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">No Reels Yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your generated Reels will appear here once you create your first one.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default ReelHistory;
