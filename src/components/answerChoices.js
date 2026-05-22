// Answer-choices widget with click-for-feedback and confetti on correct.

import confetti from "npm:canvas-confetti";

export function answerChoices(choices, {revealOnLoad = false} = {}) {
  const container = document.createElement("div");
  container.style.cssText = "display:flex;flex-direction:column;gap:10px;margin:14px 0;";

  choices.forEach((c, i) => {
    const wrap = document.createElement("div");
    const btn = document.createElement("button");
    btn.innerHTML = `<span style="font-weight:700;color:#1F3864;margin-right:8px">${String.fromCharCode(97 + i)}.</span>${c.label}`;
    btn.style.cssText = `
      text-align: left;
      padding: 12px 16px;
      border: 1.5px solid #C8CDD3;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 14.5px;
      font-family: inherit;
      transition: transform 0.12s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      box-shadow: 0 1px 0 rgba(0,0,0,0.02);
    `;
    const feedback = document.createElement("div");
    feedback.style.cssText = `
      margin: 6px 0 4px 22px;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13.5px;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.35s cubic-bezier(0.2, 0, 0.1, 1), opacity 0.35s ease, padding 0.35s ease;
      line-height: 1.45;
    `;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (c.correct) {
        btn.style.background = "linear-gradient(135deg, #C6EFCE, #A8DAB4)";
        btn.style.borderColor = "#6FA86F";
        btn.style.fontWeight = "600";
        btn.style.boxShadow = "0 4px 14px rgba(111,168,111,0.35)";
        feedback.style.background = "#E2F0D9";
        feedback.style.color = "#1F4E1F";
        feedback.style.borderLeft = "3px solid #6FA86F";
        feedback.innerHTML = "<strong>✓ Correct.</strong> " + c.why;
        // Confetti burst from button
        const r = btn.getBoundingClientRect();
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 35,
          gravity: 0.9,
          ticks: 200,
          origin: { x: (r.left + r.width/2) / window.innerWidth, y: (r.top + r.height/2) / window.innerHeight },
          colors: ["#6FA86F", "#1F3864", "#2E75B6", "#FFB300", "#7030A0"]
        });
      } else {
        btn.style.background = "linear-gradient(135deg, #FCE4D6, #F4C8B0)";
        btn.style.borderColor = "#D27F5A";
        btn.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
          { duration: 250, iterations: 1 }
        );
        feedback.style.background = "#FBE5D6";
        feedback.style.color = "#8B3A0E";
        feedback.style.borderLeft = "3px solid #D27F5A";
        feedback.innerHTML = "<strong>✗</strong> " + c.why;
      }
      feedback.style.maxHeight = "200px";
      feedback.style.opacity = "1";
    };

    btn.addEventListener("click", reveal);
    btn.addEventListener("mouseover", () => {
      if (!revealed) {
        btn.style.background = "#F4F8FB";
        btn.style.borderColor = "#2E75B6";
        btn.style.transform = "translateY(-1px)";
      }
    });
    btn.addEventListener("mouseout", () => {
      if (!revealed) {
        btn.style.background = "#fff";
        btn.style.borderColor = "#C8CDD3";
        btn.style.transform = "translateY(0)";
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(feedback);
    container.appendChild(wrap);

    if (revealOnLoad) reveal();
  });

  return container;
}
