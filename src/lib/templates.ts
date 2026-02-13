export interface Template {
  id: string;
  name: string;
  category: string;
  type: "reel" | "photo";
  clips: number;
  duration: string;
  description: string;
  requiredPhotos: number;
  tags: string[];
  cover: string;
  previewUrl?: string;
}

export const templates: Template[] = [
  {
    id: "dramatic-reveal",
    name: "Dramatic Reveal",
    category: "Fashion",
    type: "reel",
    clips: 10,
    duration: "30s",
    description: "Cinematic slow-motion reveal with dramatic speed ramps. Perfect for luxury product launches.",
    requiredPhotos: 4,
    tags: ["Cinematic", "Slow-Mo", "Luxury"],
    cover: "./public/cover-reel.jpg",
    previewUrl: "./public/reel2.mp4",
  },
  {
    id: "smooth-glide",
    name: "Smooth Glide",
    category: "Minimal",
    type: "reel",
    clips: 8,
    duration: "25s",
    description: "Clean, smooth transitions with a minimalist aesthetic. Ideal for everyday wear and capsule collections.",
    requiredPhotos: 4,
    tags: ["Minimal", "Clean", "Smooth"],
    cover: "/assets/reel-cover.jpg",
  },
  {
    id: "fast-cuts",
    name: "Fast Cuts",
    category: "Streetwear",
    type: "reel",
    clips: 12,
    duration: "15s",
    description: "High-energy rapid cuts synced to beat drops. Made for bold streetwear and athletic brands.",
    requiredPhotos: 4,
    tags: ["Energetic", "Fast", "Beat-Sync"],
    cover: "/assets/reel-cover.jpg",
  },
  {
    id: "luxury-slowmo",
    name: "Luxury Slow-Mo",
    category: "Luxury",
    type: "reel",
    clips: 6,
    duration: "20s",
    description: "Ultra-slow motion with warm color grading. Showcases fabric texture and premium details.",
    requiredPhotos: 3,
    tags: ["Luxury", "Warm", "Texture"],
    cover: "/assets/reel-cover.jpg",
  },
  {
    id: "editorial-mood",
    name: "Editorial Mood",
    category: "Editorial",
    type: "reel",
    clips: 8,
    duration: "25s",
    description: "Magazine-inspired editorial cuts with moody color tones and rhythmic pacing.",
    requiredPhotos: 4,
    tags: ["Editorial", "Moody", "Magazine"],
    cover: "/assets/reel-cover.jpg",
  },
  {
    id: "post-classic",
    name: "Classic Grid",
    category: "Minimal",
    type: "photo",
    clips: 1,
    duration: "—",
    description: "Clean single-image post optimized for Instagram grid consistency.",
    requiredPhotos: 1,
    tags: ["Grid", "Clean"],
    cover: "./public/gemini template.png",
  },
  {
    id: "post-carousel",
    name: "Carousel Lookbook",
    category: "Fashion",
    type: "photo",
    clips: 4,
    duration: "—",
    description: "Multi-slide carousel format for lookbook-style product showcases.",
    requiredPhotos: 4,
    tags: ["Carousel", "Lookbook"],
    cover: "/assets/photo-cover.jpg",
  },
  {
    id: "post-split",
    name: "Split Layout",
    category: "Editorial",
    type: "photo",
    clips: 2,
    duration: "—",
    description: "Side-by-side comparison layout for before/after or outfit pairing.",
    requiredPhotos: 2,
    tags: ["Split", "Comparison"],
    cover: "/assets/photo-cover.jpg",
  },
  {
    id: "post-collage",
    name: "Mood Collage",
    category: "Streetwear",
    type: "photo",
    clips: 6,
    duration: "—",
    description: "Dynamic collage layout with overlapping images for an edgy, zine-inspired feel.",
    requiredPhotos: 4,
    tags: ["Collage", "Zine", "Edgy"],
    cover: "/assets/photo-cover.jpg",
  },
];

export const reelTemplates = templates.filter((t) => t.type === "reel");
export const postTemplates = templates.filter((t) => t.type === "photo");
