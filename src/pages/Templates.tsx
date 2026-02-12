import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Image, Play } from "lucide-react";
import { templates, type Template } from "@/lib/templates";

const Templates = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<"reel" | "photo">("reel");

  const filtered = templates.filter((t) => t.type === activeTab);

  const handleUseTemplate = (t: Template) => {
    setSelected(null);
    const route = t.type === "reel" ? "/generate" : "/generate-posts";
    navigate(`${route}?template=${t.id}`);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground mt-1">Browse and select a template.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "reel" | "photo")}>
        <TabsList>
          <TabsTrigger value="reel">Reel Templates</TabsTrigger>
          <TabsTrigger value="photo">Photo Templates</TabsTrigger>
        </TabsList>

      <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="relative cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-colors"
                style={{ aspectRatio: "9 / 16" }}
                onClick={() => setSelected(t)}
              >
                <img
                  src={t.cover}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">{t.name}</span>
                    <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                  </div>
                  <p className="text-white/70 text-xs">
                    {t.type === "reel" ? `${t.clips} clips · ${t.duration}` : `${t.requiredPhotos} photos`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: details */}
            <div className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-xl">{selected?.name}</DialogTitle>
                  <DialogDescription>{selected?.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {selected?.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Image className="h-4 w-4" />
                    <span>{selected?.requiredPhotos} photos required</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selected?.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>

              <Button onClick={() => selected && handleUseTemplate(selected)} className="mt-6 w-full gap-2">
                <Play className="h-4 w-4" />
                Use Template
              </Button>
            </div>

            {/* Right: preview */}
            <div className="bg-muted flex items-center justify-center">
              {selected?.type === "reel" && selected?.previewUrl ? (
                <video
                  src={selected.previewUrl}
                  autoPlay
                  loop
                  controls
                  className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                />
              ) : selected?.cover ? (
                <img
                  src={selected.cover}
                  alt={selected.name}
                  className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                />
              ) : (
                <div className="text-center space-y-2 p-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Preview coming soon</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
