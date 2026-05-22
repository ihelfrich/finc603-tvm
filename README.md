# TVM Studio

Interactive teaching site for Time Value of Money. Live at https://ihelfrich.github.io/tvm-studio/.

Each problem lives on its own page with:

- **Live sliders** for every input quantity, with animated transitions
- **Cash-flow timeline** rendered as an SVG that re-flows smoothly as inputs change
- **Excel formula-bar mirror** that displays the literal `=PV(...)` / `=PMT(...)` / `=RATE(...)` string
- **Wrong-answer feedback widget** that diagnoses every multiple-choice option (confetti on correct)
- **WebGL perpetuity scene** on the multi-stage DDM page

## Stack

- [Observable Framework](https://observablehq.com/framework/) — reactive markdown-driven static site
- D3 for SVG charting with animated transitions
- Three.js for the WebGL perpetuity scene
- canvas-confetti for the right-answer celebration
- Plain JS finance primitives in `src/lib/tvm.js`

## Local development

```bash
npm install
npm run dev   # http://localhost:3000
```

## Build + deploy

```bash
GH_PAGES=1 npm run build
```

GitHub Actions deploys on push to `main` via `.github/workflows/deploy.yml`.

---

Dr. Ian Helfrich · 2026
