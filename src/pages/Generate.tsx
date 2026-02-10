import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

const Generate = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Generate Reel</h1>
      <p className="text-muted-foreground mt-1">Upload your catalog and create a fashion Reel.</p>
    </div>

    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">Upload Catalog</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Drag & drop product images or descriptions here to get started.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default Generate;
