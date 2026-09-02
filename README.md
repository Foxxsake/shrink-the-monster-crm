# Shrink the Monster — Mobile-First Modular CRM

> **"Tell us what you actually need. We remove everything else."**

Shrink the Monster is an ultra-fast, offline-capable Progressive Web Application (PWA) designed specifically for small service businesses, sole traders, and mobile professionals. Standard CRMs are often bloated with complex enterprise features; Shrink the Monster lets you toggle on only the business modules you need today and hide the rest.

---

## 🚀 Key Features

* **Modular Workspace**: Toggle Customers, Scheduled Jobs, Tasks, Site Notes, Follow-ups, and Invoice Tracker on or off at any time.
* **Quick Add Modal**: Fast, unified entry for adding clients, jobs, tasks, notes, follow-ups, or payments from anywhere in the app with built-in client validation.
* **Offline-First Resilience**: Powered by a local storage data engine and a Service Worker caching stable application shell assets.
* **Mobile-First PWA**: Native-like experience with installability on Android and iOS devices, full touch support, and responsive layouts.
* **Bold Typography UI**: High-contrast, dark-mode design with warm orange accents (`#FF5722`) and clear visual hierarchy.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 19 + TypeScript 5.8
* **Build Tooling**: Vite 6
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide React
* **Animations**: Motion
* **Persistence**: Client-side `localStorage` with JSON serialization
* **PWA & Offline**: Custom Service Worker (`sw.js`) and Web App Manifest (`manifest.webmanifest`)

---

## 💻 Local Setup & Development

### Prerequisites

* Node.js v18 or later
* npm v9 or later

### Installation

```bash
# Install dependencies
npm install
```

### Running Development Server

```bash
# Start Vite development server at http://localhost:3000
npm run dev
```

### Type Checking, Testing & Production Build Verification

```bash
# Run TypeScript compilation, Vitest tests, and Vite build sequentially
npm run check
```

### Running Tests

```bash
# Run automated Vitest suite once
npm run test

# Run tests in watch mode during development
npm run test:watch
```

### Static-Host Deployment

* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **SPA Fallback & Caching**: Pre-configured via `public/_redirects` and `public/_headers` for static hosting platforms (such as Cloudflare Pages, Netlify, Vercel, or Nginx).

---

## 📲 PWA Installation & Physical Testing Notice

### Installing on Android (Chrome or Edge)
1. Open the app URL in Google Chrome or Microsoft Edge.
2. Tap the **Install** button in the header OR open the browser menu (**⋮** or **…** in top right).
3. Select **Install app** or **Add to Home screen**.
4. Confirm by tapping **Install**. The app icon will now appear on your home screen and app drawer.

### Installing on iPhone / iPad (Safari)
1. Open the app URL in Apple Safari.
2. Tap the **Share** icon at the bottom of the screen (box with an arrow pointing up).
3. Scroll down the menu and tap **Add to Home Screen**.
4. Tap **Add** in the top right corner. The app will open in fullscreen standalone mode from your home screen.

> ⚠️ **Deployment Notice**: The app has been validated in desktop and mobile preview environments. Final PWA installability and offline caching on a physical phone will be validated following static-host deployment.

---

## 🔒 Storage & Scope Limitations

* **Local Storage Only**: Data currently lives only in browser local storage (`localStorage`).
* **Clearing Site Data**: Clearing browser cache or site data removes all stored records.
* **Backend & Authentication**: Supabase, Cloud SQL, multi-user accounts, and backend server syncing are **not** implemented.
* **No Secret Keys**: No Gemini or API keys are required or exposed.

---

## 📋 Release Summary & Repair History

* **Hook Ordering Fix**: Resolved React hook rendering violations in `QuickAddModal.tsx`.
* **Service Worker Overhaul**: Cleaned up precache entries in `public/sw.js` to prevent missing `/src` file errors.
* **PWA Phone Install Controls**: Enabled mobile install prompts and fixed iOS share instructions link.
* **Icon Assets**: Generated valid 192x192, 512x512, and maskable PNG icons for cross-platform PWA compliance.
* **Clean Dependencies**: Removed unused server packages (`express`, `dotenv`, `@google/genai`, `tsx`, `esbuild`).
