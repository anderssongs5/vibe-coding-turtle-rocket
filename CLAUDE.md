# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**TurtleRocket Time Twister** — a single-page React/TypeScript app that imports Google Calendar ICS files, classifies events by cognitive load using keyword matching, and re-optimizes the schedule based on user-defined energy levels. Everything runs client-side; no backend.

## Commands

```bash
# Bootstrap (run once)
npx create-react-app turtlerocket-time-twister --template typescript
npm install ical.js
npm install --save-dev @testing-library/react @testing-library/user-event

# Dev server
npm start

# Tests (watch mode)
npm test

# Run a single test file
npm test -- --testPathPattern=classifier

# Build
npm run build
```

## Architecture

The app is a pure client-side pipeline: energy configuration → ICS upload/parse → keyword classification → schedule optimization → visual preview → ICS export.

**State** lives in `App.tsx` as a single `appState` object:
```
energyLevels: EnergyLevel[12]   // 8 AM–8 PM
uploadedEvents                   // raw parsed events
classifiedEvents                 // events + cognitiveLoad
optimizedEvents                  // events + new times
isProcessing: boolean
```

**Component tree** (`src/components/`):
- `EnergySelector` — 12 clickable hour blocks that cycle low → medium → high
- `FileUpload` — `.ics`-only file input with validation
- `ScheduleDisplay` — hourly grid 8 AM–8 PM with time-positioned event blocks
- `ScheduleComparison` — side-by-side before/after view with movement indicators
- `ExportButton` — triggers ICS download

**Utilities** (`src/utils/`):
- `icsParser.ts` — wraps `ical.js`; extracts SUMMARY/DTSTART/DTEND/UID, filters all-day and out-of-range events
- `classifier.ts` — keyword matching against `src/config/keywords.ts`; heavy takes precedence over light, default is medium
- `timeSlotMapper.ts` — maps energy array to slot availability
- `optimizer.ts` — sorts events heavy→medium→light, places each group in matching energy slots, preserves duration and tracks movements
- `icsBuilder.ts` — generates RFC 5545 ICS output with updated times and `X-TURTLEROCKET-OPTIMIZED` property
- `download.ts` — creates a Blob and triggers browser download

**Types** (`src/types/`): `EnergyLevel`, `CalendarEvent`, `ClassifiedEvent`, `OptimizedEvent`, `AppState` in `index.ts`; `TimeSlot` and energy constants in `energy.ts`; `CognitiveLoad` and `ClassificationResult` in `classification.ts`.

## Key domain rules

- **Time window**: 8 AM–8 PM only. Events outside this range keep their original time and are skipped by the optimizer.
- **Classification precedence**: heavy keywords beat light keywords; unmatched events are medium. Matching is case-insensitive and partial-word (`meetings` matches `meeting`).
- **Optimization constraints**: no overlap resolution, times round to the nearest hour, event duration is always preserved.
- **ICS output**: preserves original UIDs; adds `X-TURTLEROCKET-OPTIMIZED:TRUE` to moved events.

## Development approach

Follow the phase order in `blueprint.md`. Each iteration ends with a commit; tests must be green before moving to the next iteration. No orphaned code — every utility should be wired into the app before it's considered done.
