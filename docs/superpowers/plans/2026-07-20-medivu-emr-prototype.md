# MediVU EMR Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build and publish a static React demo that presents an Ambient AI outpatient encounter from conversation through ranked diagnosis candidates to a prefilled order workflow.

**Architecture:** A Vite single-page app keeps a deterministic demo scenario and all interaction state in memory. Focused React components render the navigation, patient context, transcript, keyword evidence, ranked diagnoses, and order workspace; pure domain functions calculate ranking independently of the UI.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS, GitHub Actions, GitHub Pages

## Global Constraints

- Use only fabricated patient data and deterministic local fixtures.
- Do not call AI, speech, EMR, authentication, database, or browser persistence APIs.
- Present diagnosis scores as independent demo estimates, not normalized clinical probabilities.
- Do not include medication dosage or represent order content as clinical guidance.
- Support keyboard operation, non-color source labels, reduced motion, 1440×900, and 1280×720.

## Tasks

- [ ] Scaffold React, TypeScript, Vite, Vitest, and Testing Library; set the GitHub Pages base path.
- [ ] Define scenario types, fabricated fixtures, keyword normalization, and diagnosis scoring through failing unit tests.
- [ ] Build the three-column Ambient workspace through component tests: transcript playback, keyword entry/removal, source labeling, and diagnosis tags.
- [ ] Build hash navigation and the prefilled order workspace through component tests.
- [ ] Add responsive and accessibility styling, reduced-motion behavior, and browser-level smoke coverage.
- [ ] Add README, presentation script, scenario comparison documentation, and GitHub Pages workflow.
- [ ] Run tests, production build, static preview, and viewport checks; review commit history and push `main`.

## Public Interfaces

- `type KeywordSource = 'ambient' | 'history' | 'lab' | 'imaging' | 'doctor'`
- `normalizeKeywordLabel(label: string): string`
- `addDoctorKeyword(keywords: Keyword[], label: string): Keyword[]`
- `scoreDiagnoses(activeKeywords: Keyword[], candidates: DiagnosisCandidate[]): RankedDiagnosis[]`
- Hash screens: `#/ambient` and `#/orders/:diagnosisId`

## Verification

- Unit tests cover score weighting, clamping, descending Top 5 order, blank input, duplicates, unknown keywords, keyword exclusion, and reset state.
- Component tests cover playback controls, accessible keyword removal, diagnosis tag editing, route changes, prefilled orders, edits, and save confirmation.
- `npm test -- --run` and `npm run build` must exit successfully without warnings attributable to the application.
- Manual browser verification covers the complete 3-minute flow at 1440×900 and 1280×720, plus the evidence drawer below 1180px.
