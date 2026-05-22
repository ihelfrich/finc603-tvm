---
title: TVM Studio
toc: false
---

<style>
  .hero {
    background: linear-gradient(135deg, #1F3864 0%, #2E75B6 100%);
    color: white;
    padding: 36px 28px;
    border-radius: 8px;
    margin-bottom: 28px;
  }
  .hero h1 { color: white; margin: 0 0 8px; font-size: 32px; }
  .hero p  { color: #E7F1FA; font-size: 16px; margin: 4px 0; }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
  }
  .card {
    background: white;
    border: 1px solid #C8CDD3;
    border-radius: 8px;
    padding: 16px 18px;
    text-decoration: none;
    color: inherit;
    transition: all 0.15s ease;
    display: block;
  }
  .card:hover {
    border-color: #2E75B6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(46,117,182,0.15);
  }
  .card .tag {
    display: inline-block;
    font-size: 11px;
    background: #E7F1FA;
    color: #1F3864;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;
    margin-bottom: 6px;
    letter-spacing: 0.5px;
  }
  .card h3 { margin: 4px 0; font-size: 16px; color: #1F3864; }
  .card p  { margin: 4px 0; color: #555; font-size: 13px; line-height: 1.4; }
  .card .ans { font-family: monospace; font-size: 12px; color: #006100; font-weight: 600; }
</style>

<div class="hero">
  <h1>TVM Studio</h1>
  <p>An interactive way to learn Time Value of Money.</p>
  <p style="opacity:0.85;font-size:14px;margin-top:10px">
    Slide the inputs, watch the cash-flow timeline move, copy the Excel formula straight to your quiz.
  </p>
</div>

## Pick a problem

<div class="card-grid">

<a class="card" href="./q1">
<span class="tag">Q1</span>
<h3>Annuity Due, Rate Change</h3>
<p>Solve for <em>N</em>, then re-price as annuity due at a lower rate.</p>
<span class="ans">$33.29 increase</span>
</a>

<a class="card" href="./q2">
<span class="tag">Q2</span>
<h3>Two-Stage Lump Sum</h3>
<p>Compounding year-by-year when the rate changes.</p>
<span class="ans">$5,535</span>
</a>

<a class="card" href="./q3">
<span class="tag">Q3</span>
<h3>Missing Cash Flow</h3>
<p>NPV at the required return must equal zero. Solve for the year-4 inflow.</p>
<span class="ans">$893.35</span>
</a>

<a class="card" href="./q4">
<span class="tag">Q4</span>
<h3>APR Backout</h3>
<p>Excel's RATE function returns the per-period rate. APR = monthly × 12.</p>
<span class="ans">9%</span>
</a>

<a class="card" href="./q5">
<span class="tag">Q5</span>
<h3>EAR Bond Pricing</h3>
<p>Convert APR to EAR, then discount annual cash flows.</p>
<span class="ans">$890.65</span>
</a>

<a class="card" href="./q6">
<span class="tag">Q6</span>
<h3>30-Year Mortgage</h3>
<p>Excel <code>=PMT(APR/12, years×12, -loan)</code>. Clock-match.</p>
<span class="ans">$1,686.42</span>
</a>

<a class="card" href="./q7">
<span class="tag">Q7</span>
<h3>Multi-Stage DDM</h3>
<p>Three blocks: annuity, delayed annuity, delayed perpetuity.</p>
<span class="ans">$52.99</span>
</a>

</div>

---

## How to use this site

Use this site to *play* with the numbers — slide a rate up and down and see what happens to a bond price, a mortgage payment, a stock value. Every problem is meant to be poked at until the intuition clicks.

Each problem page has the same structure:

1. **Intuition** — the one thing that has to click before the math.
2. **Live inputs** — sliders for every quantity in the problem. Everything below updates as you drag.
3. **Timeline** — cash flows above the year axis (face value), present values below (discounted). Drag a slider; the bars resize.
4. **Excel formula bar** — the literal formula you copy into your submitted work.
5. **Answer choices** — click each option to see why it's right or where the mistake came from.

