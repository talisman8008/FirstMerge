/**
 * friendlinessScore.js — Compute a repo's beginner-friendliness score (0–100).
 * Never let API failure crash the response — each signal falls back gracefully.
 *
 * Signal weights:
 *   1. Maintainer response time  — 0-20 pts
 *   2. Beginner PR merge rate    — 0-30 pts
 *   3. Issue freshness           — 0-15 pts
 *   4. PR collision count        — 0-35 pts  ⭐ highest weight
 */

import { getRepoPRs, getRepoIssues } from './github.js'

// ── Signal 1: Maintainer response time ───────────────────────────────────────

/**
 * Average hours from issue created_at → closed_at across last 20 closed issues.
 * Never let API failure crash the response — uses 10pt fallback on empty/error data.
 */
function scoreResponseTime(closedIssues) {
  if (!closedIssues.length) {
    return { pts: 10, avgHrs: null, fallback: true }
  }

  const hoursArr = closedIssues
    .filter((i) => i.created_at && i.closed_at)
    .map((i) => (new Date(i.closed_at) - new Date(i.created_at)) / 3_600_000)

  if (!hoursArr.length) {
    return { pts: 10, avgHrs: null, fallback: true }
  }

  const avgHrs = hoursArr.reduce((a, b) => a + b, 0) / hoursArr.length

  let pts
  if (avgHrs < 24)        pts = 20
  else if (avgHrs < 72)   pts = 16
  else if (avgHrs < 168)  pts = 12
  else if (avgHrs < 336)  pts = 8
  else                    pts = 4

  return { pts, avgHrs: Math.round(avgHrs), fallback: false }
}

// ── Signal 2: Beginner PR merge rate ─────────────────────────────────────────

/**
 * Proportion of closed PRs that were merged (merged_at !== null).
 * Never let API failure crash the response — uses 15pt fallback on empty data.
 */
function scoreMergeRate(closedPRs) {
  if (!closedPRs.length) {
    return { pts: 15, mergeRate: null, fallback: true }
  }

  const mergedCount = closedPRs.filter((pr) => pr.merged_at !== null).length
  const mergeRate   = mergedCount / closedPRs.length  // 0–1

  let pts
  if (mergeRate > 0.6)       pts = 30
  else if (mergeRate > 0.4)  pts = 22
  else if (mergeRate > 0.2)  pts = 14
  else                       pts = 5

  return { pts, mergeRate: parseFloat(mergeRate.toFixed(3)), fallback: false }
}

// ── Signal 3: Issue freshness ─────────────────────────────────────────────────

/**
 * Days since the issue was created. Older issues are more likely to be stale.
 * Never let API failure crash the response — uses 8pt fallback when date is missing.
 */
function scoreFreshness(issueCreatedAt) {
  if (!issueCreatedAt) {
    return { pts: 8, fallback: true }
  }

  const daysSince = (Date.now() - new Date(issueCreatedAt)) / 86_400_000

  let pts
  if (daysSince < 7)        pts = 15
  else if (daysSince < 30)  pts = 12
  else if (daysSince < 90)  pts = 8
  else if (daysSince < 180) pts = 4
  else                      pts = 0

  return { pts, fallback: false }
}

// ── Signal 4: PR collision count ──────────────────────────────────────────────

/**
 * Number of open PRs already targeting this issue.
 * High collision = beginners will waste their time. Highest weight signal.
 * Never let API failure crash the response — 0 is already the safe default.
 */
function scoreCollisions(openPRCount) {
  const count = openPRCount ?? 0

  let pts
  if (count === 0)      pts = 35
  else if (count === 1) pts = 25
  else if (count === 2) pts = 15
  else if (count <= 5)  pts = 5
  else                  pts = 0

  return { pts }
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Compute full friendliness score for a repo + issue combination.
 * Never let API failure crash the response — partial data always beats no data.
 *
 * @param {string} owner           - GitHub repo owner
 * @param {string} repo            - GitHub repo name
 * @param {string} issueCreatedAt  - ISO timestamp of the issue
 * @param {number} openPRCount     - pre-fetched open PR count for this issue
 * @returns {Promise<{ score: number, breakdown: object, fallbacks_used: string[] }>}
 */
export async function computeFriendlinessScore(owner, repo, issueCreatedAt, openPRCount) {
  // Fetch both data sources concurrently — each returns [] on failure (never throws)
  const [closedIssues, closedPRs] = await Promise.all([
    getRepoIssues(owner, repo, 20),
    getRepoPRs(owner, repo, 'closed', 50),
  ])

  const { pts: responseTimePts, avgHrs,    fallback: rt_fallback } = scoreResponseTime(closedIssues)
  const { pts: mergeRatePts,    mergeRate, fallback: mr_fallback } = scoreMergeRate(closedPRs)
  const { pts: freshnessPts,               fallback: fr_fallback } = scoreFreshness(issueCreatedAt)
  const { pts: collisionPts }                                       = scoreCollisions(openPRCount)

  const score = responseTimePts + mergeRatePts + freshnessPts + collisionPts

  // Track which signals fell back so callers can surface this in API responses
  const fallbacks_used = []
  if (rt_fallback) fallbacks_used.push('response_time')
  if (mr_fallback) fallbacks_used.push('merge_rate')
  if (fr_fallback) fallbacks_used.push('freshness')

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      response_time_pts:   responseTimePts,
      merge_rate_pts:      mergeRatePts,
      freshness_pts:       freshnessPts,
      collision_pts:       collisionPts,
      response_time_hrs:   avgHrs,
      beginner_merge_rate: mergeRate,
    },
    fallbacks_used,
  }
}
