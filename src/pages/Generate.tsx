import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, Download, Play, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { reelTemplates } from "@/lib/templates";

const PLACEHOLDER_VIDEO = "./public/reel.mp4";
const MAX_PHOTOS = 4;

const Generate = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("template");
  const inputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(preselectedId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);

  const canGenerate = photos.length >= 1 && !!selectedTemplate;

  const handleUpload = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const total = photos.length + newFiles.length;
    if (total > MAX_PHOTOS) {
      toast({ title: "Too many photos", description: `Maximum ${MAX_PHOTOS} photos allowed.`, variant: "destructive" });
      return;
    }
    setPhotos((prev) => [...prev, ...newFiles]);
  };

  const handleRemove = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setProgress(0);

    const payload = {
      photos: photos.map((f) => f.name),
      templateId: selectedTemplate,
      prompt,
    };
    console.log("Generate Reel payload:", payload);

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
    setResultVideoUrl(PLACEHOLDER_VIDEO);
    setResultModalOpen(true);
    toast({ title: "Reel generated!", description: "Your Reel is ready to preview and download." });
  };

  const handleDownload = () => {
    if (!resultVideoUrl) return;
    const a = document.createElement("a");
    a.href = resultVideoUrl;
    a.download = "reel.mp4";
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Reel</h1>
        <p className="text-muted-foreground mt-1">Upload photos and create a fashion Reel.</p>
      </div>

      <div className="flex gap-6">
        {/* Left: Upload section */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            {/* Preview squares */}
            <div className="flex flex-col gap-3 w-20">
              {Array.from({ length: MAX_PHOTOS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden",
                    photos[i] && "border-solid border-primary/30"
                  )}
                >
                  {photos[i] ? (
                    <>
                      <img src={URL.createObjectURL(photos[i])} alt={`Photo ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemove(i)}
                        className="absolute top-1 right-1 rounded-full bg-destructive/90 text-destructive-foreground p-0.5 z-10 hover:bg-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Upload area */}
            <div
              className="flex-1 min-h-[calc(4*5rem+3*0.75rem)] rounded-lg border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary/40"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
            >
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mt-2">Upload Photos</p>
              <p className="text-xs text-muted-foreground">Drag & drop or click · max {MAX_PHOTOS}</p>
              {photos.length > 0 && (
                <p className="text-xs text-primary mt-1">{photos.length}/{MAX_PHOTOS} uploaded</p>
              )}
            </div>
          </div>

          {loading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generating your Reel…</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2">
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe how you want the reel to look..." className="flex-1" />
            <Button onClick={handleGenerate} disabled={!canGenerate || loading} className="gap-2 shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? `${progress}%` : "Generate"}
            </Button>
          </div>
        </div>

        {/* Right: Template toolbar */}
        <div className="w-48 space-y-2 shrink-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Templates</p>
          <div className="space-y-1.5">
            {reelTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={cn(
                  "w-full text-left rounded-lg border px-3 py-2.5 text-sm transition-all",
                  selectedTemplate === t.id
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border bg-card hover:border-primary/30 text-foreground"
                )}
              >
                <span className="block font-medium text-xs">{t.name}</span>
                <span className="block text-[10px] text-muted-foreground">{t.clips} clips · {t.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-auto p-0 overflow-auto">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Your Reel is Ready</DialogTitle>
            <DialogDescription>Preview and download your generated fashion Reel.</DialogDescription>
          </DialogHeader>
          {resultVideoUrl && (
            <div className="p-4 pt-2 space-y-4 flex flex-col items-center">
              <div className="w-auto h-auto max-w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={resultVideoUrl}
                  className="w-[min(500px,80vw)] aspect-[9/16]"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
              <Button onClick={handleDownload} className="w-full max-w-md gap-2">
                <Download className="h-4 w-4" />
                Download Reel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Generate;
