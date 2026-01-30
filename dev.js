// ===============================
// DOM ELEMENTS
// ===============================
const btn = document.getElementById("battleBtn");
const user1Input = document.getElementById("user1");
const user2Input = document.getElementById("user2");

const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const loading = document.getElementById("loading");

// Extra UI
const randomBtn = document.getElementById("randomBtn");
const shareBtn = document.getElementById("shareBtn");
const toast = document.getElementById("toast");

// ===============================
// EVENT LISTENERS
// ===============================
btn.addEventListener("click", () => {
  const user1 = user1Input.value.trim();
  const user2 = user2Input.value.trim();

  if (!user1 || !user2) {
    alert("Please enter both usernames");
    return;
  }

  startBattle(user1, user2);
});

// ===============================
// MAIN BATTLE FUNCTION
// ===============================
async function startBattle(user1, user2) {
  loading.classList.remove("hidden");
  card1.innerHTML = "";
  card2.innerHTML = "";

  try {
    const [res1, res2] = await Promise.all([
      fetch(`https://api.github.com/users/${user1}`),
      fetch(`https://api.github.com/users/${user2}`)
    ]);

    if (!res1.ok || !res2.ok) {
      throw new Error("User not found");
    }

    const data1 = await res1.json();
    const data2 = await res2.json();

    const stars1 = await getTotalStars(data1.repos_url);
    const stars2 = await getTotalStars(data2.repos_url);

    showResult(data1, stars1, data2, stars2);

  } catch (error) {
    showToast("❌ User Not Found. Please check the username.");
  } finally {
    loading.classList.add("hidden");
  }
}

// ===============================
// TOTAL STARS CALCULATION
// ===============================
async function getTotalStars(reposUrl) {
  const res = await fetch(reposUrl);
  const repos = await res.json();

  let totalStars = 0;
  repos.forEach(repo => {
    totalStars += repo.stargazers_count;
  });

  return totalStars;
}

// ===============================
// WINNER / LOSER RESULT + QUOTES
// ===============================
function showResult(user1, stars1, user2, stars2) {

  // Reset old classes
  card1.classList.remove("winner", "loser");
  card2.classList.remove("winner", "loser");

  const winnerQuote = getRandomQuote(winnerQuotes);
  const loserQuote = getRandomQuote(loserQuotes);

  card1.innerHTML = `
    <img src="${user1.avatar_url}" width="80">
    <h3>${user1.name || user1.login}</h3>
    <p class="username">@${user1.login}</p>
    <p class="bio">${user1.bio || "No bio available"}</p>
    <p>📅 Joined: ${new Date(user1.created_at).toDateString()}</p>
    <p>🔗 <a href="${user1.blog || '#'}" target="_blank">
      ${user1.blog ? "Portfolio" : "Not Available"}
    </a></p>
    <p>⭐ Stars: ${stars1}</p>
    <p>👥 Followers: ${user1.followers}</p>
  `;

  card2.innerHTML = `
    <img src="${user2.avatar_url}" width="80">
    <h3>${user2.name || user2.login}</h3>
    <p class="username">@${user2.login}</p>
    <p class="bio">${user2.bio || "No bio available"}</p>
    <p>📅 Joined: ${new Date(user2.created_at).toDateString()}</p>
    <p>🔗 <a href="${user2.blog || '#'}" target="_blank">
      ${user2.blog ? "Portfolio" : "Not Available"}
    </a></p>
    <p>⭐ Stars: ${stars2}</p>
    <p>👥 Followers: ${user2.followers}</p>
  `;

  // ===============================
  // 👉 ONLY ADDITION: TOP 5 REPOS
  // ===============================

  getTopRepos(user1.repos_url).then(repos1 => {
    let list1 = "<h4>Top 5 Latest Repositories</h4><ul>";
    repos1.forEach(repo => {
      list1 += `
        <li>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <span> (${formatDate(repo.created_at)})</span>
        </li>`;
    });
    list1 += "</ul>";
    card1.innerHTML += list1;
  });

  getTopRepos(user2.repos_url).then(repos2 => {
    let list2 = "<h4>Top 5 Latest Repositories</h4><ul>";
    repos2.forEach(repo => {
      list2 += `
        <li>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          <span> (${formatDate(repo.created_at)})</span>
        </li>`;
    });
    list2 += "</ul>";
    card2.innerHTML += list2;
  });

  // ===============================
  // WINNER / LOSER
  // ===============================
  if (stars1 > stars2) {
    card1.classList.add("winner");
    card2.classList.add("loser");

    card1.innerHTML += `<p class="quote">"${winnerQuote}"</p>`;
    card2.innerHTML += `<p class="quote">"${loserQuote}"</p>`;
  } else {
    card2.classList.add("winner");
    card1.classList.add("loser");

    card2.innerHTML += `<p class="quote">"${winnerQuote}"</p>`;
    card1.innerHTML += `<p class="quote">"${loserQuote}"</p>`;
  }
}

// ===============================
// RANDOM SAMPLE USERS
// ===============================
if (randomBtn) {
  const samples = [
    "gaearon",
    "torvalds",
    "addyosmani",
    "sindresorhus",
    "yyx990803",
    "rauchg"
  ];

  randomBtn.addEventListener("click", () => {
    const a = samples[Math.floor(Math.random() * samples.length)];
    let b = samples[Math.floor(Math.random() * samples.length)];
    while (b === a) {
      b = samples[Math.floor(Math.random() * samples.length)];
    }
    user1Input.value = a;
    user2Input.value = b;
  });
}

// ===============================
// SHARE RESULT
// ===============================
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    let text = '';

    const getTextFromCard = (card) => {
      if (!card || !card.innerText) return null;
      return card.innerText.replace(/\n+/g, ' | ').trim();
    };

    const t1 = getTextFromCard(card1);
    const t2 = getTextFromCard(card2);

    if (t1 && t2) {
      text = `Dev Detective Result: ${t1}  VS  ${t2}`;
    } else {
      text = 'Dev Detective: Compare GitHub developers by stars and followers.';
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied summary to clipboard");
    } catch {
      showToast("Copy failed");
    }
  });
}

// ===============================
// TOAST MESSAGE
// ===============================
function showToast(msg, ms = 2200) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.add("hidden"), ms);
}

// ===============================
// QUOTES DATA
// ===============================
const winnerQuotes = [
  "Hard work always pays off 💪",
  "Consistency beats talent every time 🔥",
  "Success is earned, not given 🏆",
  "Your dedication is showing 🚀",
  "Great things take time ⏳",
  "You’re on the right track 👏",
  "Winning is a habit 😎",
  "Skills + discipline = success 💡",
  "Keep pushing limits 🚀",
  "This is what effort looks like 🔥"
];

const loserQuotes = [
  "Don’t stop now, you’re learning 🌱",
  "Every loss is a lesson 📘",
  "Progress matters more than winning 💪",
  "Great developers are made by failures 🚀",
  "Keep coding, keep growing 👨‍💻",
  "Success starts with persistence 🔁",
  "You’re closer than you think ✨",
  "Hard times build strong skills 🧠",
  "Stay consistent, results will come ⏳",
  "Never compare journeys, only progress 🌟"
];

// ===============================
// RANDOM QUOTE FUNCTION
// ===============================
function getRandomQuote(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===============================
// DATE FORMATTER (TERA HI)
// ===============================
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// ===============================
// TOP REPOS FETCH (TERA HI)
// ===============================
async function getTopRepos(reposUrl) {
  const res = await fetch(reposUrl);
  const repos = await res.json();

  return repos
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
}
