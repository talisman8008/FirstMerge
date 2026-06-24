# FirstMerge — Brief Overview

## The Idea

Most CS students are told to "contribute to open source" with zero guidance on what that actually means. They find an issue, spend days writing code, open a pull request — and either get ignored, or find out their change was too trivial to merge. The "good-first-issue" label that was supposed to help them is self-reported, never verified, and regularly points to issues that are years old, already claimed by a dozen other contributors, or maintained by someone who stopped responding to beginners months ago.

FirstMerge solves this. It is a platform that tells you not just where to contribute, but whether your contribution will actually get merged.

---

## The Problem in One Line

Every existing tool answers "find me an issue." FirstMerge answers "make a contribution that actually gets merged."

---

## The Problem is Documented at Scale

This is not a problem we invented. GSSoC — India's largest open source contribution program — updated its 2026 contributor guidelines to explicitly disqualify low-effort and AI-generated PRs submitted without genuine understanding, and to ban leaderboard gaming via fake or duplicate accounts. GirlScript Foundation built a dedicated manual flagging system because spam was coming from both sides — bad contributors and dead repos. Hacktoberfest, the world's largest open source contribution event, threatens a lifetime ban for repeat spam PR submitters. Every major program has had to apply manual enforcement to a problem that FirstMerge prevents at the source, before the PR ever exists.

A placement-cell professor we spoke to confirmed that colleges already license multiple "placement enhancement" tools — and barely 20 students use any of them. This is why FirstMerge is built bottom-up, not sold top-down. Students adopt tools that solve their problem today, not tools their college bought.

---

## How It Works

**Repo Friendliness Score**
Before a contributor picks an issue, FirstMerge computes a score for that repository using real GitHub data — how quickly the maintainer responds to issues, what percentage of beginner pull requests actually get accepted, how recently the issue was active, and how many other people are already working on it. This number does not exist anywhere else on the internet. It is computed fresh from the GitHub API, not based on a label someone self-reported.

**Issue Liveness Check**
Even a well-maintained repo can have an issue that is already claimed by ten other contributors. FirstMerge shows exactly how many open pull requests already target the same issue before a contributor wastes time building something that will never get reviewed.

**AI Issue Roadmap**
Once a contributor finds a friendly and available issue, FirstMerge doesn't just leave them to figure it out alone. It dynamically generates a step-by-step implementation plan using Gemini before they write a single line of code. The roadmap explicitly outlines which files to modify, estimates the time and complexity, and warns about constraints and common pitfalls that could get a beginner's PR rejected.

**AI PR Quality Check**
After a contributor writes their code and opens a pull request, they paste the PR URL into FirstMerge. The backend automatically fetches the full code diff, the original issue description, the repo's contributing guidelines, and recently rejected pull requests. The AI then returns a single verdict — GENUINE or TRIVIAL — with a specific reason and an actionable suggestion. Know before the maintainer even looks at it.

**Chrome Extension**
The same analysis runs directly inside GitHub. When a contributor opens their pull request on GitHub, the FirstMerge Chrome Extension injects a private analysis panel directly into the GitHub PR page — visible only to the contributor, never to the repo owner or other contributors. The verdict appears right where they are already working, no copy-paste, no tab switching. Tested live on real GitHub PRs including github.com/react/react.

**Contribution Dashboard**
Every issue a contributor saves, attempts, and completes is tracked with a GitHub-style contribution heatmap, milestone badges, and a merge rate — not how many pull requests they opened, but how many actually got merged. Streaks, milestones, and a shareable "first merged PR" card they can post to LinkedIn.

---

## Who It Is For

First-time open source contributors who want their work to count. Not someone in their very first hour learning what a pull request even is — someone who is ready to make a real contribution and needs to know which issue is worth their time, and whether their code actually solves what the maintainer asked for.

---

## The Stack

React + Vite frontend, Node + Express backend, Supabase for auth and caching, GitHub REST and GraphQL API for all signal computation, Gemini AI for the PR quality check, Chrome Extension (Manifest V3) for in-GitHub analysis.

---

## What Makes It Defensible

- The Friendliness Score is computed data — no competitor has it and it cannot be faked by copying our UI
- The liveness check solves an information problem that skill alone cannot fix
- The Chrome Extension puts the analysis where developers already work — inside GitHub itself
- We spoke to real stakeholders before finalising the model: a placement-cell professor and an open source mentor both gave us pushback that changed how we think about the product

---

*FirstMerge — Built for HackVerse 2026.*
