import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AngleUploadSlot } from "@/components/AngleUploadSlot";
import { CatalogUploadArea } from "@/components/CatalogUploadArea";
import { postTemplates, type Template } from "@/lib/templates";

const ANGLE_LABELS = ["Front", "Back", "Left", "Right"];

const GeneratePosts = () => {
  const [angles, setAngles] = useState<(File | null)[]>([null, null, null, null]);
  const [catalog, setCatalog] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const allAnglesUploaded = angles.every(Boolean);
  const canGenerate = allAnglesUploaded && !!selectedTemplate;

  const handleAngleUpload = (index: number, file: File) => {
    setAngles((prev) => prev.map((f, i) => (i === index ? file : f)));
  };

  const handleAngleRemove = (index: number) => {
    setAngles((prev) => prev.map((f, i) => (i === index ? null : f)));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);

    const payload = {
      images: angles.map((f) => f!.name),
      catalog: catalog.map((f) => f.name),
      templateId: selectedTemplate,
      prompt,
    };
    console.log("Generate Post payload:", payload);

    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    toast({ title: "Post generation started!", description: "Your post is being created." });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Post</h1>
        <p className="text-muted-foreground mt-1">Upload product photos and create styled social posts.</p>
      </div>

      <div className="flex gap-6">
        {/* Left: Upload section */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3 w-20">
              {ANGLE_LABELS.map((label, i) => (
                <AngleUploadSlot
                  key={label}
                  label={label}
                  image={angles[i]}
                  onUpload={(f) => handleAngleUpload(i, f)}
                  onRemove={() => handleAngleRemove(i)}
                />
              ))}
            </div>
            <CatalogUploadArea files={catalog} onFilesChange={setCatalog} className="flex-1 min-h-[calc(4*5rem+3*0.75rem)]" />
          </div>

          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want the post to look..."
              className="flex-1"
            />
            <Button onClick={handleGenerate} disabled={!canGenerate || loading} className="gap-2 shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate
            </Button>
          </div>
        </div>

        {/* Right: Post template grid */}
        <div className="w-56 space-y-2 shrink-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Post Templates</p>
          <div className="grid grid-cols-2 gap-2">
            {postTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={cn(
                  "rounded-lg border p-2.5 text-left transition-all",
                  selectedTemplate === t.id
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <div className="aspect-square rounded bg-muted mb-1.5 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">{t.category}</span>
                </div>
                <span className="block text-xs font-medium text-foreground truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePosts;
