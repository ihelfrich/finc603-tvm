// TVM math primitives — vanilla JS, no deps.
// Same conventions as Excel: rates are per-period, signs follow cash-flow direction.

export const fmt$ = (x, d = 2) =>
  (x < 0 ? "-" : "") +
  "$" +
  Math.abs(x).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  });

export const fmtPct = (x, d = 2) =>
  (x * 100).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d
  }) + "%";

// PV of an ordinary annuity (or due if `due=true`).
export function pvAnnuity(pmt, rate, n, due = false) {
  if (rate === 0) return pmt * n;
  const factor = (1 - Math.pow(1 + rate, -n)) / rate;
  return pmt * factor * (due ? 1 + rate : 1);
}

// FV of an ordinary annuity.
export function fvAnnuity(pmt, rate, n, due = false) {
  if (rate === 0) return pmt * n;
  const factor = (Math.pow(1 + rate, n) - 1) / rate;
  return pmt * factor * (due ? 1 + rate : 1);
}

// Periodic payment that retires a loan of `pv` in `n` periods at `rate`.
export function pmt(pv, rate, n) {
  if (rate === 0) return pv / n;
  return (pv * rate) / (1 - Math.pow(1 + rate, -n));
}

// Number of periods to amortize a PV at given rate and payment.
export function nper(pv, rate, payment) {
  if (rate === 0) return pv / payment;
  return -Math.log(1 - (pv * rate) / payment) / Math.log(1 + rate);
}

// Effective Annual Rate from nominal APR with `m` compounding periods.
export function ear(apr, m = 12) {
  return Math.pow(1 + apr / m, m) - 1;
}

// Lump-sum future value with possibly different rate each period.
export function fvSequential(pv, rates) {
  return rates.reduce((acc, r) => acc * (1 + r), pv);
}

// PV of an arbitrary cash-flow stream at constant rate.
export function pvStream(cashflows, rate, startYear = 1) {
  return cashflows.reduce(
    (acc, cf, i) => acc + cf / Math.pow(1 + rate, startYear + i),
    0
  );
}

// Solve for the rate that makes an annuity's FV match a target.
// Returns the monthly (or per-period) rate via Newton-Raphson.
export function rateFromFV(targetFV, pmt, n, guess = 0.005) {
  let r = guess;
  for (let i = 0; i < 100; i++) {
    const f = pmt * (Math.pow(1 + r, n) - 1) / r - targetFV;
    // Derivative of f w.r.t. r
    const dr = 1e-7;
    const fp = (pmt * (Math.pow(1 + r + dr, n) - 1) / (r + dr) - targetFV - f) / dr;
    const step = f / fp;
    r -= step;
    if (Math.abs(step) < 1e-12) break;
  }
  return r;
}

// Bond price: annual coupons + face at maturity, discounted at `rate` per year.
export function bondPrice(face, coupon, rate, n) {
  return pvAnnuity(coupon, rate, n) + face / Math.pow(1 + rate, n);
}

// Perpetuity value: PMT/r, valued one period BEFORE the first cash flow.
export function perpetuity(pmt, rate) {
  return pmt / rate;
}
