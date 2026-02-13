import { useState, useRef } from "react";
import { Plus, Sparkles, Loader2, Download, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/* ── placeholder data ── */
interface AIModel {
  id: string;
  name: string;
  cover: string;
  fullBody: string;
}

const PLACEHOLDER_MODELS: AIModel[] = [
  { id: "model-1", name: "Sophia", cover: "/placeholder.svg", fullBody: "/placeholder.svg" },
  { id: "model-2", name: "Elena", cover: "/placeholder.svg", fullBody: "/placeholder.svg" },
  { id: "model-3", name: "Amira", cover: "/placeholder.svg", fullBody: "/placeholder.svg" },
  { id: "model-4", name: "Yuki", cover: "/placeholder.svg", fullBody: "/placeholder.svg" },
];

type CatalogCategory = "tops" | "bottoms" | "shoes" | "headwear" | "accessories";

const CATEGORIES: { key: CatalogCategory; label: string }[] = [
  { key: "tops", label: "Top" },
  { key: "bottoms", label: "Bottom" },
  { key: "shoes", label: "Shoes" },
  { key: "headwear", label: "Headwear" },
  { key: "accessories", label: "Accessories" },
];

/* ── tiny sub-components ── */

function ModelCard({ model, selected, onSelect }: { model: AIModel; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-lg overflow-hidden cursor-pointer transition-all",
        selected ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "ring-1 ring-border hover:ring-primary/40"
      )}
      style={{ aspectRatio: "1 / 1" }}
    >
      <img src={model.cover} alt={model.name} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute bottom-0 left-0 right-0 p-1.5"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
      >
        <span className="text-[10px] font-semibold text-white">{model.name}</span>
      </div>
    </button>
  );
}

function UploadCard({ onUpload }: { onUpload: (files: FileList) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && onUpload(e.target.files)} />
      <button
        onClick={() => ref.current?.click()}
        className="w-full h-full rounded-md border-2 border-dashed border-border bg-muted/20 flex items-center justify-center hover:border-primary/40 transition-colors"
      >
        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </>
  );
}

function CatalogItemCard({
  src,
  selected,
  onSelect,
  onRemove,
}: {
  src: string;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative w-full h-full rounded-md overflow-hidden transition-all",
        selected ? "ring-2 ring-primary shadow-md shadow-primary/20" : "ring-1 ring-border hover:ring-primary/40"
      )}
    >
      <img src={src} alt="" className="w-full h-full object-cover" />
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-0.5 right-0.5 rounded-full bg-destructive/90 text-destructive-foreground p-0.5 z-10 hover:bg-destructive"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </button>
  );
}

/* ── main page ── */

const Catalog = () => {
  const [models] = useState<AIModel[]>(PLACEHOLDER_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<Record<CatalogCategory, string[]>>({
    tops: [],
    bottoms: [],
    shoes: [],
    headwear: [],
    accessories: [],
  });

  const [selectedItems, setSelectedItems] = useState<Record<CatalogCategory, string | null>>({
    tops: null,
    bottoms: null,
    shoes: null,
    headwear: null,
    accessories: null,
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) ?? null;

  const canGenerate =
    !!selectedModelId &&
    !!selectedItems.tops &&
    !!selectedItems.bottoms &&
    !!selectedItems.shoes;

  const handleCatalogUpload = (category: CatalogCategory, files: FileList) => {
    const url = URL.createObjectURL(files[0]);
    // Limit to 1 item per category: replace existing
    setCatalog((prev) => ({ ...prev, [category]: [url] }));
    // Auto-select the uploaded item
    setSelectedItems((prev) => ({ ...prev, [category]: url }));
  };

  const handleRemoveCatalogItem = (category: CatalogCategory, index: number) => {
    setCatalog((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
    // deselect if removed item was selected
    setSelectedItems((prev) => {
      if (prev[category] === catalog[category][index]) return { ...prev, [category]: null };
      return prev;
    });
  };

  const handleSelectItem = (category: CatalogCategory, url: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category] === url ? null : url,
    }));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setProgress(0);

    const duration = 4000;
    const interval = 80;
    let elapsed = 0;
    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        elapsed += interval;
        setProgress(Math.min(Math.round((elapsed / duration) * 100), 100));
        if (elapsed >= duration) { clearInterval(timer); resolve(); }
      }, interval);
    });

    setLoading(false);
    setProgress(100);
    setGeneratedImageUrl("/placeholder.svg");
    setResultModalOpen(true);
    toast({ title: "Image generated!", description: "Your catalog look is ready." });
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = generatedImageUrl;
    a.download = "catalog-look.png";
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
        <p className="text-muted-foreground mt-1">Select a model, add clothing items, and generate a look.</p>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] lg:grid-cols-[200px_1fr_minmax(320px,420px)] gap-6">
        {/* LEFT — AI Models */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">AI Models</p>
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 pr-2">
              {models.map((m) => (
                <ModelCard
                  key={m.id}
                  model={m}
                  selected={selectedModelId === m.id}
                  onSelect={() => setSelectedModelId(m.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* CENTER — Model Preview (9:16) */}
        <div className="flex items-center justify-center rounded-lg border border-border bg-muted/10 max-h-[600px]" style={{ aspectRatio: "9 / 16" }}>
          {selectedModel ? (
            <img
              src={selectedModel.fullBody}
              alt={selectedModel.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <User className="h-12 w-12" />
              <p className="text-sm font-medium">Select a model to begin</p>
            </div>
          )}
        </div>

        {/* RIGHT — Catalog Items */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Catalog Items</p>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-3 pr-2">
              {CATEGORIES.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{label}</p>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {catalog[key].length === 0 ? (
                      <div className="flex-shrink-0 w-10 h-10">
                        <UploadCard onUpload={(files) => handleCatalogUpload(key, files)} />
                      </div>
                    ) : (
                      catalog[key].map((url, i) => (
                        <div key={i} className="flex-shrink-0 w-10 h-10">
                          <CatalogItemCard
                            src={url}
                            selected={selectedItems[key] === url}
                            onSelect={() => handleSelectItem(key, url)}
                            onRemove={() => handleRemoveCatalogItem(key, i)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {loading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generating look…</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button onClick={handleGenerate} disabled={!canGenerate || loading} className="w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? `${progress}%` : "Generate Look"}
          </Button>
        </div>
      </div>

      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 overflow-auto">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Your Look is Ready</DialogTitle>
            <DialogDescription>Preview and download your generated catalog look.</DialogDescription>
          </DialogHeader>
          {generatedImageUrl && (
            <div className="p-4 pt-2 space-y-4 flex flex-col items-center">
              <img
                src={generatedImageUrl}
                alt="Generated look"
                className="w-auto h-auto max-w-full rounded-lg"
                style={{ maxHeight: "75vh", objectFit: "contain" }}
              />
              <Button onClick={handleDownload} className="w-full max-w-md gap-2">
                <Download className="h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Catalog;
