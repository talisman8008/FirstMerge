/**
 * livenessCheck.js — Check how many open PRs target a specific issue.
 * Never let API failure crash the response — entire function is wrapped in try/catch.
 * Results are cached in Supabase `issue_liveness` table for 30 minutes.
 */

import { createClient } from '@supabase/supabase-js'
import { getIssueOpenPRs } from './github.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

const CACHE_TTL_MS = 30 * 60 * 1000  // 30 minutes

// ── Status label ──────────────────────────────────────────────────────────────

function resolveStatus(openPRCount) {
  if (openPRCount === 0) return 'fresh'
  if (openPRCount <= 2)  return 'active'
  if (openPRCount <= 5)  return 'crowded'
  return 'avoid'
}

// ── Safe fallback result ──────────────────────────────────────────────────────

const ERROR_RESULT = { openPRCount: 0, status: 'fresh', cached: false, error: true }

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Check how contested a specific issue is by counting open PRs targeting it.
 * Never let API failure crash the response — returns ERROR_RESULT on any failure.
 *
 * @param {string} owner
 * @param {string} repo
 * @param {number} issueNumber
 * @returns {Promise<{ openPRCount: number, status: string, cached: boolean, error?: boolean }>}
 */
export async function checkIssueLiveness(owner, repo, issueNumber) {
  try {
    const cacheKey    = `${owner}/${repo}#${issueNumber}`
    const repoFullName = `${owner}/${repo}`

    // ── 1. Try cache ──────────────────────────────────────────────────────────
    try {
      const { data } = await supabase
        .from('issue_liveness')
        .select('open_pr_count, cached_at')
        .eq('issue_id', cacheKey)
        .single()

      if (data?.cached_at) {
        const ageMs = Date.now() - new Date(data.cached_at).getTime()
        if (ageMs < CACHE_TTL_MS) {
          return {
            openPRCount: data.open_pr_count,
            status: resolveStatus(data.open_pr_count),
            cached: true,
          }
        }
      }
    } catch (_cacheErr) {
      // Cache read failure is non-fatal — fall through to live fetch
      console.warn(`[livenessCheck] cache read failed for ${cacheKey}, fetching live`)
    }

    // ── 2. Fetch live from GitHub ─────────────────────────────────────────────
    // Never let API failure crash the response — getIssueOpenPRs already returns 0 on error
    const openPRCount = await getIssueOpenPRs(owner, repo, issueNumber)
    const status      = resolveStatus(openPRCount)

    // ── 3. Persist to cache (fire-and-forget — never blocks the response) ─────
    supabase
      .from('issue_liveness')
      .upsert(
        {
          issue_id:          cacheKey,
          repo_full_name:    repoFullName,
          open_pr_count:     openPRCount,
          last_comment_date: new Date().toISOString(),
          cached_at:         new Date().toISOString(),
        },
        { onConflict: 'issue_id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[livenessCheck] cache write failed:', error.message)
      })

    return { openPRCount, status, cached: false }

  } catch (err) {
    // Never let API failure crash the response
    console.error('[livenessCheck] unexpected error:', err.message)
    return ERROR_RESULT
  }
}
