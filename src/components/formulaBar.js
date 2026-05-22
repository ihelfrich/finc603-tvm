// Excel formula-bar mirror component.
// Renders an Excel-looking formula bar; supports highlighting a substring.

export function formulaBar(formula, {highlight = null, result = null} = {}) {
  const wrap = document.createElement("div");
  wrap.style.cssText = [
    "font-family: 'SF Mono', Menlo, Consolas, monospace",
    "background: #F8F9FA",
    "border: 1px solid #C8CDD3",
    "border-radius: 4px",
    "padding: 10px 14px",
    "margin: 8px 0",
    "display: flex",
    "align-items: center",
    "gap: 14px",
    "font-size: 14px"
  ].join(";");

  const fx = document.createElement("span");
  fx.textContent = "fx";
  fx.style.cssText = "font-family:'Times New Roman',serif;font-style:italic;color:#1F3864;font-weight:700;min-width:28px;";
  wrap.appendChild(fx);

  const body = document.createElement("span");
  body.style.cssText = "flex:1;color:#222;white-space:nowrap;overflow-x:auto;";

  // Build the formula body, optionally highlighting one substring.
  if (highlight && formula.includes(highlight)) {
    const idx = formula.indexOf(highlight);
    const before = formula.slice(0, idx);
    const after = formula.slice(idx + highlight.length);
    body.appendChild(document.createTextNode(before));
    const hl = document.createElement("span");
    hl.textContent = highlight;
    hl.style.cssText = "background:#FFE699;padding:1px 3px;border-radius:2px;font-weight:600;";
    body.appendChild(hl);
    body.appendChild(document.createTextNode(after));
  } else {
    body.textContent = formula;
  }
  wrap.appendChild(body);

  if (result !== null && result !== undefined) {
    const r = document.createElement("span");
    r.textContent = "= " + result;
    r.style.cssText = "background:#C6EFCE;color:#006100;font-weight:700;padding:3px 10px;border-radius:3px;white-space:nowrap;";
    wrap.appendChild(r);
  }

  return wrap;
}

// Inline Excel-cell renderer — for showing what a single cell looks like.
export function excelCell(label, value, {color = "#000", bg = "#fff", bold = false} = {}) {
  const el = document.createElement("span");
  el.style.cssText = [
    "display:inline-block",
    "font-family:'SF Mono',Menlo,monospace",
    "border:1px solid #C8CDD3",
    "padding:2px 8px",
    "margin:1px",
    `background:${bg}`,
    `color:${color}`,
    `font-weight:${bold ? 700 : 400}`,
    "font-size:13px",
    "border-radius:2px"
  ].join(";");
  el.textContent = `${label} = ${value}`;
  return el;
}
