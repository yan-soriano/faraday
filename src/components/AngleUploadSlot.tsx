import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AngleUploadSlotProps {
  label: string;
  image: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export function AngleUploadSlot({ label, image, onUpload, onRemove }: AngleUploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/50 overflow-hidden",
        image && "border-solid border-primary/30"
      )}
      onClick={() => !image && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt={label} className="absolute inset-0 w-full h-full object-cover" />
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-1 right-1 rounded-full bg-destructive/90 text-destructive-foreground p-0.5 z-10 hover:bg-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <Plus className="h-5 w-5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
        </>
      )}
    </div>
  );
}
