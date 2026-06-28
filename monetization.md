---

## The Market Opportunity

HackerRank open-sourced their AI hiring agent in June 2026. The algorithm scores candidates out of 100 across four categories. Open source contributions receive up to **35 points**. Personal projects receive **zero points** in that category. Low-effort Hacktoberfest badge farming gets explicitly penalised or capped.

Every CS student in India is being screened by tools like this right now. Most of them have no idea. And the ones who do try to contribute to open source are doing it wrong — picking dead issues, submitting trivial PRs, wasting days on contributions that will never get merged.

**The market is every CS student who wants a job in tech.** That is not a niche. In India alone that is 2.5 million graduates annually.

---

## Why Existing Tools Fail

| Tool | What it does | Why it fails |
|---|---|---|
| goodfirstissue.dev | Filters by label | Issues 3 years old show as valid |
| firstissue.dev | Issue discovery + tracking | AI matching paywalled at $9/month, still surfaces spam |
| CodeTriage | Emails you issues | Zero quality signal |
| GitHub Search | Search by label | No maintainer data, no collision detection |

None of these tell you whether your contribution will actually get merged. FirstMerge does.

---

## Validated Problem Evidence

- **HackerRank AI Hiring Agent (June 2026)** — open source contributions worth 35/100 in candidate scoring. Personal projects score zero. Hacktoberfest farming penalised.
- **GSSoC 2026 official guidelines** — explicitly disqualify low-effort PRs, AI-generated code without genuine understanding, and leaderboard gaming via fake accounts. The organizers wrote disqualification policy because the spam problem got serious enough to require it.
- **GirlScript Foundation** — built a manual "Flag Projects & Mentors" system because spam is bidirectional. Both bad contributors AND bad dead repos needed a reporting mechanism.
- **Hacktoberfest** — threatens lifetime bans for repeat spam PR submitters at global scale.
- **Placement-cell professor (personally contacted)** — confirmed colleges already license multiple placement enhancement tools and barely 20 students use any of them. This is why we did not build another institutional tool.
- **Open source mentor (personally contacted, peer)** — confirmed the beginner uncertainty problem is real. Contributors don't know if their PR is good enough until it gets rejected publicly.

---

## Why We Are Not Selling to Colleges

A placement-cell professor told us directly: colleges already license 5 tools and 20 students use them. Institutional buyers don't create individual usage. The person who decides to buy is not the person who needs to use it daily.

We validated the institutional model first, got a real negative signal, and changed the model. That is a stronger answer than not having asked.

---

## The Model — Three Tiers

### Tier 1 — Free (forever, for all contributors)

Full product. GitHub OAuth. No credit card. No gatekeeping.

This is the growth engine. Contributors use it, get their first real PR merged, download the shareable card, post it to LinkedIn. Their classmates see it, click the link, sign up. No sales team needed. No marketing budget needed.

**What free tier includes:**
- Issue Discovery Feed with Friendliness Score
- Issue Liveness Check
- 5 AI PR checks per month
- Contribution Dashboard
- First PR Celebration card
- Chrome Extension

---

### Tier 2 — Pro at ₹199/month

For contributors who use FirstMerge seriously — students preparing for placements, GSSoC participants who want quality PRs over spam, bootcamp students building a GitHub profile for hiring.

**What Pro adds:**
- Unlimited AI PR checks
- Priority score computation — popular repos pre-cached, results instant
- Extended contribution history and analytics
- Export contribution report as PDF for resume/placement portfolio use
- Early access to new features

**Why ₹199:** Low enough that a student pays without asking a parent. High enough to matter at scale. Less than a single meal at a decent restaurant. The value — helping someone pass an AI hiring screen that weights open source at 35/100 — is orders of magnitude higher than the price.

---

### Tier 3 — Repo Certification at ₹5,000–15,000/month

Companies and open source projects pay to be listed as **"FirstMerge Certified Beginner-Friendly."**

**What they get:**
- A certification badge on every issue card in the FirstMerge feed
- A dashboard showing their contributor pipeline — how many users saved their issues, attempted them, opened PRs, got merged
- Verified signal to attract quality first-time contributors instead of spam
- Listed in a "Certified Repos" section that serious contributors actively filter for

**Why companies pay:**
Right now companies that want open source contributors get flooded with trivial PRs. Their maintainers spend hours marking contributions as invalid. Certification signals "our maintainers are responsive, our issues are real, our beginner PRs actually get merged." For a developer-focused company, that is worth paying for — it is a recruitment channel and a brand signal simultaneously.

**Target buyers:** Indian product companies (Razorpay, Zepto, Supabase India), developer tool companies, any company that actively maintains open source repos and wants quality contributors.

---

## Unit Economics — 1,000 Active Users

| | Detail | Monthly |
|---|---|---|
| Free users | 900 users, ₹0 | ₹0 |
| Pro conversions | 100 users × ₹199 | ₹19,900 |
| Certified repos | 2 companies × ₹5,000 | ₹10,000 |
| **Total Revenue** | | **₹29,900** |
| Railway server cost | Backend hosting | ~₹400 |
| Gemini API | Free tier covers 1,500 calls/day | ₹0 |
| Supabase | Free tier covers current scale | ₹0 |
| GitHub API | Free, 5,000 req/hr authenticated | ₹0 |
| **Total Costs** | | **~₹400** |
| **Net Margin** | | **~98%** |

**At 10,000 active users (10% Pro conversion = 1,000 paying):**
- Pro revenue: ₹1,99,000/month
- Certified repos (20 companies): ₹1,00,000/month
- Total: ~₹3,00,000/month
- Server costs scale to ~₹5,000/month on paid Railway tier
- Net: ~₹2,95,000/month (~$3,500/month)

This is a high-margin SaaS business from day one. The marginal cost of serving one more user is essentially zero until significant scale.

---

## Growth Strategy

**Phase 1 — Individual adoption (0 to 6 months)**

- GSSoC runs May–August every year. Hacktoberfest runs every October. These are concentrated, predictable spikes of exactly our target user — thousands of first-time contributors hitting GitHub in a narrow window.
- Be present in GSSoC Discord, relevant Reddit communities (r/learnprogramming, r/opensource, r/developersIndia), college WhatsApp groups during these windows.
- The shareable "first merged PR" card is the only acquisition mechanic needed — students post it, peers see it, signups happen without ad spend.
- Chrome Extension distribution — once installed, FirstMerge is present on every GitHub PR page the user visits. Zero re-acquisition cost.

**Phase 2 — Monetisation (6 to 18 months)**

- Activate Pro tier when organic user base crosses 500 monthly active users.
- Approach first Repo Certification customers with usage data — "X contributors from FirstMerge saved issues in your repo this month." That is a warm pitch, not a cold one.

**Phase 3 — Institutional (18 months+)**

- Once individual traction is documented, college placement cells become a warm audience. "200 of your students are already using this — here is what their contribution quality looks like" is a completely different conversation from a cold institutional pitch.
- Partner with GSSoC/Hacktoberfest as an official tool or sponsor. Their spam problem is our product's solution.

---

## The Moat — Why This Cannot Be Copied in 2 Days

**1. Computed data, not scraped labels**
The Friendliness Score is built from 4 GitHub API signals computed fresh per repo, weighted by an algorithm, and cached in Supabase. Copying the UI takes an afternoon. Replicating months of signal computation, cache infrastructure, and algorithm tuning takes months.

**2. Chrome Extension distribution**
Once a user installs the extension, FirstMerge is present inside GitHub itself — the place contributors already spend their time. This is a distribution moat that a web-only competitor cannot replicate without their own extension.

**3. Contribution history network effect**
Every user who tracks their issues, marks contributions done, and builds a merge rate history is invested in FirstMerge. Their data lives here. Switching means starting over.

**4. Timing — HackerRank's hiring agent changes everything**
The AI hiring agent that weights open source at 35/100 was open-sourced in June 2026 — this month. The window to be the tool that helps contributors score well on that metric is open right now. Six months from now this will be widely understood and the space will be crowded. We are here first.

---

## One Line for the Pitch

"Contributors use it free and grow us. Serious contributors pay ₹199 for unlimited access. Companies pay ₹5,000 to attract those serious contributors to their repos. Everyone has a reason to be here — and we make 98% margin from day one."

---

*FirstMerge — Built for HackVerse 2026.*