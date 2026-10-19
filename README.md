# Builders.mu — interactive workshop site

A scroll-driven site where visitors walk through the Builders.mu workshop and watch each person at work.
It's plain HTML/CSS/JS with no build step, so you can deploy it anywhere.

## Run locally
```bash
cd ~/Projects/builders-mu
python3 -m http.server 5173     # then open http://localhost:5173
```

## Versions
| Version | Where | What it is |
|---|---|---|
| **v3 (current)** | `/` (root) | v2's 3D workshop opening, Mission 60M and storytelling, plus v1's work animations (Raja's whiteboard, the day/night build, the edit timeline, Sahil's scooter run). Uses the real channel: Shorts, stats, and Raja's and Ratnam's photos. |
| v2: cinematic | `/versions/v2-cinematic/` | 3D workshop and photo-based chapters (photo time-lapse, live-tracking map) |
| v1: illustrated | `/versions/v1-illustrated/` | Fully illustrated: SVG office tour and cartoon chapters |

With the local server running, open `http://localhost:5173/` (v3), `/versions/v2-cinematic/` or `/versions/v1-illustrated/`.

**Real content in v3:** Shorts, views and dates come from the YouTube channel feed. Stats are 39.8K subscribers and 68 videos on YouTube, 53K followers and 99 posts on Instagram (Oct 2026). Raja's and Ratnam's portraits are cropped from Shorts frames (`assets/team/`). To refresh the videos, see the comment at the top of `js/data.js`.

## What's on the page (in scroll order)
| # | Section | Technique |
|---|---------|-----------|
| 0 | Film-leader loader (3·2·1), click to enter | GSAP counter + conic sweep + clip-path wipe |
| 1 | **Real-time 3D workshop** with all seven people at their stations; the camera flies War room → Writer's desk → Bench → Robot close-up → Edit bay → Loading door | Three.js PBR lighting, soft shadows, bloom, fog, sparks and dust; camera keyframes scrubbed by ScrollTrigger; name labels track each person in 3D; camera-viewfinder HUD and letterbox |
| 2a | **Mission 60M**: Raja's command centre | Rolling odometer to 60,000,000; live Q4 countdown and quarter progress; a command network with orders pulsing from Raja to each person; a 13-week target-pace chart with a TODAY marker |
| 2b | Raja: the whiteboard plan draws itself | Stroke-draw on scroll, sticky notes |
| 3 | Ratnam: the storytelling | Pinned word-by-word reveal + audience-retention curve (hook / struggle / payoff) |
| 4 | Ratnam: the script | Scroll-scrubbed typewriter |
| 5 | Sudhanshu & Aryan: 72 hours of day and night | SVG scene: gradient sky, sun/moon orbit, clouds, shooting star, lamp cone at night, robot assembling, chai cups, clock, build log |
| 6 | Prateek & Virendra: the edit | NLE timeline, playhead, timecode, cuts between frames |
| 7 | Sahil: the market run | Scooter riding the route on a map, vendor call bubbles, checklist |
| 8 | Pipeline: Idea → 60M | Pinned horizontal scroll, photo cards |
| 9 | Crew: drag rail | Draggable + Inertia (cinematic monogram cards until real photos are added) |
| 9b | **Lab exhibit: Shinchan sanitizer** | Real gadget photo from the Short. Hand (cursor or tap) in front of the sensor → a sanitizer arc follows the hand with droplets, and the team peeking from behind bursts out laughing. Counters for hands sanitized and laughs |
| 10 | Latest Shorts (real), Instagram, Blog, stats, Footer | Drag-scroll Shorts rail, count-ups, photo credits |

## Editing content
**Everything is in `js/data.js`:** team lines, YouTube and Instagram links, videos, blog posts and community numbers.
- **Real photos:** put `raja.jpg` and the others in `assets/team/`, then set `photo: "assets/team/raja.jpg"`.
- **Real thumbnails:** set `thumb: "https://i.ytimg.com/vi/<VIDEO_ID>/maxresdefault.jpg"` and `url` to the video.
- **Mission 60M:** target, quarter dates and Raja's orders to each person are under `mission`.
- **Photo credits:** the photos in `assets/img/` are Creative Commons and must keep the footer credit. Replace them with your own shoots, then delete their entries in `credits.json`.

## Files
```
index.html      page structure and copy
css/style.css   design tokens, layout, responsive rules
js/data.js      ← edit content here
js/content.js   builds the data-driven DOM (network, odometer, pace chart, team, Shorts, stats)
js/scenes.js    the per-person work animations (SVG): whiteboard, day/night build, edit frames, scooter map
js/workshop3d.js the Three.js workshop (lights, people, props, camera, labels)
assets/img/     photos (CC-licensed; credits.json drives the footer credits)
js/main.js      all animation (Lenis + GSAP ScrollTrigger timelines)
```

## Deploy to builders.mu.com
1. Push this folder to GitHub.
2. Import the repo on **Vercel** or **Netlify** (framework: "Other", no build command, output directory `/`).
3. In your domain registrar's DNS settings, point the domain at the host. On Vercel that's `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`.

## Upgrade path (to match the reference site's polish)
- **Real footage in place of the SVGs:** shoot each person at their desk, export about 120 frames as WebP, and draw them to a `<canvas>` scrubbed by ScrollTrigger (the "Apple AirPods" image-sequence technique).
- **Lottie or Rive** characters made by Virendra in After Effects, driven by scroll progress.
- **Sound:** the reference plays ambient audio after the click-to-enter. Add workshop ambience such as soldering, keyboards and chai.
- **Next.js port:** move each section into a React component and use `@gsap/react`'s `useGSAP()`. The animation code carries over unchanged.
