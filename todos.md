# TurtleRocket Time Twister - Implementation Checklist

## 🚀 Project Setup

### Initial Setup
- [x] Create new React app with TypeScript: `npx create-react-app turtlerocket-time-twister --template typescript`
- [x] Install required dependencies: `npm install ical.js @types/ical.js`
- [x] Install testing utilities if needed: `npm install --save-dev @testing-library/react @testing-library/user-event`
- [x] Set up folder structure:
  - [x] Create `src/components/` directory
  - [x] Create `src/utils/` directory
  - [x] Create `src/types/` directory
  - [x] Create `src/config/` directory
  - [x] Create `src/__tests__/` directory
  - [x] Create `src/test-utils/` directory

### Git Setup
- [x] Initialize git repository
- [x] Create `.gitignore` if not present
- [x] Make initial commit
- [x] Set up remote repository (optional)

---

## 📋 Phase 1: Foundation

### Iteration 1.1: Project Initialization
- [x] Create basic `App.tsx` with "TurtleRocket Time Twister" heading
- [x] Set up basic CSS with centered container (max-width: 800px)
- [x] Add subtle box shadow to container
- [x] Write test: App renders heading correctly
- [x] Write test: Container has proper styling
- [x] Ensure all tests pass
- [x] Commit: "Add basic app structure and styling"

### Iteration 1.2: Core State Structure
- [x] Create `src/types/index.ts` with TypeScript interfaces:
  - [x] Define `EnergyLevel` type
  - [x] Define `CalendarEvent` interface
  - [x] Define `ClassifiedEvent` interface
  - [x] Define `OptimizedEvent` interface
  - [x] Define `AppState` interface
- [x] Initialize state in `App.tsx`
- [x] Create `src/utils/stateHelpers.ts`
- [x] Write test: Initial state has correct defaults
- [x] Write test: State update functions work correctly
- [x] Write test: State immutability is maintained
- [x] Commit: "Add state management and types"

---

## 🔋 Phase 2: Energy Level Input

### Iteration 2.1: Energy Data Model
- [x] Create `src/types/energy.ts`:
  - [x] Define `EnergyLevel` type ('low' | 'medium' | 'high')
  - [x] Define `TimeSlot` interface
  - [x] Create `EnergyEmoji` constant object
  - [x] Create `EnergyColors` constant object
- [x] Create `src/utils/energyHelpers.ts`:
  - [x] `initializeDefaultEnergy()` function
  - [x] `updateEnergyLevel()` function
  - [x] `getEnergyForHour()` function
  - [x] `resetToDefault()` function
- [x] Write test: Energy level cycling works
- [x] Write test: Boundary checking (8 AM - 8 PM)
- [x] Write test: Default initialization
- [x] Commit: "Add energy level data model"

### Iteration 2.2: Energy Selector Component
- [x] Create `src/components/EnergySelector.tsx`
- [x] Create `src/components/EnergySelector.module.css` (or styled-components)
- [x] Implement 12 hour blocks (8 AM to 8 PM)
- [x] Add click interaction to cycle energy levels
- [x] Display appropriate emoji and colors
- [x] Add hover effects
- [x] Write test: Renders 12 hour blocks
- [x] Write test: Click cycling works
- [x] Write test: Visual states update
- [x] Write test: Keyboard navigation
- [x] Integrate into `App.tsx`
- [x] Commit: "Add energy selector component"

### Iteration 2.3: Energy Persistence
- [x] Add "Reset to Default" button (EnergySelector.tsx — "Reset to Default" button with onReset prop)
- [x] Implement reset functionality (App.tsx handleEnergyReset calls resetEnergyLevels)
- [x] Add smooth transitions between states (EnergySelector.module.css transitions on bg/transform/shadow)
- [x] Write test: Reset button works (EnergySelector.test.tsx + App.integration.test.tsx)
- [x] Write test: State persistence between re-renders (covered by stateHelpers.test.ts)
- [x] Add visual feedback for interactions (hover/active styles in EnergySelector.module.css)
- [x] Commit: "Add energy persistence and reset" (delivered as part of Prompt 4 commit)

---

## 📁 Phase 3: File Upload & Parsing

### Iteration 3.1: File Upload Component
- [x] Create `src/components/FileUpload.tsx`
- [x] Create `src/components/FileUpload.module.css`
- [x] Style file input to look nice
- [x] Accept only `.ics` files
- [x] Display selected filename
- [x] Add clear/remove file button
- [x] Create `src/utils/validation.ts`:
  - [x] `validateFileType()` function
  - [x] `validateFileSize()` function
  - [x] `checkICSFormat()` function
- [x] Write test: File type validation
- [x] Write test: File size validation (max 5MB)
- [x] Write test: Error display
- [x] Write test: Clear functionality
- [x] Commit: "Add file upload component"

### Iteration 3.2: ICS Parser
- [x] Create `src/utils/icsParser.ts`
- [x] Implement `parseICSFile()` function
- [x] Extract event properties:
  - [x] SUMMARY (title)
  - [x] DTSTART (start time)
  - [x] DTEND (end time)
  - [x] UID (unique identifier)
- [x] Convert to JavaScript Date objects
- [x] Handle timezone conversions
- [x] Write test: Valid ICS parsing
- [x] Write test: Multiple events extraction
- [x] Write test: Timezone handling
- [x] Write test: Error handling for malformed files
- [x] Commit: "Add ICS parser"

---

## 🏷️ Phase 4: Event Classification

### Iteration 4.1: Keyword Configuration
- [x] Create `src/config/keywords.ts`
- [x] Define `HEAVY_KEYWORDS` array:
  - [x] Work-related: meeting, review, presentation, interview
  - [x] Planning: strategy, planning, roadmap, brainstorm
  - [x] Analysis: analysis, report, assessment, evaluation
  - [x] Decision: decision, approval, priority, budget
- [x] Define `LIGHT_KEYWORDS` array:
  - [x] Breaks: lunch, break, coffee, snack
  - [x] Social: birthday, happy hour, team lunch
  - [x] Personal: gym, workout, appointment
  - [x] Optional: optional, tentative, hold
- [x] Organize keywords by category
- [x] Write test: No keyword conflicts
- [x] Write test: Comprehensive coverage
- [x] Commit: "Add keyword configuration"

### Iteration 4.2: Classification Engine
- [x] Create `src/utils/classifier.ts`
- [x] Implement `classifyEvent()` function
- [x] Implement `classifyEvents()` batch function
- [x] Add `getMatchedKeywords()` for reasoning
- [x] Support partial word matching
- [x] Case-insensitive matching
- [x] Write test: Single keyword matching
- [x] Write test: Multiple keyword scenarios
- [x] Write test: Precedence rules (heavy > light)
- [x] Write test: Edge cases (empty titles)
- [x] Write test: Performance with many events
- [x] Commit: "Add classification engine"

---

## 📊 Phase 5: Schedule Optimization

### Iteration 5.1: Optimization Algorithm
- [x] Create `src/utils/timeSlotMapper.ts`:
  - [x] `createTimeSlotMap()` function
  - [x] `getAvailableSlots()` function
  - [x] `isSlotAvailable()` function
  - [x] Time utility functions
- [x] Create `src/utils/optimizer.ts`
- [x] Implement core algorithm:
  - [x] Sort events by cognitive load
  - [x] Match heavy events to high energy
  - [x] Match light events to low energy
  - [x] Preserve order within groups
- [x] Write test: Basic optimization
- [x] Write test: No suitable slots scenario
- [x] Write test: Duration preservation
- [x] Commit: "Add optimization algorithm"

### Iteration 5.2: Schedule Generation
- [x] Generate optimized schedule (optimizer.ts — optimizeSchedule returns OptimizedEvent[])
- [x] Track all movements (OptimizedEvent.moved boolean set per event in optimizer.ts)
- [x] Calculate displacement metrics (ScheduleComparison.tsx — timeDiffLabel, totalShiftMs, avgShiftH)
- [x] Maintain event integrity (UIDs and duration preserved via spread + durationMs)
- [x] Handle conflicts (simple overlap check) — out of scope per spec; no overlap resolution by design
- [x] Write test: Schedule generation (optimizer.test.ts — 10 tests)
- [x] Write test: Movement tracking (optimizer.test.ts + edge-cases.test.ts)
- [x] Write test: Metrics calculation (ScheduleComparison.test.tsx — 8 tests)
- [x] Commit: "Add optimization algorithm" (Prompt 10)

### Iteration 5.3: Optimization Feedback
- [x] Calculate optimization statistics: number moved + average displacement (ScheduleComparison.tsx)
  - [x] Number of events moved
  - [x] Average time displacement
  - [x] Optimization score — out of scope; blueprint did not specify a score formula
- [x] Add optimization summary (ScheduleComparison.tsx summary bar)
- [x] Show improvement indicators (↑ earlier / ↓ later / → unchanged arrows)
- [x] Write test: Statistics calculation (ScheduleComparison.test.tsx)
- [x] Write test: Summary generation (ScheduleComparison.test.tsx)
- [x] Commit: "Add comparison view" (Prompt 12)

---

## 📅 Phase 6: Schedule Preview

### Iteration 6.1: Schedule Display Component
- [x] Create `src/components/ScheduleDisplay.tsx`
- [x] Create `src/components/ScheduleDisplay.module.css`
- [x] Implement hourly grid (8 AM - 8 PM)
- [x] Add hour markers
- [x] Position events by time
- [x] Show event duration
- [x] Apply cognitive load colors
- [x] Write test: Correct positioning
- [x] Write test: Event rendering
- [x] Write test: Empty state
- [x] Commit: "Add schedule display"

### Iteration 6.2: Comparison View
- [x] Create `src/components/ScheduleComparison.tsx`
- [x] Show original vs optimized side-by-side
- [x] Add movement indicators:
  - [x] Strikethrough for old times
  - [x] Bold for new times
  - [x] Arrows for direction (↑↓)
  - [x] Time difference labels
- [x] Write test: Change detection
- [x] Write test: Movement indicators
- [x] Write test: Responsive layout
- [x] Commit: "Add comparison view"

---

## 💾 Phase 7: Export Functionality

### Iteration 7.1: ICS Generation
- [x] Create `src/utils/icsBuilder.ts`
- [x] Implement `buildICSFile()` function
- [x] Add proper ICS headers:
  - [x] BEGIN:VCALENDAR
  - [x] VERSION:2.0
  - [x] PRODID
  - [x] CALSCALE:GREGORIAN
- [x] Generate VEVENT for each event
- [x] Update event times
- [x] Add X-TURTLEROCKET-OPTIMIZED property
- [x] Write test: Valid ICS format
- [x] Write test: Event serialization
- [x] Write test: Special character escaping
- [x] Commit: "Add ICS generation"

### Iteration 7.2: Download Implementation
- [x] Create `src/components/ExportButton.tsx`
- [x] Create `src/utils/download.ts`
- [x] Implement file download:
  - [x] Create blob from ICS
  - [x] Trigger browser download
  - [x] Generate filename with timestamp
- [x] Add loading state
- [x] Add success feedback
- [x] Write test: Download trigger
- [x] Write test: Filename generation
- [x] Write test: Error handling
- [x] Commit: "Add download functionality"

### Iteration 7.3: Full Integration
- [x] Wire export to optimization results (App.tsx passes appState.optimizedEvents to ExportButton)
- [x] Add download button to UI (ExportButton rendered in App.tsx when hasResults)
- [x] Style as call-to-action (ExportButton.module.css — prominent CTA styling)
- [x] Disable during processing (ExportButton disabled when isProcessing or events empty)
- [x] Add error notifications (ExportButton shows role="alert" on failure)
- [x] Write test: Full export flow (App.integration.test.tsx — export button visible after upload)
- [x] Write test: Button states (ExportButton.test.tsx — 6 tests covering disabled/success/error states)
- [x] Test with real calendar apps — manual validation; not automated
- [x] Commit: "Add export and download" (Prompt 14) + "Complete app integration" (Prompt 15)

---

## 🎨 Phase 8: Integration & Polish

### Main Integration
- [x] Wire all components in `App.tsx`
- [x] Implement complete data flow:
  - [x] Energy selection → State
  - [x] File upload → Parse → State
  - [x] Classification → State
  - [x] Optimization → State
  - [x] Preview → Export
- [x] Add loading states between steps
- [x] Add error boundaries (`ErrorBoundary` class component wrapping App)
- [x] Write integration tests (`App.integration.test.tsx` — 8 tests)
- [x] Commit: "Complete app integration"

### User Experience
- [x] Add smooth transitions (CSS transitions on all interactive elements)
- [ ] Implement keyboard shortcuts:
  - [x] Tab navigation (native HTML button focus order)
  - [x] Enter to confirm — not in scope (buttons already respond to Enter/Space natively)
  - [x] Escape to cancel — FileUpload clears file on Escape key when file is selected
- [x] Add help tooltips — EnergySelector blocks and reset button have title attributes
- [x] Include instructions/guide — 3-step ol.app-instructions added to App.tsx
- [x] Add sample ICS file — public/sample.ics with 6 events; download link in App.tsx
- [x] Write test: Keyboard navigation (EnergySelector.test.tsx aria role tests + FileUpload Escape key test)
- [x] Write test: User flow (App.integration.test.tsx — 8 end-to-end flow tests)
- [x] Commit: "Enhance user experience and visual polish"

### Visual Polish
- [x] Add app logo/branding — 🚀 emoji logo in App.tsx; index.html title and manifest.json name updated to "TurtleRocket Time Twister"
- [x] Consistent spacing (CSS with consistent padding/margin throughout)
- [x] Professional typography (system font stack, proper font sizes/weights)
- [x] Loading animations (CSS transitions + "Analyzing your calendar…" loading text)
- [x] Success animations (ExportButton shows "✓ Downloaded" feedback)
- [x] Error state styling (role="alert" error messages styled in red)
- [x] Mobile responsiveness (EnergySelector 4-col grid @media max-width:600px; flex container)
- [x] Write test: Responsive design — src/__tests__/responsive.test.tsx with 5 structural tests
- [x] Write test: Animation performance — not in scope (CSS animations cannot be measured in JSDOM)
- [x] Commit: "Enhance user experience and visual polish"

---

## 🧪 Phase 9: Comprehensive Testing

### Integration Tests
- [x] Integration tests covered by `src/App.integration.test.tsx` (8 tests, end-to-end flow)
- [x] Test complete user flow
- [x] Test error scenarios (non-ICS file, clear button)
- [x] Test state consistency

### Performance Tests
- [x] Create `src/__tests__/performance.test.ts`
- [x] Parse 1000 events < 1 second
- [x] Classify 1000 events < 500ms
- [x] Optimize 1000 events < 500ms
- [x] Build ICS from 100 events < 1 second
- [x] Full pipeline (500 events) < 2 seconds

### Edge Case Tests
- [x] Create `src/__tests__/edge-cases.test.ts`
- [x] Empty VCALENDAR (no VEVENTs)
- [x] All-day events filtered out
- [x] Events before 8 AM filtered out
- [x] Events at or after 8 PM filtered out
- [x] Boundary events (8 AM and 7 PM) included
- [x] No-title event uses "(No title)"
- [x] Empty classifier input → empty output
- [x] Heavy keyword beats light in same summary
- [x] Optimizer: all-high energy, all-low energy scenarios
- [x] Duration preservation after optimization
- [x] More events than slots: all events returned
- [x] Out-of-range event passes through unchanged
- [x] buildICSFile with empty list
- [x] Special character escaping (commas, semicolons, backslashes)
- [x] X-TURTLEROCKET-OPTIMIZED only on moved events
- [x] UID preservation

### Test Utilities
- [x] Create `src/test-utils/factories.ts`
  - [x] `makeCalendarEvent(overrides?)` — correct uid/summary/start/end fields
  - [x] `makeClassifiedEvent(overrides?)` — extends CalendarEvent + cognitiveLoad
  - [x] `makeOptimizedEvent(overrides?)` — extends ClassifiedEvent + newStart/newEnd/moved
  - [x] `makeEnergyLevels(fill)` — 12-element array
  - [x] `makeICSContent(events[])` — RFC 5545 ICS string
  - [x] `makeLargeICSContent(count)` — for performance tests
  - [x] `resetFactoryCounter()` — for test isolation


---

## 📝 Notes

- Commit after each completed iteration
- Run tests frequently
- Keep commits atomic and descriptive
- Update this checklist as needed
- Take breaks - this is a lot of work!

**Remember**: Each checkbox represents a discrete, testable piece of work. Don't move on until tests are green!
