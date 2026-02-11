import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, Loader2, Download, Play } from "lucide-react";
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
import { AngleUploadSlot } from "@/components/AngleUploadSlot";
import { CatalogUploadArea } from "@/components/CatalogUploadArea";
import { templates } from "@/lib/templates";

const PLACEHOLDER_VIDEO = "https://www.instagram.com/reel/DPtn064CRsz/embed";

const ANGLE_LABELS = ["Front", "Back", "Left", "Right"];

const Generate = () => {
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("template");

  const [angles, setAngles] = useState<(File | null)[]>([null, null, null, null]);
  const [catalog, setCatalog] = useState<File[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(preselectedId);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultVideoUrl, setResultVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setProgress(0);

    const payload = {
      angles: angles.map((f) => f!.name),
      catalog: catalog.map((f) => f.name),
      templateId: selectedTemplate,
      prompt,
    };
    console.log("Generate Reel payload:", payload);

    // Simulate progress over ~4 seconds
    const duration = 4000;
    const interval = 80;
    let elapsed = 0;
    await new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        elapsed += interval;
        const p = Math.min(Math.round((elapsed / duration) * 100), 100);
        setProgress(p);
        if (elapsed >= duration) {
          clearInterval(timer);
          resolve();
        }
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

  useEffect(() => {
    if (resultModalOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [resultModalOpen]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Reel</h1>
        <p className="text-muted-foreground mt-1">Upload your catalog and create a fashion Reel.</p>
      </div>

      <div className="flex gap-6">
        {/* Left: Upload section */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            {/* 4 angle squares */}
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

            {/* Large catalog area */}
            <CatalogUploadArea files={catalog} onFilesChange={setCatalog} className="flex-1 min-h-[calc(4*5rem+3*0.75rem)]" />
          </div>

          {/* Progress bar */}
          {loading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Generating your Reel…</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Prompt + Generate */}
          <div className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want the reel to look..."
              className="flex-1"
            />
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
            {templates.map((t) => (
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Your Reel is Ready</DialogTitle>
            <DialogDescription>Preview and download your generated fashion Reel.</DialogDescription>
          </DialogHeader>
          {resultVideoUrl && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden bg-black aspect-video">
                <iframe
                  src={resultVideoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                />
              </div>
              <Button onClick={handleDownload} className="w-full gap-2">
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
