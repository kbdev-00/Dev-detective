
# 🕵️ Dev Detective – GitHub Developer Battle App

Dev Detective is a frontend web application built as part of **Week 3 – The API Hunter**
under the **Prodesk IT Internship Program**.

The application connects to the **real GitHub API** to fetch developer profile data,
display repository information, and compare two developers in a **Battle Mode**.

---

## 🚀 Project Objective

The goal of this project is to:
- Learn how frontend applications communicate with servers using APIs
- Understand asynchronous JavaScript (`fetch`, `async/await`, `Promise.all`)
- Handle real-world API errors and loading states
- Process and compare live data logically

---

## 🛠️ Tech Stack

- **HTML5** – Structure
- **CSS3** – Styling & responsive UI
- **JavaScript (ES6)** – Logic & API handling
- **GitHub REST API** – Live developer data

---

## ✨ Features

### 🔍 GitHub User Search
- Search any GitHub user by username
- Fetches real-time profile data from GitHub

### 👤 Profile Information Display
Each profile card shows:
- Avatar Image
- Name & Username
- Bio
- Join Date (formatted)
- Portfolio / Website URL
- Followers count
- Total Stars (calculated from repositories)

---

### 📦 Repository Deep Dive (Level 2)
- Fetches repositories using `repos_url`
- Displays **Top 5 latest repositories**
- Repository names are clickable
- Dates are formatted to human-readable format

---

### ⚔️ Battle Mode (Level 3)
- Compare **two GitHub developers simultaneously**
- Uses `Promise.all()` for parallel API calls
- Compares developers based on **total stars**
- Highlights:
  - 🟢 Winner (Green)
  - 🔴 Loser (Red)

---

### 💬 Motivational Feedback
- Random motivational quote for the winner
- Encouraging message for the loser
- New message appears on every battle

---

### ⏳ Loading & Error Handling
- Displays loading spinner/text while fetching data
- Shows a user-friendly message if:
  - Username does not exist (404)
  - Invalid input is provided
- Application never crashes on errors

---

### 🔗 Extra Enhancements
- Random sample usernames button
- Share result summary (clipboard copy)
- Clean UI with responsive layout

---

## 📁 Project Structure

