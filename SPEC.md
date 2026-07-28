# Loom AI — Product Specification

## Project Name
Loom AI

## One-line Description
Loom AI is an AI-powered frontend development assistant that generates, explains, and debugs HTML/CSS/JavaScript projects in real time — built for students and beginner developers, not professional engineers.

## Problem
Students and beginner frontend developers spend hours writing boilerplate websites, debugging broken layouts and scripts, and trying to understand codebases they didn't write. Existing AI coding tools don't solve this well:

- **Generic assistants** (ChatGPT, Claude.ai) can write code but provide no live preview, no project context, and no structured learning path.
- **Professional AI IDEs** (Cursor, Windsurf) are built for experienced engineers working in large codebases — overkill and intimidating for beginners.
- **No-code/low-code builders** (Lovable, v0) optimize for shipping fast, not for teaching *why* the code works.
- **Cost** — most powerful coding assistants are subscription-gated, putting them out of reach for students.

There is no tool built specifically around the beginner frontend learning loop: **generate → preview → understand → debug → improve.**

## Target Users

**Primary:**
- College students learning web development
- Coding bootcamp learners
- Beginner frontend developers building portfolio/practice projects

**Secondary:**
- Freelancers who need quick frontend scaffolding
- Frontend developers who want fast prototyping with built-in review

## Why This Problem Matters
Frontend development is usually the first real coding experience for new developers, and it's where most learners get stuck — not because the concepts are hard, but because errors are often invisible (a missing closing div, a CSS specificity conflict, a JS scope bug) and existing tools either write the fix silently (no learning) or explain in overly technical language (no comprehension). A tool that automates the busywork *while* teaching the underlying concept directly addresses the biggest friction point in early frontend education.

## Current Solution (Status Quo)
- Students paste code into ChatGPT/Claude.ai — no live preview, no persistent project context, must re-explain the project every session.
- Students use browser DevTools + Stack Overflow — slow, discouraging, no guided explanation.
- Students use Cursor/Copilot — built for professionals, assumes prior knowledge, no explicit "explain like I'm learning" mode.

## Our Solution
Loom AI is a focused web application where a user either **generates a new website from a prompt** or **uploads an existing HTML/CSS/JS project**, and then:
1. Sees it rendered instantly in a live preview pane.
2. Can ask the AI to explain any part of the code in beginner-friendly language.
3. Can ask the AI to find and fix bugs, with an explanation of what was wrong and why the fix works.
4. Can iterate conversationally ("make the navbar sticky", "why is my flexbox not centering?").
5. Can download the final project as a ready-to-use folder.

Under the hood, a multi-agent pipeline (Router → Builder → Reviewer) orchestrates specialized, cost-efficient open models instead of one expensive general-purpose model, keeping the product fast and cheap to run.

## Core Flow

```
User opens Loom AI
        │
        ▼
Chooses: [Generate Website]  or  [Upload Project]
        │
        ▼
Router Agent classifies intent
(generate / explain / debug / edit / off_topic)
        │
        ├── off_topic ──▶ Fixed redirect message returned
        │                 (no Builder/Reviewer call made)
        ▼
Builder Agent produces or modifies HTML/CSS/JS
        │
        ▼
Reviewer Agent checks output for bugs/quality
        │
        ▼
Live Preview updates in-browser (iframe sandbox)
        │
        ▼
User asks for explanation or further debugging
(loops back to Router Agent)
        │
        ▼
User downloads final project as a .zip
```

## Features

### MVP (must ship in 4 days)
1. **AI Website Generation** — prompt → full HTML/CSS/JS site, rendered live.
2. **Upload Existing Project** — accepts `index.html`, `style.css`, `script.js`; parsed and loaded into the workspace.
3. **Live Preview** — sandboxed iframe reflecting current project state, updates on every AI edit.
4. **Explain Code** — chat-based, beginner-friendly explanations of selected code or whole files.
5. **Debug Code** — detects bugs, explains the root cause in plain language, proposes and applies a fix.
6. **Download Project** — exports current project state as a `.zip` (`index.html`, `style.css`, `script.js`).
7. **Chat-driven iteration** — conversational follow-up edits ("make the button blue", "add a contact form").

### Explicit Non-Goals for MVP
- User accounts / auth / saved project history across sessions (session-only state is fine)
- Multi-page site generation (single-page sites only)
- Payment/billing
- Team collaboration

### Stretch Goals (only if time remains)
- Responsive design suggestions (mobile breakpoint checks)
- Basic accessibility audit (alt text, contrast, semantic tags)
- Tailwind conversion of generated CSS
- React starter export mode

### Future Scope (post-hackathon)
- React/Vue project support
- Performance optimization pass (Lighthouse-style scoring)
- Persistent user accounts and project history
- Real-time collaborative editing
- Plugin-style "lesson mode" tied to a curriculum

## Technology Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Sandboxed `<iframe>` (via `srcDoc`) for live preview — no eval, no direct DOM injection into the parent app

**Backend**
- Node.js + Express.js
- LangGraph for agent orchestration
- SQLite for MVP persistence (ephemeral session/project storage only — no user accounts). Rationale: zero-config, file-based, sufficient for a 4-day scope with a single small server instance. Revisit for Postgres only if multi-user concurrency becomes a real requirement post-hackathon.

**AI Layer**
- Router Agent: Qwen 2.5 3B Instruct
- Builder Agent: Qwen 2.5 Coder 7B
- Reviewer Agent: Llama 3.1 8B
- Brain Agent (Qwen 3 8B): stubbed interface only, not wired into MVP critical path
- Provider routing across OpenRouter / Groq / Gemini API, selected by whichever has lowest latency/cost for the given model at request time

**Deployment**
- Frontend: Vercel
- Backend: Render or Railway

## Architecture Overview

```
┌─────────────────────────────┐
│         React + Vite        │
│  (Chat UI, Upload, Preview) │
└──────────────┬──────────────┘
               │ REST (JSON) + SSE for streaming
               ▼
┌─────────────────────────────┐
│      Express.js Backend     │
│  /api/generate               │
│  /api/upload                 │
│  /api/chat (explain/debug/edit)
│  /api/download                │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      LangGraph Orchestrator │
│                              │
│  Router Agent → Builder →   │
│  Reviewer → (loop back to   │
│  Router on user follow-up)  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│   AI Provider Layer          │
│  OpenRouter / Groq / Gemini  │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│   SQLite (session/project    │
│   state, chat history)       │
└─────────────────────────────┘
```

## AI Workflow

1. **Router Agent** (Qwen 2.5 3B Instruct) receives the raw user message plus current project state summary. Classifies intent into one of: `generate`, `edit`, `explain`, `debug`, `off_topic`. Outputs a structured JSON decision (`{ intent, target_files, notes }`).
   - **`off_topic` is a hard gate, not a fallback style.** Any message unrelated to generating, editing, explaining, or debugging frontend code (general conversation, unrelated questions, requests to role-play, requests for non-frontend code, etc.) is classified `off_topic`. This is what keeps Loom AI from behaving like a general-purpose chatbot.
   - When `off_topic` is returned, the backend **never calls Builder or Reviewer**. It immediately returns a fixed, on-brand redirect message (e.g., *"I'm focused on frontend development — try asking me to build a site, explain some code, or fix a bug."*) and the conversation loop returns control to the user without touching the AI generation pipeline.
2. **Builder Agent** (Qwen 2.5 Coder 7B) receives the intent + current file contents (if editing) and produces new/modified HTML/CSS/JS. Always outputs complete, valid file contents per file — never partial diffs the frontend has to reconstruct.
3. **Reviewer Agent** (Llama 3.1 8B) receives Builder's output, checks for syntax errors, obviously broken markup/CSS/JS, and unmet requirements from the user prompt. Returns either an approval or a structured list of issues sent back to Builder for one repair pass (max 1 retry loop in MVP to bound latency/cost).
4. Approved output is written to project state, returned to frontend, and the Live Preview iframe is refreshed.
5. For `explain` and `debug` intents, the Router routes directly to a lightweight explanation prompt against the Builder or Reviewer model (whichever is already warm/cheaper) rather than invoking the full generate pipeline.

## Definition of Done (MVP)
- [ ] User can enter a prompt and receive a rendered, working single-page website within ~15 seconds
- [ ] User can upload `index.html` + `style.css` + `script.js` and see it rendered in Live Preview
- [ ] User can select or reference code and receive a beginner-friendly explanation via chat
- [ ] User can trigger debugging and receive: bug description, explanation, and an applied fix
- [ ] Live Preview updates automatically after every successful AI edit
- [ ] User can download the current project as a working `.zip`
- [ ] No unhandled crashes during the full demo flow (generate → explain → debug → download)
- [ ] Off-topic/non-frontend messages (general chat, unrelated questions) are correctly rejected by the Router with a fixed redirect message, without invoking Builder/Reviewer
- [ ] Deployed and publicly accessible (Vercel + Render/Railway)

## Demo Flow (for judges)
1. Open Loom AI (deployed link).
2. Type: *"Create a modern portfolio website for a photographer."* → show live preview generate in ~10–15s.
3. Ask: *"Explain how the navbar CSS works."* → show plain-language explanation.
4. Manually break something (or ask AI to introduce a bug for demo) → click Debug → show bug found, explained, fixed live in preview.
5. Ask: *"Make the hero section full-screen and add a subtle fade-in animation."* → show conversational edit applied.
6. Click Download → show resulting `.zip` opens correctly in a browser outside the app.
7. Close with the multi-agent architecture diagram to show technical depth beyond "just an API wrapper."

## Success Metrics
**Hackathon judging:**
- Live demo completes without errors, end-to-end, in under 3 minutes
- Judges can articulate the multi-agent architecture back after the demo
- Clear differentiation from ChatGPT/Cursor is understood without extra explanation

**Product-level (if continued):**
- Time-to-first-working-site under 20 seconds
- % of debug sessions where the user reports the explanation was "understandable" (post-hackathon survey metric)
- Session-to-download conversion rate

## Risks
| Risk | Mitigation |
|---|---|
| Open-source model output quality inconsistent for code gen | Reviewer Agent + single bounded retry loop; hardcode a few polished fallback templates if generation fails outright |
| Latency stacking across 3 sequential agent calls | Stream Builder output directly to preview before Reviewer finishes; run Reviewer async where possible |
| Provider rate limits / downtime during live demo | Configure at least 2 providers (e.g., Groq + OpenRouter) with automatic fallback; test failover before demo day |
| Uploaded project has unexpected structure (multiple files, frameworks) | MVP explicitly scopes to exactly `index.html`/`style.css`/`script.js`; validate and reject/guide otherwise |
| Iframe security (injected script from generated code) | Use `sandbox` attribute on iframe, no `allow-same-origin` + `allow-scripts` combination that exposes parent DOM |
| 4-day timeline with 4 people | Strict feature freeze after Day 2; see CLAUDE.md hackathon priorities |

## Assumptions
- Users interact in English; no localization needed for MVP.
- Single-page websites only — no routing/multi-page generation in MVP.
- No authentication needed; each session is ephemeral and self-contained.
- Team has access to API keys for at least one of OpenRouter/Groq/Gemini before Day 1.
- Demo will run on a stable internet connection; no offline mode required.
- Generated code quality target is "correct and clean for a beginner project," not production-enterprise-grade optimization.

## Future Scope
- Full user accounts with saved project history and revisit/edit later
- React and Vue project generation and editing support
- Automated accessibility and performance auditing with actionable scores
- "Lesson mode": structured curriculum where Loom AI teaches HTML/CSS/JS fundamentals through guided project building
- Real-time multi-user collaboration on a single project
- Plugin marketplace for component libraries (shadcn/ui, Bootstrap, etc.)
