/* =========================================================
   0. ONE-TIME MIGRATION
   ========================================================= */
if (!localStorage.getItem("sidekickCleanV14")) {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("sk_")) localStorage.removeItem(key);
  });
  localStorage.setItem("sidekickCleanV14", "true");
}

/* =========================================================
   1. SUBJECTS, LEVELS & CATEGORIES
   ========================================================= */
const subjectsByGrade = {
  middle: [
    "English", "Mathematics", "Integrated Science", "Individuals and Societies",
    "Spanish", "French", "Hindi", "Design", "Visual Arts", "Theatre",
    "Dance", "Music", "Physical Education", "Other"
  ],
  upper: [
    "English", "Mathematics", "Biology", "Chemistry", "Physics",
    "Integrated Humanities", "History", "Spanish", "French", "Hindi",
    "Design", "Visual Arts", "Theatre", "Dance", "Music",
    "Physical Education", "Entrepreneurship Management", "Psychology",
    "Creative Media", "Other"
  ],
  senior: [
    "English", "Mathematics", "Biology", "Chemistry", "Physics",
    "Individuals and Societies", "Spanish", "French", "Hindi", "Design",
    "Visual Arts", "Theatre", "Dance", "Music", "Physical Education",
    "Entrepreneurship Management", "Psychology", "Creative Media",
    "Global Politics", "Economics", "Other"
  ]
};

function getSubjectLevels(grade) {
  if (grade >= 6 && grade <= 8) {
    return {
      "Spanish": ["Proficient", "Capable", "Emergent", "N/A"],
      "French":  ["Proficient", "Capable", "Emergent", "N/A"],
      "Hindi":   ["Proficient", "Capable", "Emergent", "N/A"]
    };
  }
  if (grade >= 9 && grade <= 10) {
    return {
      "Mathematics": ["Standard", "Extended", "N/A"],
      "Spanish":     ["Proficient", "Capable", "Emergent", "N/A"],
      "French":      ["Proficient", "Capable", "Emergent", "N/A"],
      "Hindi":       ["Proficient", "Capable", "Emergent", "N/A"]
    };
  }
  return {
    "Mathematics": ["Standard Level", "Higher Level", "N/A"],
    "English": ["Standard Level", "Higher Level", "N/A"],
    "Spanish": ["Standard Level", "Higher Level", "N/A"],
    "French": ["Standard Level", "Higher Level", "N/A"],
    "Hindi": ["Standard Level", "Higher Level", "N/A"],
    "Psychology": ["Standard Level", "Higher Level", "N/A"],
    "Creative Media": ["Standard Level", "Higher Level", "N/A"],
    "Design": ["Standard Level", "Higher Level", "N/A"],
    "Visual Arts": ["Standard Level", "Higher Level", "N/A"],
    "Theatre": ["Standard Level", "Higher Level", "N/A"],
    "Dance": ["Standard Level", "Higher Level", "N/A"],
    "Music": ["Standard Level", "Higher Level", "N/A"],
    "Physical Education": ["Standard Level", "Higher Level", "N/A"],
    "Entrepreneurship Management": ["Standard Level", "Higher Level", "N/A"],
    "Global Politics": ["Standard Level", "Higher Level", "N/A"],
    "Biology": ["Standard Level", "Higher Level", "N/A"],
    "Chemistry": ["Standard Level", "Higher Level", "N/A"],
    "Physics": ["Standard Level", "Higher Level", "N/A"]
  };
}

function getSubjectCategory(subject) {
  const categories = {
    "Mathematics": ["Mathematics"],
    "English":     ["English"],
    "Sciences":    ["Biology", "Chemistry", "Physics", "Integrated Science"],
    "Languages":   ["Spanish", "French", "Hindi"],
    "E-Portfolio": ["Design", "Visual Arts", "Theatre", "Dance", "Music", "Physical Education"],
    "Humanities":  ["Individuals and Societies", "Integrated Humanities", "History", "Global Politics", "Economics"],
    "Electives":   ["Entrepreneurship Management", "Psychology", "Creative Media"],
    "Other":       ["Other"]
  };
  for (const category in categories) {
    if (categories[category].includes(subject)) return category;
  }
  return "Other";
}

/* =========================================================
   2. AUTH & ONBOARDING FLOW (MANDATORY LEVEL SELECTION)
   ========================================================= */
const authPages = [
  "auth-page", "signup-step-1", "signup-step-2", "signup-step-3",
  "subjects-page", "login-page", "forgot-password-page"
];

function showScreen(screenId) {
  authPages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  const shell = document.getElementById("app-shell");
  if (shell) shell.hidden = true;

  const target = document.getElementById(screenId);
  if (target) target.hidden = false;
  if (screenId === "app-shell") initPlanner();
}

document.getElementById("signup-button").addEventListener("click", () => showScreen("signup-step-1"));
document.getElementById("login-button").addEventListener("click", () => showScreen("login-page"));
document.getElementById("forgot-password-button").addEventListener("click", () => showScreen("forgot-password-page"));
document.getElementById("back-to-login").addEventListener("click", () => showScreen("login-page"));
document.getElementById("back-to-auth").addEventListener("click", () => showScreen("auth-page"));

document.getElementById("name-form").addEventListener("submit", e => {
  e.preventDefault();
  showScreen("signup-step-2");
});

document.getElementById("grade-form").addEventListener("submit", e => {
  e.preventDefault();
  showScreen("signup-step-3");
});

document.getElementById("account-form").addEventListener("submit", e => {
  e.preventDefault();
  const grade = Number(document.getElementById("signup-grade").value);
  const list = grade <= 8 ? subjectsByGrade.middle : grade <= 10 ? subjectsByGrade.upper : subjectsByGrade.senior;
  const levelsMap = getSubjectLevels(grade);

  const container = document.getElementById("subject-options");
  container.innerHTML = "";

  const grouped = {};
  list.forEach(subj => {
    const cat = getSubjectCategory(subj);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(subj);
  });

  Object.entries(grouped).forEach(([category, subjects]) => {
    const block = document.createElement("div");
    block.className = "subject-category-block";
    block.innerHTML = `<h4>${category}</h4>`;

    const grid = document.createElement("div");
    grid.className = "category-subject-grid";

    subjects.forEach(subj => {
      const wrapper = document.createElement("div");
      wrapper.className = "subject-chip-wrapper";

      const levels = levelsMap[subj];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "subject-button";
      btn.dataset.subject = subj;
      btn.dataset.hasLevels = levels ? "true" : "false";
      btn.dataset.level = "";
      btn.textContent = subj;

      let levelRow = null;

      if (levels) {
        levelRow = document.createElement("div");
        levelRow.className = "level-pill-row";
        levelRow.hidden = true;

        levels.forEach(lvl => {
          const pill = document.createElement("button");
          pill.type = "button";
          pill.className = "level-pill";
          pill.textContent = lvl;
          pill.addEventListener("click", () => {
            levelRow.querySelectorAll(".level-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            btn.dataset.level = lvl; // Stores "N/A" explicitly when N/A is chosen
          });
          levelRow.appendChild(pill);
        });
      }

      btn.addEventListener("click", () => {
        btn.classList.toggle("selected");
        if (levelRow) {
          levelRow.hidden = !btn.classList.contains("selected");
          if (!btn.classList.contains("selected")) {
            btn.dataset.level = "";
            levelRow.querySelectorAll(".level-pill").forEach(p => p.classList.remove("active"));
          }
        }
      });

      wrapper.appendChild(btn);
      if (levelRow) wrapper.appendChild(levelRow);
      grid.appendChild(wrapper);
    });

    block.appendChild(grid);
    container.appendChild(block);
  });

  showScreen("subjects-page");
});

function getAccounts() {
  return JSON.parse(localStorage.getItem("sidekickAccounts")) || [];
}

document.getElementById("finish-signup").addEventListener("click", () => {
  const selectedButtons = [...document.querySelectorAll(".subject-button.selected")];

  if (selectedButtons.length === 0) {
    return alert("Please select at least one subject!");
  }

  // Enforce mandatory level selection for subjects that have levels
  const missingLevelSubjects = selectedButtons
    .filter(b => b.dataset.hasLevels === "true" && !b.dataset.level)
    .map(b => b.dataset.subject);

  if (missingLevelSubjects.length > 0) {
    return alert(`Please choose a level (or N/A) for: ${missingLevelSubjects.join(", ")}`);
  }

  const selected = selectedButtons.map(b => {
    const subj = b.dataset.subject;
    const lvl = b.dataset.level;
    return lvl && lvl !== "N/A" ? `${subj} (${lvl})` : subj;
  });

  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const accounts = getAccounts();
  if (accounts.some(a => a.email === email)) {
    alert("Account already exists! Please log in.");
    return showScreen("login-page");
  }

  accounts.push({
    firstName: document.getElementById("first-name").value.trim(),
    lastName: document.getElementById("last-name").value.trim(),
    grade: document.getElementById("signup-grade").value,
    email,
    password: document.getElementById("signup-password").value,
    subjects: selected
  });

  localStorage.setItem("sidekickAccounts", JSON.stringify(accounts));
  sessionStorage.setItem("sidekickCurrentUser", email);
  showScreen("app-shell");
});

document.getElementById("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value;
  const user = getAccounts().find(a => a.email === email);

  if (!user || user.password !== pass) return alert("Invalid email or password.");
  sessionStorage.setItem("sidekickCurrentUser", email);
  showScreen("app-shell");
});

document.getElementById("reset-password-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value.trim().toLowerCase();
  const p1 = document.getElementById("new-password").value;
  const p2 = document.getElementById("confirm-password").value;

  const accounts = getAccounts();
  const idx = accounts.findIndex(a => a.email === email);
  if (idx === -1) return alert("Email not found.");
  if (p1 !== p2) return alert("Passwords do not match.");

  accounts[idx].password = p1;
  localStorage.setItem("sidekickAccounts", JSON.stringify(accounts));
  alert("Password reset! Please log in.");
  showScreen("login-page");
});

/* =========================================================
   3. USER DATA, TIERED STAR REWARDS & PUZZLE ROTATION
   ========================================================= */
function userKey(suffix) {
  return "sk_" + (sessionStorage.getItem("sidekickCurrentUser") || "guest") + "_" + suffix;
}

function getCurrentAccount() {
  const email = sessionStorage.getItem("sidekickCurrentUser");
  return getAccounts().find(a => a.email === email);
}

function getTasks() {
  return JSON.parse(localStorage.getItem(userKey("tasks"))) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(userKey("tasks"), JSON.stringify(tasks));
  refreshAllViews();
}

function getGoals() {
  return JSON.parse(localStorage.getItem(userKey("goals"))) || [];
}

function saveGoals(goals) {
  localStorage.setItem(userKey("goals"), JSON.stringify(goals));
  renderGoalsEverywhere();
}

function getUserStats() {
  return JSON.parse(localStorage.getItem(userKey("stats"))) || {
    stars: 0,
    streak: 0,
    unlockedTiles: 0,
    focusMinutesToday: 0,
    sessionsToday: 0
  };
}

/* 20 stars = 1 tile; every 9 tiles (180 stars) advances to the next puzzle */
function getPuzzleProgress(stars) {
  const totalTilesEarned = Math.floor(Math.max(0, stars) / 20);
  const puzzleIndex = Math.floor(totalTilesEarned / 9);
  const currentTiles = totalTilesEarned % 9;
  return { puzzleIndex, currentTiles };
}

function saveUserStats(stats) {
  const { currentTiles } = getPuzzleProgress(stats.stars);
  stats.unlockedTiles = currentTiles;
  localStorage.setItem(userKey("stats"), JSON.stringify(stats));
  renderStatsDisplay();
  applyInterestsAndEffects();
}

/* Base x = 10 stars | Homework +5 | Revision +10 | Formative +15 | Summative +30 */
function getTaskStarReward(task) {
  const base = 10;
  const bonuses = {
    "Homework":  5,
    "Revision":  10,
    "Formative": 15,
    "Summative": 30
  };
  return base + (bonuses[task?.type] || 0);
}

function addStars(amount) {
  const stats = getUserStats();
  stats.stars = Math.max(0, stats.stars + amount);
  if (amount > 0 && stats.streak === 0) stats.streak = 1;
  saveUserStats(stats);
}

/* =========================================================
   4. TOP NAVIGATION & PAGE SWITCHING
   ========================================================= */
function switchTab(tabName) {
  document.querySelectorAll(".app-page").forEach(p => (p.hidden = true));
  document.getElementById("page-" + tabName).hidden = false;

  document.querySelectorAll(".nav-tab[data-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.getElementById("main-nav").classList.remove("open");
}

document.querySelectorAll(".nav-tab[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

document.getElementById("mobile-menu-toggle").addEventListener("click", () => {
  document.getElementById("main-nav").classList.toggle("open");
});

document.getElementById("managebac-btn").addEventListener("click", () => {
  window.open("https://www.managebac.com", "_blank");
});

document.getElementById("theme-shortcut-btn").addEventListener("click", () => switchTab("settings"));
document.getElementById("go-to-tasks-arrow").addEventListener("click", () => switchTab("tasks"));
document.getElementById("profile-avatar-btn").addEventListener("click", () => switchTab("settings"));

document.getElementById("notif-toggle").addEventListener("click", e => {
  e.target.textContent = e.target.textContent === "🔔" ? "🔕" : "🔔";
});

/* =========================================================
   5. HOME PAGE INITIALIZATION & RENDERING
   ========================================================= */
function initPlanner() {
  const user = getCurrentAccount();
  if (!user) return showScreen("auth-page");

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning," : hour < 17 ? "Good afternoon," : "Good evening,";
  document.getElementById("greeting-prefix").textContent = greet;
  document.getElementById("greeting-name").textContent = user.firstName + " !";

  const now = new Date();
  document.getElementById("current-day").textContent = now.toLocaleDateString("en-IN", { weekday: "long" }) + ",";
  document.getElementById("current-date").textContent = now.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  document.getElementById("note-editor").innerHTML = localStorage.getItem(userKey("notes")) || "";

  loadInterestsAndEffects();
  applyTheme(localStorage.getItem(userKey("theme")) || "Default");

  const fullName = `${user.firstName} ${user.lastName || ""}`.trim().toUpperCase();
  document.getElementById("settings-profile-name").textContent = fullName;
  document.getElementById("edit-first-name").value = user.firstName;
  document.getElementById("edit-last-name").value = user.lastName || "";
  document.getElementById("edit-grade").value = user.grade;

  renderPomoCarousel();
  refreshAllViews();
}

function renderStatsDisplay() {
  const stats = getUserStats();
  const tasks = getTasks();
  const remainingStars = tasks
    .filter(t => !t.completed)
    .reduce((sum, t) => sum + getTaskStarReward(t), 0);

  const { puzzleIndex, currentTiles } = getPuzzleProgress(stats.stars);

  document.getElementById("stars-count").textContent = stats.stars;
  document.getElementById("header-stars").textContent = stats.stars;
  document.getElementById("streak-count").textContent = stats.streak;
  document.getElementById("header-streak").textContent = stats.streak;
  document.getElementById("available-stars").textContent = "+" + remainingStars;
  document.getElementById("streak-subtext").textContent = stats.streak > 0 ? "Keep going!" : "Start your streak today!";

  const puzzleContainer = document.getElementById("puzzle-cells");
  puzzleContainer.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const tile = document.createElement("span");
    tile.className = "puzzle-tile" + (i < currentTiles ? " unlocked" : "");
    puzzleContainer.appendChild(tile);
  }
  document.getElementById("collectibles-progress-label").textContent =
    `Puzzle ${puzzleIndex + 1} • ${currentTiles}/9 tiles unlocked (1 tile = 20 ★)`;

  document.getElementById("focus-minutes-today").textContent = `${stats.focusMinutesToday} mins`;
  document.getElementById("focus-sessions-today").textContent = stats.sessionsToday;
}

function refreshAllViews() {
  const tasks = getTasks();
  const doneCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  document.getElementById("progress-text").textContent = `${doneCount}/${totalCount} tasks completed!`;
  document.getElementById("progress-percent").textContent = `${pct}%`;
  document.getElementById("progress-bar-fill").style.width = `${pct}%`;

  const upcomingBox = document.getElementById("home-upcoming-list");
  upcomingBox.innerHTML = "";
  const activeTasks = tasks.filter(t => !t.completed).slice(0, 3);
  if (activeTasks.length === 0) {
    upcomingBox.innerHTML = `<p class="font-schoolbell" style="text-align:center;color:#555;margin:18px 0;">No upcoming tasks yet.</p>`;
  } else {
    activeTasks.forEach((t, i) => {
      const row = document.createElement("div");
      row.className = "upcoming-row";
      row.innerHTML = `
        <div>
          <span class="upcoming-num">${i + 1}</span>
          <strong>${t.title}</strong><br>
          <span class="subject-pill">${t.subject}</span>
          <span class="type-pill">${t.type}</span>
        </div>
        <span>${t.date || "No date"}</span>
      `;
      upcomingBox.appendChild(row);
    });
  }

  renderStatsDisplay();
  renderTasksPage();
  renderFocusPage();
  renderGoalsEverywhere();
  renderSettingsSubjects();
}

/* Rich-Text Notes Toolbar */
const noteEditor = document.getElementById("note-editor");
const noteFonts = ["Schoolbell", "League Spartan", "Railey", "Amoresa Regular"];
let fontIdx = 0;
const alignments = ["justifyLeft", "justifyCenter", "justifyRight"];
let alignIdx = 0;
const textColors = ["#2A4F8D", "#A8302B", "#344740", "#471AA1", "#FF0091", "#000000"];
let colorIdx = 0;

document.querySelectorAll("[data-cmd]").forEach(btn => {
  btn.addEventListener("mousedown", e => e.preventDefault());
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    noteEditor.focus();
    if (["bold", "italic", "underline", "strikeThrough"].includes(cmd)) {
      document.execCommand(cmd);
    } else if (cmd === "align") {
      alignIdx = (alignIdx + 1) % alignments.length;
      document.execCommand(alignments[alignIdx]);
    } else if (cmd === "star") {
      document.execCommand("insertText", false, "★ ");
    } else if (cmd === "font") {
      fontIdx = (fontIdx + 1) % noteFonts.length;
      document.execCommand("fontName", false, noteFonts[fontIdx]);
    } else if (cmd === "highlight") {
      const bg = document.queryCommandValue("hiliteColor");
      const active = bg === "rgb(255, 243, 163)" || bg === "#fff3a3";
      document.execCommand("hiliteColor", false, active ? "transparent" : "#FFF3A3");
    } else if (cmd === "color") {
      document.execCommand("foreColor", false, textColors[colorIdx]);
      colorIdx = (colorIdx + 1) % textColors.length;
    }
    document.getElementById("note-save-status").textContent = "Unsaved changes";
  });
});

document.getElementById("add-note-chip-btn").addEventListener("click", () => {
  noteEditor.focus();
  document.execCommand("insertHTML", false, "<div>★ </div>");
});

document.getElementById("save-note-btn").addEventListener("click", () => {
  localStorage.setItem(userKey("notes"), noteEditor.innerHTML);
  document.getElementById("note-save-status").textContent = "Saved!";
});

/* Quick Actions */
document.getElementById("qa-add-task").addEventListener("click", () => {
  switchTab("tasks");
  document.getElementById("open-add-task-modal").click();
});

document.getElementById("qa-enable-pomodoro").addEventListener("click", () => switchTab("focus"));

document.getElementById("qa-complete-task").addEventListener("click", () => {
  const tasks = getTasks();
  const next = tasks.find(t => !t.completed);
  if (!next) return alert("No pending tasks to complete! Add a task first.");
  next.completed = true;
  addStars(getTaskStarReward(next));
  saveTasks(tasks);
});

/* Goals */
function renderGoalsEverywhere() {
  const goals = getGoals();
  ["home-goals-list", "settings-goals-list"].forEach(listId => {
    const el = document.getElementById(listId);
    el.innerHTML = "";
    if (goals.length === 0) {
      el.innerHTML = `<p class="font-schoolbell" style="color:#666;margin:0;font-size:13px;">No goals yet.</p>`;
      return;
    }
    goals.forEach((g, idx) => {
      const label = document.createElement("label");
      label.className = "goal-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = false;
      cb.addEventListener("change", () => {
        if (cb.checked) {
          const updated = getGoals();
          updated.splice(idx, 1);
          addStars(10);
          saveGoals(updated);
        }
      });
      const span = document.createElement("span");
      span.textContent = `${idx + 1}. ${g.text}`;
      label.append(cb, span);
      el.appendChild(label);
    });
  });
}

document.getElementById("toggle-goal-form").addEventListener("click", () => {
  const f = document.getElementById("home-goal-form");
  f.hidden = !f.hidden;
  if (!f.hidden) document.getElementById("home-goal-input").focus();
});

document.getElementById("home-goal-form").addEventListener("submit", e => {
  e.preventDefault();
  const inp = document.getElementById("home-goal-input");
  if (!inp.value.trim()) return;
  const goals = getGoals();
  goals.push({ text: inp.value.trim(), done: false });
  inp.value = "";
  saveGoals(goals);
});

document.getElementById("settings-add-goal-btn").addEventListener("click", () => {
  const text = prompt("Enter a new productivity goal:");
  if (text && text.trim()) {
    const goals = getGoals();
    goals.push({ text: text.trim(), done: false });
    saveGoals(goals);
  }
});

/* =========================================================
   6. TASKS PAGE LOGIC
   ========================================================= */
let currentTaskFilter = "all";

document.querySelectorAll(".filter-pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentTaskFilter = btn.dataset.filter;
    renderTasksPage();
  });
});

document.getElementById("task-search-input").addEventListener("input", renderTasksPage);

function populateTaskSubjectDropdown(selectedValue = "") {
  const user = getCurrentAccount();
  const subjSelect = document.getElementById("task-subject-input");
  subjSelect.innerHTML = "";
  (user?.subjects || ["General"]).forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    subjSelect.appendChild(opt);
  });
  if (selectedValue) subjSelect.value = selectedValue;
}

function openTaskForm(taskToEdit = null) {
  populateTaskSubjectDropdown(taskToEdit ? taskToEdit.subject : "");

  if (taskToEdit) {
    document.getElementById("task-form-title").textContent = "Edit Task";
    document.getElementById("save-task-submit-btn").textContent = "Update Task";
    document.getElementById("task-edit-id").value = taskToEdit.id;
    document.getElementById("task-title-input").value = taskToEdit.title;
    document.getElementById("task-type-input").value = taskToEdit.type;
    document.getElementById("task-date-input").value = taskToEdit.date || "";
    document.getElementById("task-duration-num").value = taskToEdit.durationNum || "";
    document.getElementById("task-duration-unit").value = taskToEdit.durationUnit || "minutes";
    document.getElementById("task-priority-input").value = taskToEdit.priority || "none";
    document.getElementById("task-desc-input").value = taskToEdit.description || "";
  } else {
    document.getElementById("task-form-title").textContent = "Create New Task";
    document.getElementById("save-task-submit-btn").textContent = "Save Task";
    document.getElementById("task-edit-id").value = "";
    document.getElementById("task-creator-form").reset();
  }

  document.getElementById("task-creator-form").hidden = false;
  document.getElementById("task-title-input").focus();
}

document.getElementById("open-add-task-modal").addEventListener("click", () => openTaskForm(null));

document.getElementById("cancel-task-form").addEventListener("click", () => {
  document.getElementById("task-edit-id").value = "";
  document.getElementById("task-creator-form").reset();
  document.getElementById("task-creator-form").hidden = true;
});

document.getElementById("task-creator-form").addEventListener("submit", e => {
  e.preventDefault();
  const tasks = getTasks();
  const editId = document.getElementById("task-edit-id").value;

  const numVal = document.getElementById("task-duration-num").value.trim();
  const unitVal = document.getElementById("task-duration-unit").value;
  const formattedDuration = numVal ? `${numVal} ${unitVal}` : "";

  const payload = {
    title: document.getElementById("task-title-input").value.trim(),
    subject: document.getElementById("task-subject-input").value,
    type: document.getElementById("task-type-input").value,
    date: document.getElementById("task-date-input").value,
    durationNum: numVal,
    durationUnit: unitVal,
    duration: formattedDuration,
    priority: document.getElementById("task-priority-input").value,
    description: document.getElementById("task-desc-input").value.trim()
  };

  if (editId) {
    const idx = tasks.findIndex(t => String(t.id) === String(editId));
    if (idx !== -1) tasks[idx] = { ...tasks[idx], ...payload };
  } else {
    tasks.push({ id: Date.now(), ...payload, completed: false });
  }

  document.getElementById("task-edit-id").value = "";
  e.target.reset();
  e.target.hidden = true;
  saveTasks(tasks);
});

function renderTasksPage() {
  const tasks = getTasks();
  const query = document.getElementById("task-search-input").value.trim().toLowerCase();

  const todayStr = new Date().toISOString().split("T")[0];
  document.getElementById("qv-all").textContent = tasks.filter(t => !t.completed).length;
  document.getElementById("qv-priority").textContent = tasks.filter(t => t.priority === "high" && !t.completed).length;
  document.getElementById("qv-week").textContent = tasks.filter(t => !t.completed && t.date).length;
  document.getElementById("qv-overdue").textContent = tasks.filter(t => !t.completed && t.date && t.date < todayStr).length;

  const subjMap = {};
  tasks.forEach(t => {
    if (!subjMap[t.subject]) subjMap[t.subject] = { total: 0, done: 0 };
    subjMap[t.subject].total++;
    if (t.completed) subjMap[t.subject].done++;
  });
  const subjList = document.getElementById("subject-breakdown-list");
  subjList.innerHTML = "";
  if (Object.keys(subjMap).length === 0) {
    subjList.innerHTML = `<p style="color:#666;margin:0;font-size:13px;">No subjects yet</p>`;
  } else {
    Object.entries(subjMap).forEach(([subj, data]) => {
      const row = document.createElement("div");
      row.className = "q-row";
      row.innerHTML = `<span>${subj}</span><strong>${data.done}/${data.total}</strong>`;
      subjList.appendChild(row);
    });
  }

  const filtered = tasks.filter(t => {
    if (currentTaskFilter === "completed") return t.completed;
    if (t.completed) return false;
    if (query) {
      const hay = `${t.title} ${t.subject} ${t.description || ""}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const feed = document.getElementById("tasks-grouped-container");
  feed.innerHTML = "";
  if (filtered.length === 0) {
    feed.innerHTML = `<p class="font-schoolbell" style="text-align:center;color:#555;padding:20px;">No tasks yet.</p>`;
    return;
  }

  filtered.forEach(task => {
    const prio = task.priority || "none";
    const prioBadge = prio !== "none" ? `<span class="priority-badge ${prio}">${prio} priority</span>` : "";
    const starValue = getTaskStarReward(task);

    const metaParts = [];
    if (task.duration) metaParts.push(`🕒 ${task.duration}`);
    if (task.date) metaParts.push(`📅 ${task.date}`);
    const metaHtml = metaParts.length ? `<small class="font-schoolbell"> • ${metaParts.join(" • ")}</small>` : "";
    const descHtml = task.description ? `<p class="task-card-desc">${task.description}</p>` : "";

    const card = document.createElement("div");
    card.className = "task-item-card" + (task.completed ? " completed-card" : "");
    card.innerHTML = `
      <div class="task-item-left">
        <button type="button" class="task-check-circle">${task.completed ? "✓" : ""}</button>
        <div>
          <strong>${task.title}</strong> ${prioBadge}<br>
          <span class="subject-pill">${task.subject}</span>
          <span class="type-pill">${task.type}</span>
          ${metaHtml}
          ${descHtml}
        </div>
      </div>
      <div class="task-item-right">
        <span class="font-railey">+${starValue} ★</span>
        <button type="button" class="edit-task-btn" title="Edit task">✎ Edit</button>
        <button type="button" class="delete-task-btn" title="Delete">✕</button>
      </div>
    `;

    card.querySelector(".task-check-circle").addEventListener("click", () => {
      const all = getTasks();
      const target = all.find(x => x.id === task.id);
      target.completed = !target.completed;
      if (target.completed) addStars(getTaskStarReward(target));
      saveTasks(all);
    });

    card.querySelector(".edit-task-btn").addEventListener("click", () => openTaskForm(task));

    card.querySelector(".delete-task-btn").addEventListener("click", () => {
      saveTasks(getTasks().filter(x => x.id !== task.id));
    });

    feed.appendChild(card);
  });
}

/* =========================================================
   7. FOCUS PAGE (POMODORO CAROUSEL & AUTO CYCLE)
   ========================================================= */
const pomoModes = {
  short: { label: "Short Break", presets: [2, 5], defaultMins: 5 },
  focus: { label: "Focus",       presets: [15, 25, 45, 60], defaultMins: 25 },
  long:  { label: "Long Break",  presets: [10, 15], defaultMins: 15 }
};

const carouselOrder = ["short", "focus", "long"];
const cycleSequence = ["focus", "short", "focus", "short", "focus", "long"];
let cycleStep = 0;

let currentPomoMode = "focus";
let selectedMinutes = 25;
let timerSeconds = 25 * 60;
let timerInterval = null;

function updateClockDisplay() {
  const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const secs = String(timerSeconds % 60).padStart(2, "0");
  document.getElementById("timer-display").textContent = `${mins}:${secs}`;
}

function setTimerMinutes(mins) {
  clearInterval(timerInterval);
  timerInterval = null;
  selectedMinutes = mins;
  document.getElementById("timer-start-pause-btn").textContent = "▶";
  timerSeconds = mins * 60;
  updateClockDisplay();
}

function renderPomoCarousel() {
  const cfg = pomoModes[currentPomoMode];
  document.getElementById("pomo-mode-title").textContent = cfg.label;
  document.getElementById("clock-mode-label").textContent = cfg.label;

  document.querySelectorAll(".mode-dot").forEach(dot => {
    dot.classList.toggle("active", dot.dataset.mode === currentPomoMode);
  });

  const presetsContainer = document.getElementById("preset-circles");
  presetsContainer.innerHTML = "";
  cfg.presets.forEach(mins => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "preset-btn" + (mins === selectedMinutes ? " active" : "");
    btn.textContent = `${mins}m`;
    btn.addEventListener("click", () => {
      presetsContainer.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setTimerMinutes(mins);
    });
    presetsContainer.appendChild(btn);
  });

  const nextStep = (cycleStep + 1) % cycleSequence.length;
  const nextLabel = pomoModes[cycleSequence[nextStep]].label;
  document.getElementById("cycle-indicator").textContent = `Current: ${cfg.label} → Next: ${nextLabel}`;
}

function switchPomoMode(mode, autoStart = false) {
  currentPomoMode = mode;
  selectedMinutes = pomoModes[mode].defaultMins;
  setTimerMinutes(selectedMinutes);
  renderPomoCarousel();
  if (autoStart) document.getElementById("timer-start-pause-btn").click();
}

document.getElementById("pomo-mode-prev").addEventListener("click", () => {
  const idx = (carouselOrder.indexOf(currentPomoMode) - 1 + carouselOrder.length) % carouselOrder.length;
  switchPomoMode(carouselOrder[idx]);
});

document.getElementById("pomo-mode-next").addEventListener("click", () => {
  const idx = (carouselOrder.indexOf(currentPomoMode) + 1) % carouselOrder.length;
  switchPomoMode(carouselOrder[idx]);
});

document.getElementById("set-custom-timer-btn").addEventListener("click", () => {
  const val = Number(document.getElementById("custom-mins-input").value);
  if (val >= 1 && val <= 180) {
    document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
    setTimerMinutes(val);
  }
});

function advancePomodoroCycle(autoStart = false) {
  if (currentPomoMode === "focus") {
    const stats = getUserStats();
    stats.sessionsToday += 1;
    stats.focusMinutesToday += selectedMinutes;
    stats.stars += 15;
    if (stats.streak === 0) stats.streak = 1;
    saveUserStats(stats);
  }
  cycleStep = (cycleStep + 1) % cycleSequence.length;
  switchPomoMode(cycleSequence[cycleStep], autoStart);
}

document.getElementById("skip-stage-btn").addEventListener("click", () => {
  cycleStep = (cycleStep + 1) % cycleSequence.length;
  switchPomoMode(cycleSequence[cycleStep], false);
});

document.getElementById("timer-start-pause-btn").addEventListener("click", e => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    e.target.textContent = "▶";
  } else {
    e.target.textContent = "❚❚";
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateClockDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        e.target.textContent = "▶";
        advancePomodoroCycle(true);
      }
    }, 1000);
  }
});

document.getElementById("timer-reset-btn").addEventListener("click", () => setTimerMinutes(selectedMinutes));

function renderFocusPage() {
  const tasks = getTasks().filter(t => !t.completed);
  const select = document.getElementById("focus-task-select");
  const sched = document.getElementById("focus-schedule-list");
  select.innerHTML = "";
  sched.innerHTML = "";

  if (tasks.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "Free Focus Session";
    select.appendChild(opt);
    sched.innerHTML = `<p style="color:#666;margin:0;">No tasks scheduled yet</p>`;
    document.getElementById("focus-task-meta").textContent = "Add tasks to schedule focus blocks";
    return;
  }

  tasks.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.title} (${t.subject})`;
    select.appendChild(opt);

    const line = document.createElement("div");
    line.textContent = `• ${t.title} — ${t.subject}${t.duration ? " (" + t.duration + ")" : ""}`;
    sched.appendChild(line);
  });

  document.getElementById("focus-task-meta").textContent = `${tasks[0].subject}${tasks[0].duration ? " • " + tasks[0].duration : ""}`;
}

/* =========================================================
   8. INTERESTS, COLLECTIBLES & POMODORO BACKGROUNDS (.JPG)
   ========================================================= */
const interestIcons = {
  Arts: "🎨", Music: "🎵", Dance: "💃", Sports: "🏀",
  Books: "📚", Movies: "🎬", Gaming: "🎮", Space: "🪐",
  Science: "🔬", Math: "📐", Animals: "🐾", Food: "🍕"
};

const interestCollectibleImages = {
  Default: "images/collectibles/defaultc.jpg",
  Arts:    "images/collectibles/art.jpg",
  Music:   "images/collectibles/music.jpg",
  Dance:   "images/collectibles/dance.jpg",
  Sports:  "images/collectibles/sports1.jpg",
  Books:   "images/collectibles/books.jpg",
  Movies:  "images/collectibles/movies.jpg",
  Gaming:  "images/collectibles/gaming.jpg",
  Space:   "images/collectibles/space.jpg",
  Science: "images/collectibles/science.jpg",
  Math:    "images/collectibles/math.jpg",
  Animals: "images/collectibles/animals.jpg",
  Food:    "images/collectibles/food.jpg"
};

function getSelectedInterests() {
  return JSON.parse(localStorage.getItem(userKey("interests"))) || [];
}

function getInterestEffects() {
  return JSON.parse(localStorage.getItem(userKey("interestEffects"))) || {
    collectibles: true,
    backgrounds: true
  };
}

function renderDefaultAtomFallback(container) {
  container.innerHTML = `
    <div class="atom-graphic">
      <span class="orbit o1"></span>
      <span class="orbit o2"></span>
      <span class="orbit o3"></span>
      <span class="nucleus"></span>
    </div>`;
}

function applyInterestsAndEffects() {
  const interests = getSelectedInterests();
  const effects = getInterestEffects();
  const stats = getUserStats();
  const { puzzleIndex } = getPuzzleProgress(stats.stars);

  // Rotate through selected interests each time a 9-tile puzzle is completed
  const activeInterest = interests.length > 0
    ? interests[puzzleIndex % interests.length]
    : null;

  const greetIcon = document.getElementById("interest-greeting-icon");
  const pomoIcon = document.getElementById("qa-pomo-icon");
  if (greetIcon) greetIcon.textContent = "";
  if (pomoIcon) pomoIcon.textContent = "🕒";

  const artBox = document.getElementById("collectible-artwork");
  if (!artBox) return;

  const chosenKey = (effects.collectibles && activeInterest && interestCollectibleImages[activeInterest])
    ? activeInterest
    : "Default";

  const primarySrc = interestCollectibleImages[chosenKey];
  const upperJpgSrc = primarySrc.replace(/\.jpg$/i, ".JPG");
  const jpegSrc = primarySrc.replace(/\.jpg$/i, ".jpeg");

  const candidates = [primarySrc, upperJpgSrc, jpegSrc];

  let attempt = 0;
  const img = document.createElement("img");
  img.alt = `${chosenKey} collectible`;
  img.className = "collectible-img";

  img.onerror = () => {
    attempt++;
    if (attempt < candidates.length) {
      img.src = candidates[attempt];
    } else if (effects.collectibles && activeInterest && interestIcons[activeInterest]) {
      artBox.innerHTML = `<span class="interest-emblem">${interestIcons[activeInterest]}</span>`;
    } else {
      renderDefaultAtomFallback(artBox);
    }
  };

  img.src = candidates[0];
  artBox.innerHTML = "";
  artBox.appendChild(img);
}

function loadInterestsAndEffects() {
  const savedInterests = getSelectedInterests();
  document.querySelectorAll("#interests-checkboxes input[type='checkbox']").forEach(cb => {
    cb.checked = savedInterests.includes(cb.value);
  });

  const effects = getInterestEffects();
  document.getElementById("effect-collectibles").checked = effects.collectibles;
  document.getElementById("effect-backgrounds").checked = effects.backgrounds;

  applyInterestsAndEffects();
}

document.querySelectorAll("#interests-checkboxes input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", () => {
    const selected = [...document.querySelectorAll("#interests-checkboxes input:checked")].map(x => x.value);
    localStorage.setItem(userKey("interests"), JSON.stringify(selected));
    applyInterestsAndEffects();
  });
});

["effect-collectibles", "effect-backgrounds"].forEach(id => {
  document.getElementById(id).addEventListener("change", () => {
    const effects = {
      collectibles: document.getElementById("effect-collectibles").checked,
      backgrounds: document.getElementById("effect-backgrounds").checked
    };
    localStorage.setItem(userKey("interestEffects"), JSON.stringify(effects));
    applyInterestsAndEffects();
    applyTheme(localStorage.getItem(userKey("theme")) || "Default");
  });
});

const themePalettes = {
  "Default":       { primary: "#2A4F8D", secondary: "#86AADF", tertiary: "#DDEDFB", pomoFile: "default" },
  "Ember":         { primary: "#A8302B", secondary: "#F30B01", tertiary: "#F46A62", pomoFile: "ember" },
  "Sunset":        { primary: "#FF904E", secondary: "#F5B738", tertiary: "#FFDB92", pomoFile: "sunset" },
  "Nature":        { primary: "#344740", secondary: "#8EAC6A", tertiary: "#DAE6C8", pomoFile: "nature" },
  "Galaxy":        { primary: "#471AA1", secondary: "#A168C8", tertiary: "#BEA8DE", pomoFile: "galaxy" },
  "Y2K":           { primary: "#FF0091", secondary: "#FF66C4", tertiary: "linear-gradient(135deg, #AFAFAF, #F6F6F6)", pomoFile: "y2k" },
  "Black & White": { primary: "#000000", secondary: "#A6A6A6", tertiary: "#FFFFFF", pomoFile: "bw" }
};

/* Resolves case/extension variations (.jpg, .JPG, .jpeg, capitalized) for Pomodoro backgrounds */
function setResolvedPomodoroBg(fileSlug) {
  if (!fileSlug) {
    document.documentElement.style.setProperty("--pomo-bg-image", "none");
    return;
  }

  const cap = fileSlug.charAt(0).toUpperCase() + fileSlug.slice(1);
  const candidates = [
    `images/pomodoro/${fileSlug}.jpg`,
    `images/pomodoro/${cap}.jpg`,
    `images/pomodoro/${fileSlug}.JPG`,
    `images/pomodoro/${fileSlug}.jpeg`,
    `images/pomodoro/${fileSlug}.png`,
    `images/pomodoro/default.jpg`
  ];

  let idx = 0;
  const probe = new Image();
  probe.onload = () => {
    document.documentElement.style.setProperty("--pomo-bg-image", `url('${candidates[idx]}')`);
  };
  probe.onerror = () => {
    idx++;
    if (idx < candidates.length) {
      probe.src = candidates[idx];
    } else {
      document.documentElement.style.setProperty("--pomo-bg-image", "none");
    }
  };
  probe.src = candidates[0];
}

function getCustomPalette() {
  return JSON.parse(localStorage.getItem(userKey("customPalette"))) || {
    primary: "#2A4F8D",
    secondary: "#86AADF",
    tertiary: "#DDEDFB",
    pomoFile: "default"
  };
}

function applyTheme(name) {
  let p = themePalettes[name];
  const customBox = document.getElementById("custom-theme-controls");

  if (name === "Custom") {
    p = getCustomPalette();
    customBox.hidden = false;
    document.getElementById("custom-primary").value = p.primary;
    document.getElementById("custom-secondary").value = p.secondary;
    document.getElementById("custom-tertiary").value = p.tertiary;
    document.getElementById("swatch-custom-1").style.background = p.primary;
    document.getElementById("swatch-custom-2").style.background = p.secondary;
    document.getElementById("swatch-custom-3").style.background = p.tertiary;

    document.documentElement.style.setProperty("--primary", p.primary);
    document.documentElement.style.setProperty("--secondary", p.tertiary);
    document.documentElement.style.setProperty("--tertiary", p.secondary);
  } else {
    customBox.hidden = true;
    if (!p) {
      name = "Default";
      p = themePalettes["Default"];
    }

    document.documentElement.style.setProperty("--primary", p.primary);
    document.documentElement.style.setProperty("--secondary", p.secondary);
    document.documentElement.style.setProperty("--tertiary", p.tertiary);
  }

  const effects = getInterestEffects();
  const customPomoBg = localStorage.getItem(userKey("customPomoBg"));
  const resetBtn = document.getElementById("pomo-bg-reset");

  if (customPomoBg) {
    document.documentElement.style.setProperty("--pomo-bg-image", `url('${customPomoBg}')`);
    if (resetBtn) resetBtn.hidden = false;
  } else {
    if (resetBtn) resetBtn.hidden = true;
    setResolvedPomodoroBg(effects.backgrounds ? (p.pomoFile || "default") : null);
  }

  document.getElementById("active-theme-label").textContent = name;
  localStorage.setItem(userKey("theme"), name);

  document.querySelectorAll(".theme-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === name);
  });
}

document.getElementById("pomo-bg-upload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      localStorage.setItem(userKey("customPomoBg"), ev.target.result);
      applyTheme(localStorage.getItem(userKey("theme")) || "Default");
    } catch (err) {
      alert("That image is too large to save in browser storage. Try a smaller image file.");
    }
  };
  reader.readAsDataURL(file);
});

document.getElementById("pomo-bg-reset").addEventListener("click", () => {
  localStorage.removeItem(userKey("customPomoBg"));
  document.getElementById("pomo-bg-upload").value = "";
  applyTheme(localStorage.getItem(userKey("theme")) || "Default");
});

document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
});

["custom-primary", "custom-secondary", "custom-tertiary"].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    const custom = {
      primary: document.getElementById("custom-primary").value,
      secondary: document.getElementById("custom-secondary").value,
      tertiary: document.getElementById("custom-tertiary").value,
      pomoFile: "default"
    };
    localStorage.setItem(userKey("customPalette"), JSON.stringify(custom));
    applyTheme("Custom");
  });
});

document.getElementById("profile-edit-form").addEventListener("submit", e => {
  e.preventDefault();
  const accounts = getAccounts();
  const email = sessionStorage.getItem("sidekickCurrentUser");
  const idx = accounts.findIndex(a => a.email === email);
  if (idx !== -1) {
    accounts[idx].firstName = document.getElementById("edit-first-name").value.trim() || accounts[idx].firstName;
    accounts[idx].lastName = document.getElementById("edit-last-name").value.trim();
    accounts[idx].grade = document.getElementById("edit-grade").value;
    localStorage.setItem("sidekickAccounts", JSON.stringify(accounts));
    initPlanner();
    alert("Profile updated!");
  }
});

function renderSettingsSubjects() {
  const user = getCurrentAccount();
  const list = document.getElementById("settings-subjects-list");
  list.innerHTML = "";
  (user?.subjects || []).forEach((s, i) => {
    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${s}`;
    list.appendChild(div);
  });
}

document.getElementById("settings-add-subject-btn").addEventListener("click", () => {
  const f = document.getElementById("settings-subject-form");
  f.hidden = !f.hidden;
});

document.getElementById("settings-subject-form").addEventListener("submit", e => {
  e.preventDefault();
  const inp = document.getElementById("settings-new-subject");
  if (!inp.value.trim()) return;
  const accounts = getAccounts();
  const email = sessionStorage.getItem("sidekickCurrentUser");
  const user = accounts.find(a => a.email === email);
  if (user) {
    user.subjects.push(inp.value.trim());
    localStorage.setItem("sidekickAccounts", JSON.stringify(accounts));
    inp.value = "";
    renderSettingsSubjects();
  }
});

document.getElementById("toggle-stars-reward").addEventListener("change", e => {
  document.getElementById("nav-stars-pill").hidden = !e.target.checked;
  document.getElementById("home-stars-card").hidden = !e.target.checked;
});
document.getElementById("toggle-streak-reward").addEventListener("change", e => {
  document.getElementById("nav-streak-pill").hidden = !e.target.checked;
  document.getElementById("home-streak-card").hidden = !e.target.checked;
});
document.getElementById("toggle-collectibles-reward").addEventListener("change", e => {
  document.getElementById("home-collectibles-card").hidden = !e.target.checked;
});

document.querySelectorAll("[data-rename-target]").forEach(input => {
  input.addEventListener("input", () => {
    const target = input.dataset.renameTarget;
    document.querySelectorAll(`[data-section-label="${target}"]`).forEach(el => {
      el.textContent = input.value || target;
    });
  });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("sidekickCurrentUser");
  showScreen("auth-page");
});

/* =========================================================
   9. BOOT
   ========================================================= */
const activeEmail = sessionStorage.getItem("sidekickCurrentUser");
if (activeEmail && getAccounts().some(a => a.email === activeEmail)) {
  showScreen("app-shell");
} else {
  sessionStorage.removeItem("sidekickCurrentUser");
  showScreen("auth-page");
}