# 🌟 KidLearn

A bright, friendly **Progressive Web App** that teaches **Animals, Birds, Counting (1–10) and the ABC** to children aged **2–6**. Built to be **installed on an iPhone** ("Add to Home Screen") and to work **completely offline** after the first load.

- 👆 **Kids-only UX** — just tap and scroll. No menus, no dropdowns, no text to read to navigate.
- 🔊 **Talks to your child** — every card speaks its word out loud using the device's built-in voice (Web Speech API), so there are **no audio files to download**.
- 📱 **Installable & offline** — a real home-screen app via a service worker (cache-first).
- 🎨 **Playful & animated** — Framer Motion animations, rounded fonts, soft gradients and floating shapes.
- ♿ **Respects `prefers-reduced-motion`** and uses large 60×60px+ touch targets.

---

## 🧱 Tech Stack

| Purpose        | Choice                              |
| -------------- | ----------------------------------- |
| Framework      | **React 18 + TypeScript**           |
| Build tool     | **Vite 5**                          |
| PWA            | **vite-plugin-pwa** (Workbox)       |
| Animation      | **Framer Motion**                   |
| Audio          | **Web Speech API** + **Howler.js**  |
| Styling        | **Tailwind CSS** (hand-crafted UI)  |
| Fonts          | **Baloo 2** + **Nunito** (bundled)  |

---

## 🚀 Quick Start

> Requires **Node.js 18+** (Node 20/22 recommended).

```bash
# 1. Install dependencies
npm install

# 2. Generate the PWA icons + iPhone splash screens (one-time; re-run if you tweak the logo)
npm run generate-icons

# 3. Download the real animal & bird sounds (one-time; needs internet)
npm run fetch-sounds

# 4. Start the dev server
npm run dev
```

Then open the printed URL (default **http://localhost:5173**).

### Other scripts

```bash
npm run build     # Type-check + production build into /dist
npm run preview   # Serve the production build locally (great for testing the PWA + offline)
```

> 💡 The service worker is enabled in dev too, so you can test install/offline immediately.
> To test on your **real iPhone** over your local network, run `npm run preview` and open
> the "Network" URL it prints from Safari on the phone (both devices on the same Wi‑Fi).

---

## 📂 Project Structure

```
kidlearn/
├─ public/
│  ├─ favicon.svg                # generated
│  └─ icons/                     # generated PWA icons + iPhone splash screens
├─ scripts/
│  └─ generate-icons.mjs         # renders all icons/splash from one vector source
├─ src/
│  ├─ components/
│  │  ├─ HomeScreen.tsx          # 4 bounce-in category cards
│  │  ├─ CategoryScreen.tsx      # vertical snap-scroll of items
│  │  ├─ ItemCard.tsx            # one full-screen learning card (3 layouts)
│  │  ├─ BackButton.tsx          # pulsing back-to-home button
│  │  └─ FloatingShapes.tsx      # decorative animated background
│  ├─ data/
│  │  ├─ types.ts                # shared Category / Item types
│  │  ├─ animals.ts              # 🐘 10 animals
│  │  ├─ birds.ts                # 🦜 10 birds
│  │  ├─ counting.ts             # 🔢 numbers 1–10
│  │  └─ abc.ts                  # 🔤 letters A–Z
│  ├─ hooks/
│  │  ├─ useSnapScroll.ts        # detects the snapped card (IntersectionObserver)
│  │  └─ useSpeech.ts            # Web Speech API + Howler + iOS audio unlock
│  ├─ styles/
│  │  └─ globals.css             # Tailwind + base + reduced-motion
│  ├─ App.tsx                    # navigation (home ⇄ category)
│  └─ main.tsx                   # entry + bundled fonts
├─ index.html                    # iOS meta tags + splash <link>s
├─ vite.config.ts                # vite-plugin-pwa (manifest + Workbox)
├─ tailwind.config.js
└─ vercel.json
```

---

## 🧩 How it works

- **Navigation** is just two states: the **home** list and a **category**. Entering a category
  slides in from the right; the back button (or an iPhone edge-swipe) returns home.
- Each category is a **`scroll-snap-type: y mandatory`** scroller. `useSnapScroll` watches the
  cards with an `IntersectionObserver` and reports which one is centred.
- When a card snaps into view it **pops** (Framer Motion) and **speaks** its word.
  - **iOS note:** Safari only allows speech after a first user gesture, so tapping a category
    card "unlocks" audio — every snap after that speaks automatically.
- Want real animal/bird **sound effects**? They're already wired up: `npm run fetch-sounds`
  downloads real recordings into `public/sounds/` and each animal/bird says its name and then
  plays its actual sound (via Howler.js). See [`public/sounds/CREDITS.md`](public/sounds/CREDITS.md)
  for sources and licensing notes, and to swap in your own clips.

---

## ☁️ Deploy free to Vercel (one command)

```bash
npm i -g vercel     # once
vercel --prod       # from the project root — accept the defaults
```

Vercel auto-detects Vite, runs `npm run build`, and serves `/dist` over HTTPS (required for PWAs).
`vercel.json` is already configured with the correct build output and service-worker caching headers.

> Prefer the dashboard? Push this repo to GitHub and **Import** it at
> [vercel.com/new](https://vercel.com/new) — no settings to change.

**Alternatives:** the static `dist/` folder also deploys as-is to Netlify, Cloudflare Pages or GitHub Pages.

---

## 📲 Install on an iPhone (Add to Home Screen)

1. Open the deployed **https://** URL in **Safari** (Chrome on iOS can't install PWAs).
2. Tap the **Share** button (the square with an up-arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** — **KidLearn** now has its own icon and launches full-screen.
5. Open it once while online so the service worker caches everything — after that it **works offline** ✈️.

Portrait orientation is locked and the status bar is styled for a clean, full-screen kid experience.

---

## 🧪 Quality targets

- **Lighthouse PWA: installable & offline-ready** (manifest + service worker + all icon sizes).
- **No layout shift (CLS ≈ 0)** — content uses text/emoji with reserved space and bundled fonts.
- **Responsive** from iPhone SE (375px) to iPhone Pro Max (430px), portrait-locked via the manifest.
- Images: the app uses scalable emoji/vector art (no raster downloads), so there's nothing to lazy-load or blur.

---

## 📜 License & credits

- Fonts: **Baloo 2** and **Nunito** (SIL Open Font License) via `@fontsource`.
- Emoji are rendered by the device (on iPhone these are Apple's high-resolution emoji).

Made with ❤️ for tiny learners.
