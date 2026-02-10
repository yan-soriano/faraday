import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templates = [
  { id: 1, name: "Dramatic Reveal", category: "Fashion", clips: 10, duration: "30s" },
  { id: 2, name: "Smooth Glide", category: "Minimal", clips: 8, duration: "25s" },
  { id: 3, name: "Fast Cuts", category: "Streetwear", clips: 12, duration: "15s" },
  { id: 4, name: "Luxury Slow-Mo", category: "Luxury", clips: 6, duration: "20s" },
];

const Templates = () => (
  <div className="space-y-8 max-w-5xl">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
      <p className="text-muted-foreground mt-1">Browse and select a Reel template.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      {templates.map((t) => (
        <Card key={t.id} className="cursor-pointer hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t.name}</CardTitle>
              <Badge variant="secondary">{t.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t.clips} clips · {t.duration}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Templates;
