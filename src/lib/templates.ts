export interface Template {
  id: string;
  name: string;
  category: string;
  clips: number;
  duration: string;
  description: string;
  requiredPhotos: number;
  tags: string[];
  previewUrl?: string;
}

export const templates: Template[] = [
  {
    id: "dramatic-reveal",
    name: "Dramatic Reveal",
    category: "Fashion",
    clips: 10,
    duration: "30s",
    description: "Cinematic slow-motion reveal with dramatic speed ramps. Perfect for luxury product launches.",
    requiredPhotos: 4,
    tags: ["Cinematic", "Slow-Mo", "Luxury"],
  },
  {
    id: "smooth-glide",
    name: "Smooth Glide",
    category: "Minimal",
    clips: 8,
    duration: "25s",
    description: "Clean, smooth transitions with a minimalist aesthetic. Ideal for everyday wear and capsule collections.",
    requiredPhotos: 4,
    tags: ["Minimal", "Clean", "Smooth"],
  },
  {
    id: "fast-cuts",
    name: "Fast Cuts",
    category: "Streetwear",
    clips: 12,
    duration: "15s",
    description: "High-energy rapid cuts synced to beat drops. Made for bold streetwear and athletic brands.",
    requiredPhotos: 6,
    tags: ["Energetic", "Fast", "Beat-Sync"],
  },
  {
    id: "luxury-slowmo",
    name: "Luxury Slow-Mo",
    category: "Luxury",
    clips: 6,
    duration: "20s",
    description: "Ultra-slow motion with warm color grading. Showcases fabric texture and premium details.",
    requiredPhotos: 3,
    tags: ["Luxury", "Warm", "Texture"],
  },
  {
    id: "editorial-mood",
    name: "Editorial Mood",
    category: "Editorial",
    clips: 8,
    duration: "25s",
    description: "Magazine-inspired editorial cuts with moody color tones and rhythmic pacing.",
    requiredPhotos: 4,
    tags: ["Editorial", "Moody", "Magazine"],
  },
];

export const postTemplates: Template[] = [
  {
    id: "post-classic",
    name: "Classic Grid",
    category: "Minimal",
    clips: 1,
    duration: "—",
    description: "Clean single-image post optimized for Instagram grid consistency.",
    requiredPhotos: 1,
    tags: ["Grid", "Clean"],
  },
  {
    id: "post-carousel",
    name: "Carousel Lookbook",
    category: "Fashion",
    clips: 4,
    duration: "—",
    description: "Multi-slide carousel format for lookbook-style product showcases.",
    requiredPhotos: 4,
    tags: ["Carousel", "Lookbook"],
  },
  {
    id: "post-split",
    name: "Split Layout",
    category: "Editorial",
    clips: 2,
    duration: "—",
    description: "Side-by-side comparison layout for before/after or outfit pairing.",
    requiredPhotos: 2,
    tags: ["Split", "Comparison"],
  },
  {
    id: "post-collage",
    name: "Mood Collage",
    category: "Streetwear",
    clips: 6,
    duration: "—",
    description: "Dynamic collage layout with overlapping images for an edgy, zine-inspired feel.",
    requiredPhotos: 4,
    tags: ["Collage", "Zine", "Edgy"],
  },
];
