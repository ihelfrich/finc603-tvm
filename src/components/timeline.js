// Cash-flow timeline SVG component with animated entrance.
// Uses per-selection transitions (no shared transition object — avoids
// "transition N not found" when the cell re-runs on slider change).

import * as d3 from "npm:d3";

let _counter = 0;

function tx(sel, {delay = 0, duration = 450} = {}) {
  return sel.transition()
    .duration(duration)
    .ease(d3.easeCubicOut)
    .delay(delay);
}

export function timeline({
  cashflows,
  rate,
  width = 780,
  height = 280,
  showPV = true,
  highlightYear = null,
  perpetuityFromYear = null
} = {}) {
  const uid = "tl-" + (++_counter);
  const m = { top: 26, right: 20, bottom: 50, left: 20 };
  const innerW = width - m.left - m.right;
  const innerH = height - m.top - m.bottom;
  const axisY = m.top + innerH / 2;

  const maxYearRaw = d3.max(cashflows, d => d.year) || 1;
  const maxYear = perpetuityFromYear ? Math.max(maxYearRaw, perpetuityFromYear + 5) : maxYearRaw;
  const x = d3.scaleLinear().domain([0, maxYear + 0.5]).range([m.left, width - m.right]);

  const maxAmt = d3.max(cashflows, d => Math.abs(d.amount)) || 1;
  const barMax = innerH / 2 - 10;
  const hAmt = a => (Math.abs(a) / maxAmt) * barMax;
  const pvAt = (amount, year) => amount / Math.pow(1 + rate, year);
  const maxPV = d3.max(cashflows, d => Math.abs(pvAt(d.amount, d.year))) || 1;
  const hPV = a => (Math.abs(a) / maxPV) * (barMax - 5);

  const svg = d3.create("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("style", "max-width:100%;height:auto;font-family:Arial,sans-serif;display:block;");

  // Subtle gradient backdrop
  const defs = svg.append("defs");
  const grad = defs.append("linearGradient")
    .attr("id", `${uid}-bg`).attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
  grad.append("stop").attr("offset", "0%").attr("stop-color", "#FAFBFD");
  grad.append("stop").attr("offset", "100%").attr("stop-color", "#EEF2F8");
  svg.append("rect")
    .attr("x", 0).attr("y", 0).attr("width", width).attr("height", height)
    .attr("fill", `url(#${uid}-bg)`).attr("rx", 6);

  // Axis line
  svg.append("line")
    .attr("x1", x(0)).attr("y1", axisY)
    .attr("x2", x(maxYear + 0.5)).attr("y2", axisY)
    .attr("stroke", "#888").attr("stroke-width", 1.2);

  // Year ticks
  const tickGroup = svg.append("g");
  const yearTicks = d3.range(0, Math.floor(maxYear) + 1);
  for (const yr of yearTicks) {
    tickGroup.append("line")
      .attr("x1", x(yr)).attr("y1", axisY - 4)
      .attr("x2", x(yr)).attr("y2", axisY + 4)
      .attr("stroke", "#666");
    tickGroup.append("text")
      .attr("x", x(yr)).attr("y", axisY + 18)
      .attr("text-anchor", "middle")
      .attr("font-size", 11).attr("fill", "#444")
      .text(yr === 0 ? "today" : `yr ${yr}`);
  }

  const barW = Math.min(28, (innerW / (maxYear + 1)) * 0.55);

  // CASH-FLOW BARS (face value)
  const cfGroup = svg.append("g").attr("class", "cf");
  cashflows.forEach((d, i) => {
    const isHi = highlightYear === d.year;
    const color = d.color || (d.amount >= 0 ? "#2E75B6" : "#C0504D");
    const targetH = hAmt(d.amount);
    const xPos = x(d.year) - barW / 2;

    const rect = cfGroup.append("rect")
      .attr("x", xPos).attr("y", axisY).attr("width", barW).attr("height", 0)
      .attr("fill", color)
      .attr("opacity", isHi ? 1 : 0.88)
      .attr("stroke", isHi ? "#FFB300" : "none")
      .attr("stroke-width", isHi ? 2.5 : 0)
      .attr("rx", 2);
    tx(rect, {delay: i * 60})
      .attr("y", axisY - targetH).attr("height", targetH);

    const label = cfGroup.append("text")
      .attr("x", x(d.year)).attr("y", axisY)
      .attr("text-anchor", "middle")
      .attr("font-size", 11).attr("font-weight", 600).attr("fill", "#222")
      .attr("opacity", 0)
      .text(d.label ?? `$${Math.round(d.amount).toLocaleString()}`);
    tx(label, {delay: i * 60 + 200})
      .attr("y", axisY - targetH - 4).attr("opacity", 1);
  });

  // PV BARS (below axis)
  if (showPV) {
    const pvGroup = svg.append("g").attr("class", "pv");
    cashflows.forEach((d, i) => {
      const pv = pvAt(d.amount, d.year);
      const targetH = hPV(pv);
      const xPos = x(d.year) - barW / 2;
      const rect = pvGroup.append("rect")
        .attr("x", xPos).attr("y", axisY + 1).attr("width", barW).attr("height", 0)
        .attr("fill", "#A6C8E6").attr("opacity", 0.7)
        .attr("stroke", "#2E75B6").attr("stroke-width", 0.5)
        .attr("rx", 2);
      tx(rect, {delay: i * 60 + 80}).attr("height", targetH);

      const lbl = pvGroup.append("text")
        .attr("x", x(d.year)).attr("y", axisY + 1 + targetH + 12)
        .attr("text-anchor", "middle")
        .attr("font-size", 10).attr("fill", "#1F3864")
        .attr("opacity", 0)
        .text(`$${pv.toFixed(2)}`);
      tx(lbl, {delay: i * 60 + 280}).attr("opacity", 1);
    });
  }

  // PERPETUITY TAIL — fading-in bars
  if (perpetuityFromYear !== null) {
    const lastCF = cashflows.find(c => c.year === perpetuityFromYear);
    const tailAmt = lastCF ? lastCF.amount : (cashflows[cashflows.length - 1]?.amount ?? 5);
    const tailColor = lastCF?.color || "#7030A0";
    const tailGroup = svg.append("g").attr("class", "tail");
    for (let i = 1; i <= 6; i++) {
      const yr = perpetuityFromYear + i;
      if (yr > maxYear) break;
      const opacity = Math.max(0.05, 0.7 - i * 0.1);
      const h = hAmt(tailAmt);
      const xPos = x(yr) - barW / 2;
      const rect = tailGroup.append("rect")
        .attr("x", xPos).attr("y", axisY).attr("width", barW).attr("height", 0)
        .attr("fill", tailColor).attr("opacity", 0).attr("rx", 2);
      tx(rect, {delay: 400 + i * 80})
        .attr("y", axisY - h).attr("height", h).attr("opacity", opacity);
    }
    const inf = tailGroup.append("text")
      .attr("x", x(perpetuityFromYear + 6.5)).attr("y", axisY - hAmt(tailAmt) / 2)
      .attr("font-size", 26).attr("fill", "#7030A0").attr("opacity", 0)
      .text("→∞");
    tx(inf, {delay: 900}).attr("opacity", 0.6);
  }

  // Axis labels
  svg.append("text")
    .attr("x", m.left + 6).attr("y", m.top - 8)
    .attr("font-size", 11).attr("font-weight", 600).attr("fill", "#444")
    .text("↑ cash flow (face)");
  if (showPV) {
    svg.append("text")
      .attr("x", m.left + 6).attr("y", height - 12)
      .attr("font-size", 11).attr("font-weight", 600).attr("fill", "#1F3864")
      .text("↓ present value (today) · discount " + (rate * 100).toFixed(3) + "%");
  }

  return svg.node();
}

// Tweened number — eases from previous to target over ms.
// Auto-cancels the RAF when the host element is removed from the DOM.
export function tweenNumber(value, {prefix = "", suffix = "", decimals = 2, ms = 400} = {}) {
  const el = document.createElement("span");
  el.style.cssText = "font-variant-numeric:tabular-nums;font-weight:inherit;";
  let prev = 0;
  let raf = null;
  let cancelled = false;
  const fmt = v => prefix + v.toLocaleString("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) + suffix;
  const start = performance.now();
  function tick(now) {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / ms);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(prev + (value - prev) * eased);
    if (t < 1) raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  // Cancel the RAF if the element gets removed from the DOM (cell re-run).
  const obs = new MutationObserver(() => {
    if (!el.isConnected && !cancelled) {
      cancelled = true;
      if (raf != null) cancelAnimationFrame(raf);
      obs.disconnect();
    }
  });
  // Wait one frame for the element to be attached, then observe its parent tree.
  requestAnimationFrame(() => {
    if (el.parentNode) obs.observe(el.parentNode, {childList: true, subtree: true});
  });

  return el;
}
