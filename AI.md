# AI DEVELOPMENT RULES — WELLBE

This file defines **mandatory rules** for any AI working on this repository.
These rules override any assumptions or defaults.

WellBe is a production-grade SaaS handling sensitive corporate wellbeing data.

---

## 1. WORKING MODE (MANDATORY)

- All AI-driven work MUST happen on a dedicated experimental branch:
  - `exp/antigravity-labs` or `exp/*`
- The `main` branch must NEVER be modified directly.
- The AI NEVER commits code directly.
- The human developer applies patches and commits changes.

---

## 2. TECH STACK (NON-NEGOTIABLE)

- Framework: Next.js (App Router)
- Language: TypeScript (strict)
- Deployment: Vercel
- Styling: Tailwind CSS
- UI Components: shadcn/ui ONLY

No alternative frameworks or UI libraries are allowed.

---

## 3. ARCHITECTURE RULES

- Server Components by default.
- Use `"use client"` ONLY when strictly required.
- UI components MUST NOT contain:
  - business logic
  - data access logic
- Domain logic must live in `lib/`, `services/`, or equivalent existing folders.
- Do NOT change routing, auth flows, or redirects unless explicitly requested.

---

## 4. DATA, PRIVACY & SECURITY (CRITICAL)

WellBe survey data must remain anonymous and aggregated.

- NEVER implement:
  - identification of individual respondents
  - storage or display of raw survey answers linked to users
- Never expose secrets to client code.
- Never log sensitive data.
- Validate server inputs (Zod preferred if present).

If a request conflicts with these principles, STOP and ask for clarification.

---

## 5. CODE STYLE RULES

- No `any`
- No `@ts-ignore`
- No `console.log` in production code
- Follow existing naming conventions.
- Prefer small, composable components and utilities.

---

## 6. DEPENDENCIES & CONFIG (DO NOT TOUCH)

The AI MUST NOT modify:
- `package.json`
- `tsconfig.json`
- `next.config.*`
- ESLint / Prettier configs
- `.env*`

If a change requires touching these files, STOP.

---

## 7. UI RULES

- Use shadcn/ui components as base.
- Reuse existing components.
- Accessibility is mandatory (labels, keyboard navigation).

---

## 8. CONTEXT7 (MANDATORY)

For any external library or framework:
- Next.js
- React
- Tailwind
- shadcn/ui
- Axios

The AI MUST:
1. resolve-library-id via Context7
2. get-library-docs via Context7

Do NOT rely on memory for APIs or configuration.

---

## 9. CHANGE LIMITS

Per iteration:
- Max 3 files changed
- Max 150 lines total
- No large refactors unless explicitly requested

---

## 10. REQUIRED OUTPUT FORMAT

Every response MUST follow:

1. PLAN
2. PATCH
3. TEST CHECKLIST

---

## 11. DO NOT GUESS

- Do not assume files or patterns not shown.
- Ask for missing context.
- Propose options when uncertain.

---

## SUMMARY

Stability, privacy, and consistency
are more important than speed.
