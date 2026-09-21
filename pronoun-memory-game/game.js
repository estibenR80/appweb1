/* ================= Pronoun Power — Memory Card Game ================= */

/* 10 PAIRS: each pair = a sentence card (with a blank) + its matching pronoun card.
   The "answer" links the two halves. Context: school, home, friends.
   Types: personal (subject), object, possessive (adjective/pronoun). */
const PAIRS = [
  {
    id: 1, type: "personal",
    sentence: '____ am a student at this school.',
    answer: "I",
    explain: '"I" is a personal (subject) pronoun — it does the action.'
  },
  {
    id: 2, type: "personal",
    sentence: '____ studies English every evening at home.',
    answer: "She",
    explain: '"She" is a personal (subject) pronoun for a female subject.'
  },
  {
    id: 3, type: "personal",
    sentence: '____ play football with our friends after class.',
    answer: "We",
    explain: '"We" is a personal (subject) pronoun for a group including the speaker.'
  },
  {
    id: 4, type: "object",
    sentence: 'My teacher helped ____ with the homework.',
    answer: "me",
    explain: '"me" is an object pronoun — it receives the action of "helped".'
  },
  {
    id: 5, type: "object",
    sentence: 'I really like ____; he is a good friend.',
    answer: "him",
    explain: '"him" is an object pronoun that receives the action of "like".'
  },
  {
    id: 6, type: "object",
    sentence: 'Please call ____ when dinner is ready.',
    answer: "us",
    explain: '"us" is an object pronoun for a group receiving the action.'
  },
  {
    id: 7, type: "possessive",
    sentence: 'This is ____ backpack; it belongs to Anna.',
    answer: "her",
    explain: '"her" is a possessive adjective — it shows the bag belongs to Anna.'
  },
  {
    id: 8, type: "possessive",
    sentence: 'That blue notebook is ____, not yours.',
    answer: "mine",
    explain: '"mine" is a possessive pronoun — it replaces the noun and shows possession.'
  },
  {
    id: 9, type: "possessive",
    sentence: '____ house has a big garden where we play.',
    answer: "Our",
    explain: '"Our" is a possessive adjective before a noun (house).'
  },
  {
    id: 10, type: "possessive",
    sentence: 'The dog wagged ____ tail happily.',
    answer: "its",
    explain: '"its" is a possessive adjective (no apostrophe) showing ownership.'
  }
];

/* 2 wildcards */
const WILDCARDS = [
  { wild: "extra", label: "🎁 EXTRA TURN", text: "Flip again!" },
  { wild: "lose",  label: "💥 LOSE A PAIR", text: "Return one pair" }
];

/* ---------- Build the deck ---------- */
function buildDeck() {
  const deck = [];
  PAIRS.forEach(p => {
    deck.push({ kind: "sentence", pairId: p.id, type: p.type, text: p.sentence, answer: p.answer, explain: p.explain });
    deck.push({ kind: "pronoun",  pairId: p.id, type: p.type, text: p.answer,   answer: p.answer, explain: p.explain });
  });
  WILDCARDS.forEach((w, i) => {
    deck.push({ kind: "wildcard", wild: w.wild, type: "wildcard", pairId: "W" + i, label: w.label, text: w.text });
  });
  // Fisher–Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/* ---------- Game state ---------- */
let deck = [];
let firstCard = null;
let lock = false;
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let matchedCount = 0;
let solo = false;

const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
const p1scoreEl = document.getElementById("p1score");
const p2scoreEl = document.getElementById("p2score");
const p1box = document.getElementById("p1box");
const p2box = document.getElementById("p2box");
const turnText = document.getElementById("turnText");
const winBanner = document.getElementById("winBanner");

function typeLabel(t) {
  return { personal: "Personal", possessive: "Possessive", object: "Object", wildcard: "Wildcard" }[t];
}

/* highlight the answer word inside the sentence with its color */
function highlightSentence(text, answer, type) {
  const filled = text.replace("____", `<mark class="${type}">${answer}</mark>`);
  return filled;
}

function render() {
  boardEl.innerHTML = "";
  deck.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.index = index;

    let frontContent = "";
    if (card.kind === "sentence") {
      frontContent = `
        <span class="type-tag">${typeLabel(card.type)}</span>
        <span class="content">${highlightSentence(card.text, card.answer, card.type)}</span>`;
    } else if (card.kind === "pronoun") {
      frontContent = `
        <span class="type-tag">${typeLabel(card.type)}</span>
        <span class="pronoun-big"><mark class="${card.type}">${card.text}</mark></span>`;
    } else {
      frontContent = `
        <span class="type-tag">Wildcard</span>
        <span class="content">${card.label}<br><small>${card.text}</small></span>`;
    }

    el.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">?</div>
        <div class="card-face card-front ${card.type}">${frontContent}</div>
      </div>`;

    el.addEventListener("click", () => onCardClick(el, index));
    boardEl.appendChild(el);
  });
  updateTurnUI();
}

function setMessage(text, cls) {
  messageEl.textContent = text;
  messageEl.className = "message " + (cls || "");
}

function updateTurnUI() {
  if (solo) {
    turnText.textContent = "Solo practice 🎯";
    p2box.style.display = "none";
  } else {
    p2box.style.display = "flex";
    turnText.textContent = `Player ${currentPlayer}'s turn`;
  }
  p1box.classList.toggle("active-player", currentPlayer === 1 && !solo);
  p2box.classList.toggle("active-player", currentPlayer === 2 && !solo);
  p1scoreEl.textContent = scores[1];
  p2scoreEl.textContent = scores[2];
}

function switchPlayer() {
  if (!solo) currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateTurnUI();
}

function onCardClick(el, index) {
  if (lock) return;
  if (el.classList.contains("flipped") || el.classList.contains("matched")) return;

  const card = deck[index];
  el.classList.add("flipped");

  /* Wildcard handling — resolves immediately */
  if (card.kind === "wildcard") {
    handleWildcard(card, el);
    return;
  }

  if (!firstCard) {
    firstCard = { el, index, card };
    setMessage("Now flip a matching card…", "");
    return;
  }

  // second card
  lock = true;
  const second = { el, index, card };
  const isMatch =
    firstCard.card.pairId === second.card.pairId &&
    firstCard.card.kind !== second.card.kind; // one sentence + one pronoun

  if (isMatch) {
    setMessage(`✅ Match! ${second.card.explain}`, "match");
    firstCard.el.classList.add("matched");
    second.el.classList.add("matched");
    scores[currentPlayer]++;
    matchedCount++;
    resetTurn(true);       // matcher plays again
    checkWin();
  } else {
    setMessage("❌ Try again! Those cards do not match.", "fail");
    setTimeout(() => {
      firstCard.el.classList.remove("flipped");
      second.el.classList.remove("flipped");
      resetTurn(false);
      switchPlayer();
    }, 1100);
  }
}

function handleWildcard(card, el) {
  if (card.wild === "extra") {
    setMessage("🎁 Extra Turn! Flip again — you keep your turn.", "wild");
    // stays same player; just flip it back so it can appear later? Keep it revealed and inert.
    el.classList.add("matched"); // consume it
  } else {
    setMessage("💥 Lose a Pair! Return one of your pairs.", "wild");
    el.classList.add("matched");
    if (scores[currentPlayer] > 0) {
      scores[currentPlayer]--;
      matchedCount = Math.max(0, matchedCount); // pair goes back to "pool" conceptually
    }
    updateTurnUI();
  }
  // A wildcard does not end the turn; player continues.
  updateTurnUI();
  checkWin();
}

function resetTurn(keepTurn) {
  firstCard = null;
  lock = false;
}

function checkWin() {
  if (matchedCount >= PAIRS.length) {
    let msg;
    if (solo) {
      msg = `🎉 Great job! You completed all ${PAIRS.length} pairs!`;
    } else if (scores[1] > scores[2]) {
      msg = `🏆 Player 1 wins with ${scores[1]} pairs! (Player 2: ${scores[2]})`;
    } else if (scores[2] > scores[1]) {
      msg = `🏆 Player 2 wins with ${scores[2]} pairs! (Player 1: ${scores[1]})`;
    } else {
      msg = `🤝 It's a tie — ${scores[1]} pairs each!`;
    }
    winBanner.textContent = msg;
    winBanner.classList.remove("hidden");
  }
}

function newGame() {
  deck = buildDeck();
  firstCard = null;
  lock = false;
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  matchedCount = 0;
  winBanner.classList.add("hidden");
  setMessage("Flip two cards to find a matching pair!", "");
  render();
}

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.getElementById("restartBtn").addEventListener("click", newGame);
document.getElementById("soloMode").addEventListener("change", (e) => {
  solo = e.target.checked;
  newGame();
});

/* ---------- Reflection content ---------- */
document.getElementById("reflectionDoc").innerHTML = `
  <h2>🔍 Metacognition — Reflection</h2>
  <p><strong>Why pronouns matter in daily communication.</strong> Pronouns let us speak naturally
  without repeating names again and again. Using them correctly helps us introduce ourselves
  ("<em>I am…</em>"), describe possessions ("<em>That is <mark class="possessive">mine</mark></em>"),
  and talk about friends and family ("<em>I like <mark class="object">him</mark></em>"). A wrong
  pronoun can change the meaning or make a sentence confusing, so accuracy builds clear communication.</p>

  <p><strong>How the game connected grammar with fun.</strong> Matching a sentence card to its
  pronoun card turned an abstract rule into a visual puzzle. Because a match only works when the
  pronoun truly fits the sentence, the game rewards correct grammar and gently corrects mistakes
  with the "Try again!" message.</p>

  <p><strong>Easier vs. harder pronouns.</strong> Personal (subject) pronouns like
  <mark class="personal">I</mark> and <mark class="personal">she</mark> were the easiest because
  they always start the sentence. Possessives were harder: knowing when to use
  <mark class="possessive">her</mark> (before a noun) versus <mark class="possessive">mine</mark>
  (alone) takes practice, and remembering that "<em>its</em>" has no apostrophe is a common trap.</p>

  <p><strong>Strategies used to avoid mistakes.</strong></p>
  <ul>
    <li><strong>Color coding</strong> — blue = personal, purple = possessive, red = object, so the
    eye learns the category instantly.</li>
    <li><strong>Repetition</strong> — flipping cards many times reinforces the correct forms.</li>
    <li><strong>Real-life examples</strong> — school, home, and friends contexts make the grammar
    meaningful and memorable.</li>
  </ul>

  <p><strong>Practical value.</strong> These same pronouns are exactly what learners need to
  introduce themselves, describe what they own, and talk about the people around them — the core of
  everyday A1 conversation.</p>

  <p><strong>How creativity supported learning.</strong> Designing colorful cards, adding wildcards
  ("Extra Turn" and "Lose a Pair"), and making cards flip on click made practice feel like play.
  The fun kept motivation high, and the interactivity gave immediate feedback, which is one of the
  best ways to turn a grammar rule into a lasting skill.</p>
`;

/* ---------- Start ---------- */
newGame();
