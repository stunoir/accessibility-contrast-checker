# Accessibility contrast checker

A WCAG contrast ratio checker built with React 19 and Vite. Enter a foreground and background colour as hex values and see whether the combination passes or fails WCAG 2.2 AA and AAA requirements for normal and large text.

Built as the first project in a structured React learning series focused on accessibility tooling.

---

## What it does

- Accepts foreground and background hex colour values
- Sanitises input as you type - strips invalid characters, auto-prepends `#`, handles shorthand hex expansion
- Validates both values on submit with accessible error messages
- Calculates the contrast ratio using the WCAG relative luminance formula
- Evaluates the ratio against four WCAG 2.2 thresholds: AA normal, AA large, AAA normal, AAA large
- Displays pass/fail results with colour-coded cards and screen reader announcements via `aria-live`
- Shows a live preview panel with the chosen colours applied to real text

---

## WCAG criteria covered

| Criterion | Level | Threshold |
|---|---|---|
| 1.4.3 Contrast (minimum) | AA | 4.5:1 normal text, 3:1 large text |
| 1.4.6 Contrast (enhanced) | AAA | 7:1 normal text, 4.5:1 large text |

---

## Tech stack

- React 19
- Vite
- SCSS

---

## Running locally

```
npm install
npm run dev
```

---

## Project structure

```
src/
  assets/
    scss/
  utilities/
    colourUtils.js
  App.jsx
  main.jsx
```

---

## Utility functions

All contrast calculation logic lives in `src/utilities/colourUtils.js`, separate from the React component layer.

- `hexToLuminance(hex)` - converts a hex colour to its relative luminance value using the WCAG algorithm
- `contrastRatio(hex1, hex2)` - calculates the contrast ratio between two colours
- `wcagResult(ratio)` - evaluates the ratio against WCAG thresholds and returns a structured result object
- `expandHex(hex)` - expands shorthand hex values such as `#fff` to `#ffffff`
- `isValidHex(hex)` - returns true if the value is a valid 3 or 6 digit hex colour

---

## Accessibility notes

- All form inputs have associated labels
- Invalid inputs are marked with `aria-invalid` and linked to error messages via `aria-describedby`
- Error messages appear in persistent `aria-live="polite"` regions so they are announced without interrupting the user
- Decorative icons are hidden from assistive technology with `aria-hidden="true"`
- Results are announced to screen readers via a persistent `aria-live="polite"` region
- Form submission handles both button click and Enter key via native form behaviour
- Keyboard navigation requires no custom handling - native elements throughout
- Pass/fail state is communicated through text, iconography, and colour - never colour alone
