# Design QA

## Comparison target

- Source visual truth: `assets/design-reference-option1.png` (the selected Product Design concept, with the user-requested white workspace applied in implementation).
- Implementation URL: `http://127.0.0.1:5180/`.
- Intended viewport: desktop, 1440 x 1024.
- Intended state: stage A, elapsed software time 0 h, Tf 175 C.

## Validation completed

- JavaScript syntax check: passed (`node --check app.js`).
- Schedule arithmetic check: passed. Eight weekly blocks of `60 + 12 + 36 + 12 + 72` hours plus 24 hours for stage G equals 1560 hours.
- Core interaction retained: changing start time, cumulative software hours, or Tf recalculates the stage, temperature, next transition time, schedule progress, stage rail, and detailed rows.

## Blocking evidence

- Browser-rendered screenshot: unavailable.
- Browser connection result: the available Chrome control surface reported `Browser is not available: extension`; the in-app browser runtime was not installed in the active environment.

## Required fidelity surfaces

- Fonts and typography: code reviewed; browser rendering blocked.
- Spacing and layout rhythm: code reviewed; browser rendering blocked.
- Colors and visual tokens: code reviewed; browser rendering blocked.
- Image quality and asset fidelity: the selected source visual was retained at `assets/design-reference-option1.png`; no raster assets are consumed by the interface.
- Copy and content: Chinese UI copy and UL/IEC timing content were checked in source.

## Findings

- [P1] Browser visual comparison is unavailable.
  - Evidence: no controllable browser surface was available to capture `http://127.0.0.1:5180/`.
  - Fix: reconnect an in-app browser or Chrome control surface, capture the implementation at 1440 x 1024, then compare it with the selected reference and resolve any P1/P2 visual differences.

## Implementation checklist

1. Open the local preview in a browser.
2. Verify stage A at 0 h, a rest state at 60 h, a later stage transition, and completion at 1560 h.
3. Capture a desktop screenshot and complete the visual comparison.

final result: blocked
