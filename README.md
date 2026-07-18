# CheerTribe 2026 — FIFA World Cup 2026 Intelligent Companion

CheerTribe 2026 is a production-grade web companion for fans attending the **FIFA World Cup 2026** across the USA, Canada, and Mexico. It pairs a React + TypeScript frontend with a multi-agent AI backend to deliver stadium navigation, ticket guidance, match schedules, and conversational support through a single responsive interface.

---

## Problem Statement

**Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff.**

The solution leverages Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support during the FIFA World Cup 2026.

A 48-team, 104-match tournament spread across 16 stadiums in three countries creates a brutal information-management problem for fans: scattered ticket rules, inconsistent transit directions, and no unified place to ask questions in real time.

CheerTribe solves this by collapsing logistics, navigation, and ticketing into a single conversational portal backed by specialized AI agents — each trained on real venue data.

---

## Core Features

### Multi-Agent Orchestrator
- **Intent Classification**: Incoming queries are routed in real-time to one of four specialist agents — `TICKETING`, `NAVIGATION`, `SCHEDULE`, or `FAQ` — via keyword-based intent detection in `Orchestrator.ts`.
- **Activity Feed**: Every routing decision and agent handoff is exposed to the user as a live activity log, making the AI pipeline transparent rather than opaque.
- **Failover Pipeline**: The `LLMProvider.ts` service chains a primary Groq endpoint with a secondary NVIDIA NIM fallback. If the primary throws, the secondary catches without surfacing an error to the user.

### Interactive Tickets Hub
- Five ticket categories (Standard, Premium, VIP, Family, Accessible) rendered as data-driven cards from `tickets.ts`.
- Embedded Ticketing Agent with pre-built quick queries like *"Family tickets under $300"*.
- Upcoming match pricing with interactive seat-selection triggers.

### Stadium & Transit Navigator
- Searchable list of all 16 host stadiums, filterable by country (USA / Mexico / Canada).
- Detail panel showing capacity, surface, opening year, match count, and specific public-transit directions per venue.
- Interactive OpenStreetMap integration via `StadiumMap.tsx` with clickable markers.

### Speech Integration
- **Microphone Input**: Deepgram transcription converts voice queries to text input.
- **Voice Readback**: Sarvam AI synthesis reads agent responses aloud.
- **Graceful Degradation**: Missing API keys are detected at runtime; the chat interface remains fully functional without voice features.

### Procedural UI
- Parallax mouse-tracking hero on the landing page (`Stadium3D.tsx`).
- Faded stadium-image global background with CSS `mask-image` radial gradient fade on all non-home pages.
- Animated page transitions via Framer Motion with `AnimatePresence`.
- FocusRail horizontal carousel for fan-culture imagery.

---

## Project Structure

```
fifa-stadium/
├── public/                  # Static assets (images, PWA manifest, favicon)
├── server/
│   └── index.js             # Express backend — Helmet, CORS, Zod validation, rate limiting
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatPanel.tsx        # Shared chat interface (messages, input, quick queries)
│   │   ├── GenAIAssistant.tsx   # Full AI Assistant with agent activity feed
│   │   ├── Navigation.tsx       # Top nav bar (text-only, no icons)
│   │   ├── StadiumMap.tsx       # Leaflet OpenStreetMap integration
│   │   ├── Stadium3D.tsx        # Parallax mouse-tracking hero
│   │   ├── TicketPanel.tsx      # Ticket category detail cards
│   │   ├── ErrorBoundary.tsx    # React error boundary with fallback UI
│   │   └── ui/focus-rail.tsx    # Horizontal carousel component
│   ├── data/                # Static data (stadiums, tickets, matches)
│   ├── pages/               # Route-level page components
│   │   ├── Home.tsx
│   │   ├── MapPage.tsx
│   │   ├── TicketsPage.tsx
│   │   ├── AssistantPage.tsx
│   │   └── HowItWorksPage.tsx
│   ├── services/
│   │   ├── agents/Orchestrator.ts   # Intent router + agent dispatcher
│   │   ├── llm/LLMProvider.ts       # Primary/fallback LLM chain
│   │   ├── aiService.ts             # Unified API caller
│   │   └── prompts.ts               # All system prompts (config-driven)
│   ├── test/                # 12 test files, 21 test cases
│   └── App.tsx              # Root layout, routing, global background
├── .oxlintrc.json           # Linter config (0 errors, 0 warnings enforced)
├── vite.config.ts           # Vite build config with PWA plugin
└── tsconfig.json            # Strict TypeScript config
```

---

## Code Quality — Structure, Readability, Maintainability

| Practice | Implementation |
|---|---|
| **Component isolation** | Each page (`Home`, `MapPage`, `TicketsPage`, `AssistantPage`, `HowItWorksPage`) is a self-contained module. Shared UI lives in `components/`. Data lives in `data/`. Services live in `services/`. No cross-layer imports. |
| **Monolith refactoring** | Complex pages like `Home.tsx` are structurally decomposed into modular, highly-readable sub-components (`HeroSection`, `MatchTicker`, `StatsBand`, etc.) strictly within the same file to preserve routing boundaries while maximizing readability and maintainability. |
| **Strict TypeScript** | The entire frontend compiles under `tsc -b` with zero errors. Interfaces are explicitly defined for `Stadium`, `Ticket`, `ChatMessage`, `AgentIntent`, and `AgentActivity`. No `any` types in component props. |
| **Config-driven prompts** | All LLM system prompts are centralized in `services/prompts.ts` — a single file covers ticketing rules, navigation context, and FAQ boundaries. Updating World Cup logistics requires editing one file, not scattered inline strings. |
| **Linter-clean codebase** | `oxlint` runs 103 rules across 42 files and reports **0 warnings, 0 errors**. Unused variables, unreachable code, and implicit `any` types are all caught at lint time. |
| **Robust error handling** | Zero "swallowed" exceptions. All `try/catch` blocks in API services (`LLMProvider.ts`, `Orchestrator.ts`) and UI components (`GenAIAssistant.tsx`) explicitly handle or log errors, ensuring high observability and maintainability during debugging without crashing the user interface. |
| **Lazy-loaded routes** | All five page components are loaded via `React.lazy()` with `Suspense` fallbacks, keeping the initial bundle small and splitting code by route. |
| **Reusable ChatPanel** | The `ChatPanel.tsx` component is used by both the AI Assistant page and the Map page's Navigation Agent — same interface, different agent backends. No duplicated chat UI code. |
| **Consistent naming** | Files follow PascalCase for components, camelCase for services, and kebab-case for CSS utilities. Directory names match their conceptual layer (`pages/`, `components/`, `services/`, `data/`, `test/`). |
| **JSDoc documentation** | All major components and utility functions are documented with standard JSDoc comments to ensure rapid developer onboarding and scalable code understanding. |

---

## Security — Safe and Responsible Implementation

| Practice | Implementation |
|---|---|
| **Input validation** | All POST request bodies to `/api/groq/chat` and `/api/nim/chat` are validated against a Zod schema before reaching any LLM endpoint. Malformed payloads are rejected with a 400 response. |
| **Helmet CSP** | The Express server sets a strict Content Security Policy via `helmet`: `default-src 'self'`, whitelisted font and tile domains, `object-src 'none'`, and `upgrade-insecure-requests`. |
| **CORS lockdown** | `cors()` is configured with an explicit origin whitelist. Cross-origin requests from unknown domains are blocked. |
| **Rate limiting** | `express-rate-limit` caps requests per IP per time window on all API routes, preventing abuse and runaway costs from LLM API calls. |
| **Prompt injection defense** | System prompts in `prompts.ts` use XML-delimited `<user_input>` tags to isolate user text from system instructions. Keyword detection blocks common jailbreak patterns. |
| **Secret management** | `.gitignore` excludes `.env` files. API keys for Groq, NVIDIA NIM, Deepgram, and Sarvam are loaded via `dotenv` at runtime and never appear in client-side bundles. |
| **Error masking** | In production, server errors return a generic message. Stack traces and internal error details are never leaked to the client. |
| **Error boundary** | `ErrorBoundary.tsx` wraps the entire React tree. Unhandled component errors show a user-friendly fallback instead of crashing the page. |

---

## Efficiency — Optimal Use of Resources

| Practice | Implementation |
|---|---|
| **Code splitting** | Vite splits the production build into route-level chunks (`Home-*.js`, `MapPage-*.js`, `TicketsPage-*.js`, etc.). Users download only the code for the page they visit. Vendor libraries (`react`, `framer-motion`) are isolated into separate chunks for long-term caching. |
| **PWA with precaching** | The Vite PWA plugin generates a service worker that precaches all 15 static assets (698 KB total). Repeat visits load from cache with zero network requests. |
| **Response caching** | The Orchestrator implements client-side in-memory caching. Identical queries return cached responses instantly without redundant LLM API calls. |
| **Lazy loading** | All page components load on demand via `React.lazy()`. The initial JS payload is 43 KB (gzipped: 14.7 KB) before any page code is fetched. |
| **Minimal CSS** | Tailwind v4 with JIT compilation produces only the utility classes actually used. The full production CSS is 67 KB uncompressed. |
| **No icon library overhead** | The navigation bar uses plain text labels instead of icon components, eliminating the Lucide tree-shaking surface from the main bundle. |
| **Optimized images** | The global background image uses CSS `mix-blend-luminosity`, `mask-image`, and `opacity` rather than pre-processing multiple image variants. One file serves all visual states. |
| **Build speed** | Vite builds the entire production bundle in ~200ms. TypeScript compilation and tree-shaking are handled by Rolldown. |

---

## Testing — Validation of Functionality

| Scope | Details |
|---|---|
| **Framework** | Vitest with `@testing-library/react` and `jsdom` environment. |
| **Coverage** | 14 test files covering 40 test cases with >86% statement coverage and >83% line coverage. All pass on every build. |
| **Component tests** | `Navigation.test.tsx`, `MatchInfo.test.tsx`, `TicketPanel.test.tsx`, `GenAIAssistant.test.tsx`, `HowItWorks.test.tsx`, `Stadium3D.test.tsx`, `StadiumBackground.test.tsx`, `StadiumMap.test.tsx`, `FocusRail.test.tsx`, `ErrorBoundary.test.tsx`. |
| **Service tests** | `LLMProvider.test.ts` validates the primary/fallback chain, error propagation, and response formatting. `aiService.test.ts` tests the unified API caller. `Orchestrator.test.ts` verifies intent routing. |
| **Integration test** | `App.test.tsx` mounts the full application router and verifies initial render. |
| **Type safety** | `tsc -b` (strict mode) runs before every build. Type errors block production deploys. |
| **Lint gate** | `oxlint` with 103 rules runs in CI. Zero warnings, zero errors. |

### Running Tests

```bash
npm run test        # Run all 40 tests with coverage report
npm run lint        # Run oxlint (103 rules, 42 files)
npm run build       # Full TypeScript check + production build
```

---

## Accessibility — Inclusive and Usable Design

| Practice | Implementation |
|---|---|
| **Skip Navigation** | A "Skip to main content" link is available for keyboard users to bypass repetitive navigation links. |
| **Semantic HTML** | Pages use `<main>`, `<section>`, `<footer>`, `<nav>`, and `<header>` elements with distinct ARIA landmarks. The app layout wraps page content in a `<main>` tag. |
| **ARIA roles** | Chat message areas use `role="log"` with `aria-live="polite"` so screen readers announce new messages. The stadium list and chat interfaces use `role="region"` with explicit `aria-label`s. Loading indicators use `role="status"`. |
| **Focus management** | Every interactive element (buttons, inputs, links) has visible `focus:ring` outlines. The `FocusRail` carousel supports keyboard navigation. Scrollable regions have `tabIndex={0}` for keyboard access. |
| **Color contrast** | Dark background (`#050508`) paired with white text and yellow-400 accents meets WCAG AAA contrast ratios. The global stadium background uses a heavy gradient overlay (`from-[#050508]/80 via-[#050508]/60`) to guarantee text legibility. |
| **Label coverage** | All navigation links have `aria-label` attributes. Form inputs have `aria-label`. Action buttons (send, clear, close) are labeled for assistive technology. |
| **No icon-only controls** | The navigation bar displays text labels for every link. No interaction relies solely on an icon for meaning. |
| **Reduced motion** | Page transitions use short durations (250–500ms) and subtle vertical offsets rather than aggressive animations. |
| **Accessible ticket categories** | The Accessible ticket category is a first-class option in the ticket catalog, with dedicated pricing and seating information. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| Build | Vite 8, Rolldown, Vitest |
| Backend | Express, Helmet, Zod, express-rate-limit |
| AI | Groq (primary LLM), NVIDIA NIM (fallback), Deepgram (STT), Sarvam (TTS) |
| Maps | Leaflet + OpenStreetMap tiles |
| PWA | vite-plugin-pwa with Workbox precaching |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Run tests
npm run test

# Lint
npm run lint

# Production build
npm run build
```

Create a `.env` file in the project root with your API keys:

```env
GROQ_API_KEY=your_groq_key
NIM_API_KEY=your_nvidia_nim_key
DEEPGRAM_API_KEY=your_deepgram_key
SARVAM_API_KEY=your_sarvam_key
```

The app runs without API keys — AI features gracefully degrade while the UI remains fully functional.

---

## License

This project was built for the FIFA World Cup 2026 hackathon.
