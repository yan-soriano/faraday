import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CatalogUploadAreaProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  className?: string;
}

export function CatalogUploadArea({ files, onFilesChange, className }: CatalogUploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (newFiles: FileList) => {
    onFilesChange([...files, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary/40",
        dragOver && "border-primary bg-primary/5",
        files.length > 0 && "p-3",
        className
      )}
      onClick={() => files.length === 0 && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />

      {files.length === 0 ? (
        <div className="flex flex-col items-center gap-2 text-center p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Upload Catalog</p>
          <p className="text-xs text-muted-foreground">Drag & drop or click to add product images</p>
        </div>
      ) : (
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{files.length} file(s)</span>
            <button onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }} className="text-xs text-primary hover:underline">+ Add more</button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
            {files.map((f, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-muted">
                <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="absolute top-0.5 right-0.5 rounded-full bg-destructive/90 text-destructive-foreground p-0.5 hover:bg-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
