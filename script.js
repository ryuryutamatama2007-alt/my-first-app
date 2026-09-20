const btn = document.getElementById("hello-btn");
const avatar = document.querySelector(".avatar");
const emojis = ["🎉", "✨", "💜", "🌸", "⭐", "🎈", "🍀"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function burst(originX, originY) {
  const count = window.innerWidth < 520 ? 16 : 28;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = (window.innerWidth < 520 ? 60 : 90) + Math.random() * (window.innerWidth < 520 ? 90 : 160);
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * distance - 60}px`);
    p.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
    p.style.fontSize = `${1 + Math.random() * 1.2}rem`;

    p.addEventListener("animationend", () => p.remove());
    document.body.appendChild(p);
  }
}

btn.addEventListener("click", () => {
  const rect = btn.getBoundingClientRect();
  if (!reduceMotion.matches) {
    burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  avatar.classList.remove("wave");
  void avatar.offsetWidth; // アニメーションを再始動
  avatar.classList.add("wave");

  btn.textContent = "こんにちは！ 🎉";
  clearTimeout(btn.resetTimer);
  btn.resetTimer = setTimeout(() => {
    btn.textContent = "👋 あいさつする";
  }, 2000);
});

/* ---- テーマ切替（選択はlocalStorageに保存） ---- */
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
}
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch {}
applyTheme(currentTheme());

themeBtn.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch {}
});

/* ---- タイプライター ---- */
const typedEl = document.getElementById("typed");
const words = typedEl.dataset.words.split(",");
if (!reduceMotion.matches) {
  let w = 0, c = 0, deleting = false;
  (function tick() {
    const word = words[w];
    c += deleting ? -1 : 1;
    typedEl.textContent = word.slice(0, c);
    let delay = deleting ? 50 : 110;
    if (!deleting && c === word.length) { deleting = true; delay = 1600; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  })();
}

/* ---- 今日のひとこと ---- */
const messages = [
  "🍀 小さな一歩が、大きな変化のはじまり。",
  "☕ 今日は一息ついて、好きな飲み物を。",
  "📚 新しい本との出会いがありそうです。",
  "📷 いつもの道に、素敵な景色が隠れています。",
  "🏃 体を動かすと、アイデアがひらめく日。",
  "💜 ありがとうを伝えると、良いことが返ってきます。",
  "🎵 お気に入りの曲が、背中を押してくれます。",
];
const fortuneBtn = document.getElementById("fortune-btn");
const fortuneOut = document.getElementById("fortune-result");
let lastIndex = -1;

fortuneBtn.addEventListener("click", () => {
  let i;
  do { i = Math.floor(Math.random() * messages.length); } while (i === lastIndex);
  lastIndex = i;
  fortuneOut.textContent = messages[i];
  fortuneOut.classList.remove("flip");
  void fortuneOut.offsetWidth;
  fortuneOut.classList.add("flip");
  fortuneBtn.textContent = "🔮 もう一度引く";
});
