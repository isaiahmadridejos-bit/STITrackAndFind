
// ── Navigation ──
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    document.getElementById("navLinks")?.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  document.querySelector("nav")?.classList.toggle("scrolled", window.scrollY > 50);

  let current = "";
  document.querySelectorAll("section[id]").forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  document.querySelectorAll(".nav-links a[href^='#']").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

document.getElementById("navToggle")?.addEventListener("click", () => {
  document.getElementById("navLinks")?.classList.toggle("open");
});

// ── Render Track Cards ──
const grid = document.getElementById("tracksGrid");
tracks.forEach((tr) => {
  const card = document.createElement("div");
  card.className = "track-card";
  card.style.setProperty("--c-accent", tr.accent);
  card.style.setProperty("--c-tagbg", tr.tagbg);
  card.style.setProperty("--c-glow", tr.tagbg.replace(/[\d.]+\)$/, "0.05)"));
  card.style.setProperty("--c-icon", tr.tagbg.replace(/[\d.]+\)$/, "0.2)"));
  const pills = tr.clusters.map((c) => `<span class="cpill">${c.name}</span>`).join("");
  card.innerHTML = `
    <div class="t-icon">${tr.icon}</div>
    <h3>${tr.title}</h3>
    <p>${tr.desc}</p>
    <div class="t-tag">${tr.tag}</div>
    <div class="cluster-pills">${pills}</div>
  `;
  card.onclick = () => openTrack(tr);
  grid.appendChild(card);
});

// ── Modals ──
function openTrack(tr) {
  const btns = tr.clusters
    .map(
      (cl) => `
    <button class="cl-btn" data-track="${tr.id}" data-cluster="${encodeURIComponent(cl.name)}">
      <strong>${cl.icon} ${cl.name}</strong>
      <span>${cl.full}</span>
    </button>`
    )
    .join("");

  document.getElementById("modalBody").innerHTML = `
    <div class="modal-head">
      <h2>${tr.icon} ${tr.title}</h2>
      <p>${tr.desc}</p>
    </div>
    <p class="modal-note">Choose a cluster below to see its full navigation path — subjects, skills, certifications, and career options.</p>
    <div class="cluster-grid">${btns}</div>
    <div class="deped-note">${tr.note}</div>
  `;

  document.querySelectorAll(".cl-btn[data-track]").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.borderColor = tr.accent;
      btn.style.background = tr.tagbg;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.borderColor = "";
      btn.style.background = "";
    });
    btn.addEventListener("click", () => {
      openCluster(btn.dataset.track, decodeURIComponent(btn.dataset.cluster));
    });
  });

  openModal();
}

function openCluster(trackId, clusterName) {
  const tr = tracks.find((t) => t.id === trackId);
  const cl = tr.clusters.find((c) => c.name === clusterName);
  const steps = cl.steps
    .map(
      (s) => `
    <div class="t-step">
      <div class="t-side">
        <div class="t-dot" style="background:${s.bg};border-color:${s.accent}">${s.icon}</div>
        <div class="t-line"></div>
      </div>
      <div class="t-body">
        <div class="t-label" style="color:${s.accent}">${s.label}</div>
        <h4>${s.title}</h4>
        <p>${s.body}</p>
        <div class="t-tags">${s.tags.map((t) => `<span class="t-tag">${t}</span>`).join("")}</div>
      </div>
    </div>`
    )
    .join("");

  document.getElementById("modalBody").innerHTML = `
    <button class="modal-back" id="modalBack">← Back to ${tr.title}</button>
    <div class="modal-head">
      <h2>${cl.icon} ${cl.name}</h2>
      <p style="font-size:0.78rem;color:var(--accent-color2);font-weight:600;margin-bottom:0.4rem;">${cl.full}</p>
      <p>${cl.desc}</p>
    </div>
    <div class="timeline">${steps}</div>
  `;

  document.getElementById("modalBack").onclick = () => openTrack(tr);
  document.getElementById("modalBox").scrollTop = 0;
}

function openModal() {
  document.getElementById("overlay").classList.add("open");
  document.getElementById("modalBox").scrollTop = 0;
}

function closeModal() {
  document.getElementById("overlay").classList.remove("open");
}

document.getElementById("modalClose").onclick = closeModal;
document.getElementById("overlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("overlay")) closeModal();
});

// ── Quiz ──
const quizQuestions = [
  {
    question: "Which activity sounds most interesting to you?",
    choices: [
      { text: "Solving math or science problems", scores: { STEM: 3, ICT: 1 } },
      { text: "Planning a business or selling something", scores: { Business: 3, Agri: 1 } },
      { text: "Writing, debating, or creating art", scores: { Arts: 3, Creative: 1 } },
      { text: "Sports, fitness, or helping people stay healthy", scores: { Sports: 3, Wellness: 1 } },
    ],
  },
  {
    question: "What kind of work environment do you prefer?",
    choices: [
      { text: "A lab, clinic, or research setting", scores: { STEM: 2, Sports: 1, Wellness: 1 } },
      { text: "An office, store, or your own business", scores: { Business: 3, Agri: 1 } },
      { text: "A kitchen, hotel, or travel destination", scores: { Hospitality: 3, Business: 1 } },
      { text: "In front of a computer building or fixing things", scores: { ICT: 3, STEM: 1, Creative: 1 } },
    ],
  },
  {
    question: "Which subject do you enjoy most in school?",
    choices: [
      { text: "Science or Mathematics", scores: { STEM: 3, ICT: 1 } },
      { text: "English, Filipino, or Social Studies", scores: { Arts: 3, Business: 1 } },
      { text: "TLE, ICT, or hands-on activities", scores: { ICT: 2, Hospitality: 2, Creative: 1 } },
      { text: "MAPEH or anything physical/active", scores: { Sports: 3, Wellness: 1 } },
    ],
  },
  {
    question: "What do you want right after Senior High School?",
    choices: [
      { text: "Go to college with a strong academic foundation", scores: { STEM: 2, Arts: 2, Business: 2 } },
      { text: "Get a job or certification quickly", scores: { ICT: 2, Hospitality: 2, Wellness: 2, Agri: 1 } },
      { text: "Start my own business", scores: { Business: 3, Agri: 2, Creative: 1 } },
      { text: "I'm not sure yet — I want to keep options open", scores: { STEM: 1, Arts: 1, Business: 1, ICT: 1, Hospitality: 1 } },
    ],
  },
  {
    question: "Which describes you best?",
    choices: [
      { text: "Analytical — I like logic and evidence", scores: { STEM: 3, ICT: 1 } },
      { text: "Creative — I express ideas through art or words", scores: { Arts: 2, Creative: 3 } },
      { text: "People-oriented — I love helping and serving others", scores: { Hospitality: 2, Wellness: 3, Sports: 1 } },
      { text: "Practical — I prefer doing over reading", scores: { Agri: 2, ICT: 2, Hospitality: 1 } },
    ],
  },
  {
    question: "Pick a dream job:",
    choices: [
      { text: "Engineer, Doctor, or Scientist", scores: { STEM: 3 } },
      { text: "Entrepreneur, Accountant, or Manager", scores: { Business: 3 } },
      { text: "Programmer, Web Developer, or IT Specialist", scores: { ICT: 3, STEM: 1 } },
      { text: "Chef, Hotel Manager, or Tour Guide", scores: { Hospitality: 3 } },
    ],
  },
];

const clusterResults = {
  STEM: { trackId: "academic", clusterName: "STEM", summary: "You think analytically and enjoy science, technology, and problem-solving — STEM is a strong match for you." },
  Business: { trackId: "academic", clusterName: "Business and Entrepreneurship", summary: "You have an entrepreneurial mindset and interest in how organizations and money work." },
  Arts: { trackId: "academic", clusterName: "Arts, Social Science, and Humanities", summary: "You're drawn to ideas, people, culture, and creative expression — this cluster fits your strengths." },
  Sports: { trackId: "academic", clusterName: "Sports, Health, and Wellness", summary: "You care about the body, movement, and wellness — this cluster connects your interests to real careers." },
  ICT: { trackId: "techpro", clusterName: "ICT Support and Computer Programming", summary: "You're tech-minded and practical — ICT gives you in-demand digital skills with TESDA certification options." },
  Hospitality: { trackId: "techpro", clusterName: "Hospitality and Tourism", summary: "You thrive in service, food, travel, and hospitality — a hands-on path with strong job prospects." },
  Agri: { trackId: "techpro", clusterName: "Agri-Fishery Business and Food Innovation", summary: "You're interested in food production, farming, and building an agricultural business." },
  Creative: { trackId: "techpro", clusterName: "Creative Arts and Design Technology", summary: "You think visually and love creating — animation, illustration, and design are your lane." },
  Wellness: { trackId: "techpro", clusterName: "Aesthetic, Wellness, and Human Care", summary: "You genuinely care about people — beauty, wellness, and caregiving careers suit your empathy." },
};

let qIndex = 0;
let quizScores = {};

function renderQuizQuestion() {
  const q = quizQuestions[qIndex];
  document.getElementById("quizBox").innerHTML = `
    <p class="quiz-progress">Question ${qIndex + 1} of ${quizQuestions.length}</p>
    <h3 class="quiz-question">${q.question}</h3>
    <div class="quiz-choices">
      ${q.choices.map((c, i) => `<button class="quiz-choice" data-i="${i}">${c.text}</button>`).join("")}
    </div>
  `;
  document.querySelectorAll(".quiz-choice").forEach((btn) => {
    btn.onclick = () => pickAnswer(Number(btn.dataset.i));
  });
}

function pickAnswer(i) {
  const choice = quizQuestions[qIndex].choices[i];
  for (const [cluster, pts] of Object.entries(choice.scores)) {
    quizScores[cluster] = (quizScores[cluster] || 0) + pts;
  }
  qIndex++;
  if (qIndex < quizQuestions.length) renderQuizQuestion();
  else showQuizResult();
}

function showQuizResult() {
  const winner = Object.entries(quizScores).sort((a, b) => b[1] - a[1])[0][0];
  const result = clusterResults[winner];
  document.getElementById("quizBox").innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-icon"><span class="iconify" data-icon="iconsax:target" data-inline="false"></span></div>
      <h3>${result.clusterName}</h3>
      <p>${result.summary}</p>
      <div class="quiz-result-btns">
        <button class="btn-primary" id="viewClusterBtn">View Full Cluster Details</button>
        <button class="btn-secondary" id="retakeQuizBtn">Retake Quiz</button>
      </div>
    </div>
  `;
  document.getElementById("viewClusterBtn").onclick = () => {
    openCluster(result.trackId, result.clusterName);
    scrollToSection("Tracks");
  };
  document.getElementById("retakeQuizBtn").onclick = resetQuiz;
}

function resetQuiz() {
  qIndex = 0;
  quizScores = {};
  renderQuizQuestion();
}

renderQuizQuestion();

// ── Chatbot ──
const chatFab = document.getElementById("chatFab");
const chatPanel = document.getElementById("chatPanel");
const chatMsgs = document.getElementById("chatMsgs");
const chatInput = document.getElementById("chatInput");

chatFab.onclick = () => chatPanel.classList.toggle("open");
document.getElementById("chatClose").onclick = () => chatPanel.classList.remove("open");

function addChat(text, who) {
  const div = document.createElement("div");
  div.className = `chat-msg ${who}`;
  div.textContent = text;
  chatMsgs.appendChild(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

async function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  addChat(msg, "user");
  chatInput.value = "";
  addChat("Thinking...", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    chatMsgs.lastElementChild.textContent = data.reply;
  } catch {
    chatMsgs.lastElementChild.textContent =
      "Could not reach the server. Run 'node server.js' and open http://localhost:3000 to use the AI chatbot.";
  }
}

document.getElementById("chatSend").onclick = sendChat;
chatInput.onkeydown = (e) => {
  if (e.key === "Enter") sendChat();
 f793743ad1c632cb83f41b125efc2356bd625b2b
};