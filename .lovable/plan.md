

# Fashion Content Platform — MVP Technical Plan
## Automated Fashion Reels with AI-Powered Content Generation

---

## 1. Platform Overview

A platform that automates the creation of fashion Reels for social media (Instagram, TikTok) by combining AI-generated images, AI-generated video clips, and automated FFmpeg video editing with speed-ramp effects — all driven by reusable JSON templates.

**Core Value Proposition:** Fashion brands and creators upload a catalog (product images or descriptions) → the platform generates styled fashion images via AI → converts them to video clips → applies cinematic speed-ramp effects and music → outputs a ready-to-post Reel.

---

## 2. Architecture Overview

```
┌─────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Frontend   │────▶│   Backend (API)      │────▶│  Processing Layer   │
│  React.js    │◀────│   Spring Boot        │◀────│  FFmpeg + AI APIs   │
│  (Lovable)   │     │   PostgreSQL         │     │  (GPU Cloud Server) │
└─────────────┘     └──────────────────────┘     └─────────────────────┘
```

**Three-tier architecture:**
- **Frontend (React):** Dashboard for uploading catalogs, selecting templates, previewing Reels, managing subscriptions
- **Backend (Spring Boot):** REST API, user auth, credit management, job orchestration, template CRUD
- **Processing Layer (GPU Server):** FFmpeg video processing, Nano Banana Pro image generation, Kling 3.0 video generation

---

## 3. Pipeline: From Input to Final Reel

```
Catalog Upload → AI Image Generation (Nano Banana Pro) → AI Video Generation (Kling 3.0)
    → FFmpeg Speed-Ramp + Transitions → Music Overlay → Final Reel Export → User Download/Share
```

### Detailed Pipeline Stages:

1. **Input:** User uploads product images or text descriptions for a fashion catalog
2. **AI Image Generation:** Nano Banana Pro generates 10 styled fashion images per catalog (e.g., model wearing product, lifestyle shots)
3. **AI Video Generation:** Kling 3.0 converts each AI image into a 3-5 second video clip with motion
4. **Template Application:** System reads the selected JSON template to determine clip order, speed curves, transition points, and music
5. **FFmpeg Processing:**
   - Apply speed-ramp per clip (slow-mo → normal → fast segments)
   - Smooth transitions between speed segments using frame interpolation
   - Concatenate all clips in template-defined order
   - Overlay selected music track, synced to beat markers if defined in template
   - Export final Reel (9:16 aspect ratio, 1080x1920, H.264, 30fps)
6. **Output:** Final Reel available for download or direct social media posting

---

## 4. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js (built in Lovable) | User dashboard, template browser, preview |
| Backend API | Spring Boot (Java 17+) | REST API, auth, business logic, job queue |
| Database | PostgreSQL | Users, templates, credits, generation history |
| Video Processing | FFmpeg 6.x | Speed-ramp, concatenation, music overlay |
| AI Image Gen | Nano Banana Pro (google/gemini-3-pro-image-preview) | Fashion image generation |
| AI Video Gen | Kling 3.0 API | Image-to-video conversion |
| Job Queue | Redis + Spring Task/Celery | Async processing pipeline |
| Storage | S3-compatible (MinIO or AWS S3) | Store clips, images, final Reels |
| Hosting | Cloud VM with GPU (e.g., AWS g5, Hetzner GPU) | AI inference + FFmpeg |

---

## 5. FFmpeg Speed-Ramp Algorithm

### How Speed-Ramp Works:
Speed-ramp = varying playback speed within a single clip. A 3-second clip might play at 0.5x (slow-mo) for 1s, then ramp to 2x (fast) for 1s, then back to 1x for 1s.

### Implementation Approach:

**Step 1: Segment each clip based on template speed curve**
- Template defines time ranges and target speeds: `[{start: 0, end: 1.0, speed: 0.5}, {start: 1.0, end: 2.0, speed: 2.0}, ...]`
- Split clip into segments using `ffmpeg -ss` and `-t` flags

**Step 2: Apply speed change per segment**
- Use `setpts` filter for video: `setpts=(1/speed)*PTS`
- Use `atempo` filter for audio (chain multiple if speed > 2x or < 0.5x)

**Step 3: Smooth transitions between speed segments**
- Use `xfade` filter between segments for visual smoothness
- Alternatively, use frame blending (`minterpolate`) at speed transition points

**Step 4: Concatenate all processed segments**
- Use FFmpeg concat demuxer with a file list
- Apply global color grading/LUT if defined in template

**Step 5: Music overlay**
- Mix music track using `amix` or `amerge` filter
- Trim music to match final video duration
- Apply fade-in/fade-out on music

### Pseudocode:
```
function processReel(clips[], template, musicTrack):
    processedSegments = []
    
    for each clip in clips:
        speedCurve = template.getSpeedCurve(clip.index)
        segments = splitBySpeedPoints(clip, speedCurve)
        
        for each segment in segments:
            adjusted = applySpeedChange(segment, segment.targetSpeed)
            processedSegments.append(adjusted)
    
    concatenated = concatenateWithTransitions(processedSegments, template.transitionType)
    withMusic = overlayMusic(concatenated, musicTrack, template.musicSync)
    finalReel = exportVideo(withMusic, format="mp4", resolution="1080x1920")
    
    return finalReel
```

---

## 6. Template System (JSON Schema)

```json
{
  "templateId": "fashion-dramatic-01",
  "name": "Dramatic Fashion Reveal",
  "category": "fashion",
  "duration": 30,
  "aspectRatio": "9:16",
  "clipCount": 10,
  "clips": [
    {
      "index": 0,
      "durationMs": 3000,
      "speedCurve": [
        {"startMs": 0, "endMs": 1000, "speed": 0.5},
        {"startMs": 1000, "endMs": 2000, "speed": 1.5},
        {"startMs": 2000, "endMs": 3000, "speed": 1.0}
      ],
      "transition": {"type": "xfade", "durationMs": 500, "style": "fade"}
    }
  ],
  "music": {
    "trackId": "track-001",
    "volume": 0.7,
    "fadeInMs": 500,
    "fadeOutMs": 1000,
    "beatMarkers": [0, 500, 1000, 1500]
  },
  "effects": {
    "colorGrading": "warm-fashion",
    "vignette": true
  }
}
```

Templates are stored in PostgreSQL and can be added by the team via an admin panel. Future: user-generated templates with royalty tracking per usage.

---

## 7. Modules & Functions Breakdown

### Module 1: VideoProcessor
- `splitClipBySpeedPoints(clip, speedCurve)` — Segments a clip at speed transition points
- `applySpeedChange(segment, speed)` — Changes playback speed using FFmpeg setpts
- `concatenateClips(segments[], transitionConfig)` — Joins clips with transitions
- `overlayMusic(video, musicTrack, config)` — Adds music with volume/fade settings
- `exportReel(video, format, resolution)` — Final export to MP4

### Module 2: TemplateManager
- `getTemplate(templateId)` — Retrieve template JSON
- `listTemplates(category, filter)` — Browse available templates
- `applyTemplate(clips[], template)` — Orchestrate full processing pipeline
- `createTemplate(templateJson)` — Admin: add new template
- `validateTemplate(templateJson)` — Validate template schema

### Module 3: AIIntegration
- `generateImages(catalogDescription, count)` — Call Nano Banana Pro API
- `generateVideoClips(images[], motionStyle)` — Call Kling 3.0 API
- `checkGenerationStatus(jobId)` — Poll for async AI job completion
- `downloadGeneratedAsset(assetUrl)` — Fetch and store generated content

### Module 4: UserModule
- `registerUser()` / `loginUser()` — Authentication
- `getSubscriptionTier(userId)` — Check plan
- `checkCredits(userId, action)` — Verify sufficient credits
- `deductCredits(userId, amount, action)` — Consume credits
- `upgradeSubscription(userId, plan)` — Handle plan changes

### Module 5: Database / Storage
- Users table, Subscriptions table, Credits ledger
- Templates table, Music library table
- Generation history (jobs, status, output URLs)
- S3 bucket for images, clips, and final Reels

### Module 6: API Layer (Spring Boot REST)
- `POST /api/reels/generate` — Trigger full pipeline
- `GET /api/reels/{id}/status` — Check job status
- `GET /api/templates` — List templates
- `POST /api/catalog/upload` — Upload product catalog
- `GET /api/user/credits` — Check remaining credits

---

## 8. Freemium & Subscription Logic

| Feature | Free Tier | Basic (paid) | Pro (paid) |
|---------|-----------|-------------|------------|
| Reels per month | 1 | 10 | Unlimited |
| AI images per Reel | 2-3 | 10 | 10+ |
| Templates | Basic only | All | All + custom |
| Music library | Limited | Full | Full |
| Resolution | 720p | 1080p | 1080p |
| Watermark | Yes | No | No |
| Price | Free | ~$15/mo | ~$45/mo |

Credit system: Each AI image costs 1 credit, each AI video clip costs 3 credits, each Reel export costs 5 credits. Free tier gets 10 credits/month.

---

## 9. Infrastructure Recommendation

Since you haven't decided on backend infrastructure:

**Recommended setup for MVP:**
- **1 GPU Cloud Server** (Hetzner GPU or AWS g5.xlarge): Runs FFmpeg + hosts AI API calls. ~$150-300/month
- **1 App Server** (standard VM): Runs Spring Boot + PostgreSQL + Redis. ~$30-50/month
- **S3 storage:** For all media assets. Pay-per-use
- **Alternative:** Use a managed GPU service (Replicate, RunPod) for AI inference only, keep FFmpeg on a cheaper server

**Why not serverless?** FFmpeg processing and AI inference require persistent compute and GPU access — not suitable for edge functions or serverless.

---

## 10. Testing & Validation Plan

- **Stage 1 Test:** Manually prepare 10 video clips → run FFmpeg pipeline → verify speed-ramp accuracy by comparing frame timestamps
- **Template Test:** Apply 3 different templates to same clips → verify different output styles
- **AI Integration Test:** Generate images with Nano Banana Pro → verify quality and relevance
- **End-to-End Test:** Full pipeline from catalog upload to final Reel download
- **Load Test:** Simulate 10 concurrent Reel generation jobs

---

## 11. MVP Timeline (15 Weeks)

| Weeks | Phase | Deliverables |
|-------|-------|-------------|
| 1-2 | Setup & Architecture | Server setup, DB schema, project scaffold, CI/CD |
| 3-5 | FFmpeg Core (Stage 1) | Speed-ramp algorithm, concatenation, music overlay with 10 test clips |
| 6-7 | Template System | JSON schema, template CRUD, template application logic |
| 8-9 | AI Image Integration (Stage 2) | Nano Banana Pro integration, image generation pipeline |
| 10-11 | AI Video Integration (Stage 3) | Kling 3.0 integration, image-to-video pipeline |
| 12-13 | Full Pipeline (Stage 4) | End-to-end: catalog → AI images → AI video → FFmpeg → Reel |
| 14 | Freemium & Subscriptions (Stage 5) | Credit system, subscription tiers, payment integration |
| 15 | Frontend Dashboard & QA | React UI in Lovable, testing, bug fixes, soft launch |

---

## 12. What to Build in Lovable

The **React frontend dashboard** can be built in Lovable, connecting to your Spring Boot backend API:

- **Landing page** with pricing/plans
- **User dashboard:** view credits, generation history, download Reels
- **Template browser:** preview and select templates
- **Catalog upload:** drag-and-drop image upload
- **Reel generation flow:** select template → choose music → generate → preview → download
- **Subscription management:** plan selection, upgrade/downgrade
- **Admin panel:** manage templates, music library, view analytics

