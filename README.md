# Nexus 2026 — FIFA World Cup 2026 Intelligent Companion

Nexus 2026 is a premium, high-fidelity web companion application designed for fans attending the **FIFA World Cup 2026** across the USA, Canada, and Mexico. Powered by a multi-agent AI orchestrator, the application provides an immersive, responsive, and seamless experience to help users navigate matches, buy tickets, find transit routes, and interact with the tournament.

---

## 🌟 Alignment with Problem Statement

The application directly addresses the core challenge of managing mass logistics, navigation, ticketing queries, and user experience for a multi-country, 48-team, 104-match international tournament.

By combining **Procedural Web Tech (React + TypeScript + Tailwind)** with **Agentic AI Orchestration**, Nexus 2026 serves as a single unified portal that adapts contextually to users' intents, solving:
- **Mass Information Clutter**: Collapsing complex stadium rules, match schedules, and ticket types into a simple conversational interface.
- **Multimodal Accessibility**: Accommodating dynamic environments (like noisy stadiums) via speech-to-text input.
- **Offline / Transport Constraints**: Providing highly cached, lightweight transit instructions and stadium details.

---

## 🚀 Core Features

### 1. Multi-Agent Orchestrator
- **Intent-Based Routing**: Classifies queries in real-time into four specialized tracks: `TICKETING`, `NAVIGATION`, `SCHEDULE`, and `FAQ`.
- **Live Activity Feed**: Exposes agent operations (e.g., *Intent Router classifying query*, *Ticketing Agent consulting metadata*, *Primary LLM generating response*) to the user for structural transparency.
- **Resilient Fallback Pipeline**: Multi-level routing automatically redirects traffic from primary Groq endpoints to local NVIDIA NIM configurations if API failures occur.

### 2. Interactive Tickets Hub
- Integrated **Ticketing Agent** with pre-defined quick snippets (e.g., "Family tickets under $300").
- Real-time catalog of all 5 ticket categories with description cards.
- Live upcoming match pricing with interactive ticket select triggers.

### 3. Stadium & Transit Navigator
- Searchable catalog of all **16 Host Stadiums** across the USA, Canada, and Mexico.
- Filterable by host country (USA, Mexico, Canada).
- Dynamic details panel showing Opened Year, Pitch Surface, Total Matches, and precise Public Transit routes (e.g., NJ Transit to Meadowlands Station, SEPTA Broad Street Line to NRG Station).

### 4. Speech Integration
- **Microphone Transcription**: Built-in Deepgram transcription converting audio voice queries to chat input in under 300ms.
- **Voice Response Readout**: Integration with Sarvam AI for natural speech synthesis readbacks.
- **Fail-Safe Mechanism**: Silently falls back if API keys are missing, ensuring the chat interface remains fully operational.

### 5. Premium Procedural UI/UX
- **3D Parallax Mouse Tracker**: Interactive pitch-ball visualizer on the landing page reacting to mouse coordinates.
- **D-Box Footer**: Faded pitch background gradient simulating a football field.
- **Text & Clutter Polish**: All generic icon boxes removed in favor of elegant typography, custom letter-spacing, and clean layout columns.

---

## 🛠️ Key Parameters & Engineering Design

### 💎 Code Quality (Structure, Readability, Maintainability)
- **Modular Component Architecture**: Complete isolation between the UI view layers (`Home.tsx`, `TicketsPage.tsx`, `MapPage.tsx`), utility hooks, and the orchestrator layer.
- **Strong Typing**: 100% TypeScript compilation with strictly defined interfaces for `AgentIntent`, `AgentActivity`, and `Message` models.
- **Config-Driven Prompts**: Prompts are centered in a dedicated `prompts.ts` metadata file rather than inline strings, allowing easy updates to World Cup logistics without touching source code.

### 🔒 Security (Safe and Responsible Implementation)
- **Prompt Injection Defense**: Integrates XML-delimited tag systems (`<user_input>`) to prevent users from bypassing guidelines. Active keyword detection blocks common jailbreak instructions.
- **Secret Protection**: `.gitignore` strictly blocks all `.env` environment variables from ever being committed to GitHub to protect API credentials.
- **Security-First Dependencies**: Leverages `helmet` and standard Express rate limiters on the server side to protect backend endpoints.

### ⚡ Efficiency (Optimal Use of Resources)
- **Response Caching**: Implements client-side in-memory caching in the Orchestrator to instantly fulfill identical user questions without redundant LLM API calls.
- **Lightweight Framework Footprint**: Utilizes Tailwind v4 with optimized imports to minimize final production CSS bundle size, fitting safely within server constraints.
- **Asynchronous Workflows**: Handled via standard React state flows for fast interactive states without blocking the main browser thread.

### 🧪 Testing (Validation of Functionality)
- **Vitest Suite**: Pre-configured testing files for component behaviors and service logic.
- **TypeScript Verification**: Safe compiling checked via `npx tsc --noEmit` before staging.

### ♿ Accessibility (Inclusive and Usable Design)
- **Semantic Structure**: Fully structured with `<section>`, `<footer>`, `<header>`, and `<main>` tags.
- **Visual Contrast**: Sleek dark mode using pure black background with bright gold-yellow accent tags, guaranteeing AA/AAA contrast guidelines.
- **Screen Reader Support**: Integrated ARIA roles (`role="dialog"`, `role="log"`, `aria-live="polite"`) so screen-reading utilities track chat logs dynamically.
