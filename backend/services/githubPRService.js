/**
 * githubPRService.js — GitHub API calls for PR check and issue analysis.
 *
 * Exports:
 *   • fetchPRData   — gathers diff, linked issue, contributing guide, recent PRs
 *   • fetchIssueData — gathers issue detail, contributing guide, recent PRs
 */

import 'dotenv/config'

const BASE_URL = 'https://api.github.com'

// ── Internal fetch helper ─────────────────────────────────────────────────────

function buildHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

async function ghFetch(path, token) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, { headers: buildHeaders(token) })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status} ${res.statusText}: ${text.slice(0, 120)}`)
  }
  return res.json()
}

// ── Parse linked issue number from PR body ────────────────────────────────────

function parseLinkedIssueNumber(body) {
  if (!body) return null
  // Match patterns like "Fixes #123", "Closes #456", "Resolves #789"
  const match = body.match(/(?:fix(?:es)?|close[sd]?|resolve[sd]?)\s+#(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

// ── Fetch CONTRIBUTING.md (returns null on 404) ───────────────────────────────

async function fetchContributing(owner, repo, token) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/contents/CONTRIBUTING.md`, token)
    if (data?.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8')
    }
    return null
  } catch (err) {
    // 404 is expected — repo may not have a CONTRIBUTING.md
    if (err.message.includes('404')) return null
    console.warn('[githubPRService] fetchContributing error:', err.message)
    return null
  }
}

// ── Fetch recent closed PRs ──────────────────────────────────────────────────

async function fetchRecentClosedPRs(owner, repo, token) {
  try {
    const prs = await ghFetch(`/repos/${owner}/${repo}/pulls?state=closed&per_page=5`, token)
    if (!Array.isArray(prs)) return []
    return prs.map((pr) => ({
      title: pr.title,
      merged: pr.merged_at !== null,
    }))
  } catch (err) {
    console.warn('[githubPRService] fetchRecentClosedPRs error:', err.message)
    return []
  }
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Fetch all data needed to analyse a pull request (mode: "after").
 *
 * @param {object} params
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {number} params.prNumber
 * @param {string} [params.githubToken]
 * @returns {Promise<object>}
 */
export async function fetchPRData({ owner, repo, prNumber, githubToken }) {
  const token = githubToken || process.env.GITHUB_TOKEN
  if (!token) throw new Error('No GitHub token available')

  // 1. Get PR files → build diff from patches
  const files = await ghFetch(`/repos/${owner}/${repo}/pulls/${prNumber}/files`, token)
  const diff = Array.isArray(files)
    ? files.map((f) => f.patch || '').filter(Boolean).join('\n\n')
    : ''

  // 2. Get PR detail → extract linked issue number
  const prDetail = await ghFetch(`/repos/${owner}/${repo}/pulls/${prNumber}`, token)
  const issueNumber = parseLinkedIssueNumber(prDetail?.body)

  // 3. Get issue detail (if linked)
  let issueTitle = prDetail?.title || 'No linked issue found'
  let issueBody = prDetail?.body || ''

  if (issueNumber) {
    try {
      const issueData = await ghFetch(`/repos/${owner}/${repo}/issues/${issueNumber}`, token)
      issueTitle = issueData.title
      issueBody = issueData.body || ''
    } catch (err) {
      console.warn('[githubPRService] Could not fetch linked issue:', err.message)
    }
  }

  // 4. Get CONTRIBUTING.md
  const contributing = await fetchContributing(owner, repo, token)

  // 5. Get recent closed PRs
  const recentClosedPRs = await fetchRecentClosedPRs(owner, repo, token)

  return {
    diff,
    issueTitle,
    issueBody,
    contributing,
    recentClosedPRs,
    issueNumber,
  }
}

/**
 * Fetch all data needed to analyse an issue before writing code (mode: "before").
 *
 * @param {object} params
 * @param {string} params.owner
 * @param {string} params.repo
 * @param {number} params.issueNumber
 * @param {string} [params.githubToken]
 * @returns {Promise<object>}
 */
export async function fetchIssueData({ owner, repo, issueNumber, githubToken }) {
  const token = githubToken || process.env.GITHUB_TOKEN
  if (!token) throw new Error('No GitHub token available')

  // 1. Get issue detail
  const issueData = await ghFetch(`/repos/${owner}/${repo}/issues/${issueNumber}`, token)
  const issueTitle = issueData.title
  const issueBody = issueData.body || ''

  // 2. Get CONTRIBUTING.md
  const contributing = await fetchContributing(owner, repo, token)

  // 3. Get recent closed PRs
  const recentClosedPRs = await fetchRecentClosedPRs(owner, repo, token)

  return {
    issueTitle,
    issueBody,
    contributing,
    recentClosedPRs,
  }
}
