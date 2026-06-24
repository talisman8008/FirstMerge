# FirstMerge: Comprehensive Feature Breakdown

This document contains the complete, highly detailed architectural breakdown of **FirstMerge**. It includes exact algorithmic calculations, fail-safes, and technical minutiae to help you write accurate SaaS video scripts, pitch decks, and presentations.

## 🎯 Core Value Proposition
FirstMerge is an AI-powered open-source contribution companion. It solves the biggest pain point for beginner and intermediate developers: finding open-source issues that are *actually* beginner-friendly, and ensuring their Pull Requests (PRs) get merged instead of rejected or ignored.

---

## 1. The "Friendliness Score" Engine (Explore Page)
The core differentiation of FirstMerge. Instead of just filtering by the generic `good first issue` label, FirstMerge calculates a precise 0–100 proprietary "Friendliness Score" for repositories using real-time GitHub data.

### The Algorithm Breakdown (Base 100 Points):
1. **PR Collision Count (Max 35 pts — Highest Weight)**
   * *What it measures:* How many Open PRs already exist for a specific issue. Prevents developers from wasting time on an issue someone else already solved.
   * `0 open PRs` = 35 pts
   * `1 open PR` = 25 pts
   * `2 open PRs` = 15 pts
   * `3-5 open PRs` = 5 pts
   * `> 5 open PRs` = 0 pts

2. **Beginner PR Merge Rate (Max 30 pts)**
   * *What it measures:* The proportion of the last 50 closed PRs in the repository that were actually merged (vs closed without merging).
   * `> 60% merged` = 30 pts
   * `> 40% merged` = 22 pts
   * `> 20% merged` = 14 pts
   * `< 20% merged` = 5 pts

3. **Maintainer Response Time (Max 20 pts)**
   * *What it measures:* The average hours taken from an issue being opened to it being closed (based on the last 20 closed issues).
   * `< 24 hours` = 20 pts
   * `< 72 hours` (3 days) = 16 pts
   * `< 168 hours` (1 week) = 12 pts
   * `< 336 hours` (2 weeks) = 8 pts
   * `> 336 hours` = 4 pts

4. **Issue Freshness (Max 15 pts)**
   * *What it measures:* How long ago the specific issue was opened. Older issues are more likely to be stale or irrelevant.
   * `< 7 days old` = 15 pts
   * `< 30 days old` = 12 pts
   * `< 90 days old` = 8 pts
   * `< 180 days old` = 4 pts
   * `> 180 days old` = 0 pts

### The Penalty Multipliers:
After calculating the base score, the system applies strict penalties to filter out toxic, massive, or abandoned repositories:
* **Abandoned Project Penalty:** If the repository hasn't had a commit pushed in over 180 days, the maximum possible score is hard-capped at **20/100**.
* **Dead PR Pipeline Penalty:** If the repo hasn't merged a *single* PR in the last 90 days, the maximum possible score is hard-capped at **40/100**.
* **No-Traction Penalty:** If the repo has fewer than 10 stars, the score is capped at **30/100**. If it has between 10-49 stars, it receives a flat **-10 point** deduction.
* **Overwhelmed Maintainer Penalty:** If the repository has over 500 open issues, it receives a flat **-15 point** deduction, assuming maintainers are too busy to review beginner code.

### Performance & Fail-safes:
* **2-Hour Caching:** To prevent GitHub API rate-limiting, scores are aggressively cached in Supabase for exactly 2 hours (`CACHE_TTL_MS = 7200000`).
* **Graceful Degradation:** If the GitHub API fails or returns empty data for a specific metric (e.g., a repo has no closed PRs yet), the algorithm does not crash. It assigns safe fallback points (e.g., 10 pts for response time, 15 pts for merge rate) and flags `fallbacks_used` in the API response.

---

## 2. AI-Powered PR Quality Check (The "Brain")
Powered by Google Gemini, FirstMerge acts as an automated senior engineer reviewing code *before* the maintainers do. 

### How the Data Pipeline Works:
When a PR URL is submitted, the backend fetches three critical pieces of context:
1. **The Code Diff:** Exactly what code was added/removed.
2. **The Original Issue Body:** To verify if the code actually solves the requested problem.
3. **The CONTRIBUTING.md file:** To enforce the repository's strict internal guidelines (e.g., "Must use Prettier", "Must add unit tests").

### The Verdict Output:
The AI is strictly prompted to output a JSON object containing:
* **Verdict:** 
  * `GENUINE`: The code is solid, relevant, and ready.
  * `TRIVIAL`: The code is spam (e.g., adding a single whitespace), incorrect, or misses the point of the issue.
* **Reason:** A human-readable paragraph explaining exactly *why* the AI gave its verdict.
* **Suggestion:** Actionable next steps in a sleek monospace terminal-style UI (e.g., "Add a unit test for the null edge case in line 42").

---

## 3. AI-Powered Issue Roadmap (The "Navigator")
Once a developer finds a friendly issue, FirstMerge doesn't just leave them to figure it out alone. It dynamically generates a tailored, step-by-step implementation plan using Google Gemini before they write a single line of code.

### The Breakdown:
* **Objective:** A clear, human-readable summary of what needs to be built.
* **Estimates:** AI-predicted Time and Complexity estimates so the developer knows what they're signing up for.
* **Target Files:** Precisely identifies which files in the repository need to be modified.
* **Constraints & Risks:** Explicitly states what to *avoid* doing, preventing common beginner mistakes that lead to PR rejection.
* **Execution Steps:** A sequential, step-by-step execution plan rendered beautifully in a custom `ScrollStack` 3D scrolling interface.

---

## 4. The Chrome Extension (Seamless Integration)
The absolute "wow factor" for a SaaS demo. FirstMerge integrates directly into the developer's natural habitat: GitHub.

* **Zero-Click Auto-Analysis**: The moment a user navigates to a Pull Request on `github.com/*/pull/*`, the extension's `content.js` script automatically kicks in. No manual buttons required.
* **SPA Navigation Support:** GitHub is a Single Page Application (SPA). The extension uses a `MutationObserver` on the DOM to detect when a user clicks around the site (e.g., from a code tab to a PR tab) and triggers the analysis without requiring a full page refresh.
* **Native UI Injection**: Injects a beautiful, dark-mode FirstMerge dashboard directly into the GitHub PR discussion timeline, precisely above the first comment. 
* **Seamless CTA Loop**: The extension UI includes an "Explore More Issues →" button that instantly redirects the user back to the FirstMerge web app, creating a perfect retention loop.

---

## 5. Gamification & Contribution Tracking (Dashboard)
FirstMerge keeps developers motivated to contribute consistently by turning open-source into a game.

* **GitHub OAuth Authentication**: Frictionless login using their existing GitHub account via Supabase Auth.
* **The Contribution Heatmap**: A visual contribution graph (similar to GitHub's commit graph) that explicitly tracks *merged* PRs facilitated by FirstMerge.
* **Streak Tracking & Medals**: Tracks consecutive days/weeks of contributions and rewards the user with visually stunning 3D-style badges (with glowing neon rings and hover animations).
  * **Bronze Medal:** 7-Day Streak
  * **Silver Medal:** 21-Day Streak
  * **Gold Medal:** 50-Day Streak

---

## 6. Premium UI/UX & Design System
The application is designed to feel like a premium, state-of-the-art SaaS product.

* **Dark Mode Native**: A curated dark palette (`#17151F` backgrounds, `#211F2E` cards) that feels easy on the eyes for developers.
* **Micro-animations**: Elements slide in using `IntersectionObserver` fade-ins. Buttons have a tactile `scale(0.97)` click effect and hover opacity transitions.
* **Typography**: Modern, technical typography using `DM Sans` for readable body text and `Space Mono` for strict, code-like accents and labels.
* **No Box-Shadows**: A strict flat-design architecture utilizing vibrant border highlights instead of blurry drop shadows for a hyper-modern look.

---

## 🎬 Suggested Video Script Flow (For SaaS Demo)

1. **The Hook (0:00 - 0:10)**: 
   * *Visual*: Scroll through the landing page. "You've been contributing to open source wrong." 
   * *Voiceover*: "Finding a 'good first issue' is a nightmare. It's either abandoned, or 10 people are already working on it."
2. **The Algorithm (0:10 - 0:30)**: 
   * *Visual*: Open the Explore Page. Zoom in on the Friendliness Score loading bars filling up. 
   * *Voiceover*: "Enter FirstMerge. We don't just look for labels. Our engine calculates a precise 0-to-100 score by analyzing maintainer response times, beginner merge rates, and PR collision counts. If a repo is toxic or abandoned, we hide it."
3. **The 'Wow' Moment (0:30 - 0:45)**: 
   * *Visual*: Switch to a GitHub PR page. The user does absolutely nothing, but the FirstMerge extension automatically slides into the GitHub UI. It glows green with a "GENUINE" verdict.
   * *Voiceover*: "And when you submit your PR? Our Chrome Extension automatically reads the CONTRIBUTING.md, analyzes your code diff, and acts as a senior engineer to ensure your code gets merged, right inside GitHub."
4. **The Retention/Outro (0:45 - 1:00)**: 
   * *Visual*: Show the Dashboard heatmap and the 50-day streak Gold Medal. Click "Explore More Issues" from the extension to loop back to the app.
   * *Voiceover*: "Track your streaks, earn medals, and build an open-source portfolio that actually matters. FirstMerge."
