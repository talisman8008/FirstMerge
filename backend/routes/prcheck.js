/**
 * /api/prcheck
 *
 * Uses the Gemini API to analyse a contributor's pull request diff and
 * return actionable feedback on code quality, alignment with issue requirements,
 * and merge-readiness.
 *
 * Endpoints:
 *   POST /api/prcheck/after  — submit a PR URL for AI verdict
 *   POST /api/prcheck/before — submit an issue URL for pre-code guidance
 */

import { Router } from 'express'

import { fetchPRData, fetchIssueData } from '../services/githubPRService.js'
import { analyzeContribution } from '../services/geminiService.js'

const router = Router()

// ── URL parsers ───────────────────────────────────────────────────────────────

function parsePRUrl(prUrl) {
  // e.g. https://github.com/owner/repo/pull/123
  const match = prUrl?.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2], prNumber: parseInt(match[3], 10) }
}

function parseIssueUrl(issueUrl) {
  // e.g. https://github.com/owner/repo/issues/456
  const match = issueUrl?.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/)
  if (!match) return null
  return { owner: match[1], repo: match[2], issueNumber: parseInt(match[3], 10) }
}

// ── POST /api/prcheck/after ──────────────────────────────────────────────────

router.post('/after', async (req, res) => {
  try {
    const { prUrl } = req.body

    if (!prUrl) {
      return res.status(400).json({ error: 'prUrl is required' })
    }

    const parsed = parsePRUrl(prUrl)
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123' })
    }

    const { owner, repo, prNumber } = parsed

    // Fetch all PR data from GitHub
    const prData = await fetchPRData({ owner, repo, prNumber })

    // Analyse with Gemini
    const result = await analyzeContribution({
      issueTitle: prData.issueTitle,
      issueBody: prData.issueBody,
      contributing: prData.contributing,
      recentClosedPRs: prData.recentClosedPRs,
      diff: prData.diff,
      mode: 'after',
    })

    return res.json(result)
  } catch (err) {
    console.error('[prcheck] POST /after failed:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

// ── POST /api/prcheck/before ─────────────────────────────────────────────────

router.post('/before', async (req, res) => {
  try {
    const { issueUrl } = req.body

    if (!issueUrl) {
      return res.status(400).json({ error: 'issueUrl is required' })
    }

    const parsed = parseIssueUrl(issueUrl)
    if (!parsed) {
      return res.status(400).json({ error: 'Invalid GitHub issue URL. Expected format: https://github.com/owner/repo/issues/456' })
    }

    const { owner, repo, issueNumber } = parsed

    // Fetch issue data from GitHub
    const issueData = await fetchIssueData({ owner, repo, issueNumber })

    // Analyse with Gemini
    const result = await analyzeContribution({
      issueTitle: issueData.issueTitle,
      issueBody: issueData.issueBody,
      contributing: issueData.contributing,
      recentClosedPRs: issueData.recentClosedPRs,
      diff: null,
      mode: 'before',
    })

    return res.json(result)
  } catch (err) {
    console.error('[prcheck] POST /before failed:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

export default router
