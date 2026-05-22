---
title: Excel TVM Function Reference
---

# Excel TVM Function Reference

The five financial functions that solve almost any time-value-of-money problem. Memorize the **sign convention** below before anything else.

## The sign convention

Excel TVM functions follow one rule: **money flowing IN is positive, money flowing OUT is negative**. The result comes back with the *opposite* sign of the inputs.

If `PMT` returns a negative number where you wanted positive, either:
- flip a sign on one of your inputs, or
- wrap the whole formula in `-PMT(...)`.

Both are fine on the quiz. Just be consistent.

## The clock-matching rule

If payments happen monthly, the rate and the period count must **both** be monthly. Mix annual rate with monthly periods and the answer is off by a factor of 12.

| You have | Rate input | Period input |
|---|---|---|
| 6% APR, monthly payments, 30 years | `0.06/12` | `30*12` |
| 8% annual rate, annual payments, 5 years | `0.08` | `5` |
| 10% APR, quarterly payments, 4 years | `0.10/4` | `4*4` |

## The functions

### `=PV(rate, nper, pmt, [fv], [type])`

Today's value of a future cash stream. Use for bonds, deferred annuities, anything you'd "buy now to receive later."

```
=PV(0.08, 10, -1000)        ← PV of $1,000/yr for 10 years at 8%
=PV(0.06, 4, -30, -1000)    ← bond paying $30 coupons + $1,000 face in 4 years
=PV(0.04, 3, 200, 0, 1)     ← annuity DUE (type=1 instead of type=0)
```

### `=FV(rate, nper, pmt, [pv])`

Ending balance of a stream. Useful for savings accounts and verification.

```
=FV(0.0075, 24, -800)       ← $800/month for 24 months at 0.75% per month
```

### `=PMT(rate, nper, pv, [fv])`

Periodic payment that retires a loan (or builds a target balance).

```
=PMT(0.03/12, 360, -400000) ← monthly payment on a $400k mortgage, 3% APR, 30yr
```

### `=RATE(nper, pmt, pv, [fv])`

Solve for the rate when everything else is known. Returns the **per-period** rate.

```
=RATE(24, -800, 0, 20951)   ← monthly rate on the savings account in Q4
=RATE(24, -800, 0, 20951)*12 ← APR
```

### `=NPER(rate, pmt, pv, [fv])`

Solve for the number of periods.

```
=NPER(0.04, -200, 555)      ← how many $200 payments at 4% have a PV of $555
```

## EAR conversion (Q5)

Whenever the rate compounds at one frequency but the cash flows happen at another, convert the rate first. The Effective Annual Rate (EAR) is what you actually earn over a year given <em>m</em> compounding periods.

```
EAR = (1 + APR/m)^m − 1
```

In Excel:
```
=(1 + 0.06/12)^12 - 1       ← 6.1678% for monthly compounding of 6% APR
=EFFECT(0.06, 12)           ← same answer, using Excel's built-in function
```

## Perpetuity formula (Q7)

A perpetuity of <em>D</em> per period valued at the rate <em>r</em> is worth <em>D/r</em> — but **one period before the first cash flow**.

If the first cash flow lands in year <em>t</em>, the perpetuity is worth <em>D/r</em> at year <em>t-1</em>, and you discount it <em>t-1</em> years back to today:

```
PV = (D/r) / (1+r)^(t-1)
```

For Q7's year-7-and-onward \$5 dividend at 8%: <em>D/r</em> = 62.50 at year 6, then 62.50 / (1.08)<sup>6</sup> = 39.39 today.

---

[← back to all problems](../)
