/**
 * /api/repos
 *
 * GET /api/repos/:owner/:repo/score
 * — Returns the friendliness score for a specific repository.
 *   Checks Supabase repo_scores cache first (30-min TTL).
 *   Computes fresh if stale or missing, then caches the result.
 *
 * Response shape: { data: { repo, score, breakdown, fallbacks_used, cached }, error, cached }
 */

import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { computeFriendlinessScore } from '../services/friendlinessScore.js'

const router = Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

const SCORE_TTL_MS = 30 * 60 * 1000  // 30 minutes

// ── GET /api/repos/:owner/:repo/score ─────────────────────────────────────────

router.get('/:owner/:repo/score', async (req, res) => {
  const { owner, repo } = req.params
  const repoFullName    = `${owner}/${repo}`

  try {
    // 1. Check Supabase cache
    let cached = false

    try {
      const { data } = await supabase
        .from('repo_scores')
        .select('friendliness_score, response_time_hrs, beginner_merge_rate, last_updated')
        .eq('repo_full_name', repoFullName)
        .single()

      if (data?.last_updated) {
        const ageMs = Date.now() - new Date(data.last_updated).getTime()
        if (ageMs < SCORE_TTL_MS) {
          return res.json({
            data: {
              repo:  repoFullName,
              score: data.friendliness_score,
              breakdown: {
                response_time_hrs:    data.response_time_hrs,
                beginner_merge_rate:  data.beginner_merge_rate,
              },
              fallbacks_used: [],
              cached: true,
            },
            error:  null,
            cached: true,
          })
        }
      }
    } catch {
      // Cache read failure is non-fatal — fall through to fresh computation
    }

    // 2. Compute fresh score (openPRCount unknown at repo level — pass 0 as neutral)
    const result = await computeFriendlinessScore(owner, repo, null, 0)

    // 3. Persist to cache (fire-and-forget)
    supabase
      .from('repo_scores')
      .upsert(
        {
          repo_full_name:      repoFullName,
          friendliness_score:  result.score,
          response_time_hrs:   result.breakdown.response_time_hrs ?? null,
          beginner_merge_rate: result.breakdown.beginner_merge_rate ?? null,
          last_updated:        new Date().toISOString(),
        },
        { onConflict: 'repo_full_name' },
      )
      .then(({ error }) => {
        if (error) console.warn('[repos] cache write failed:', error.message)
      })

    return res.json({
      data: {
        repo:          repoFullName,
        score:         result.score,
        breakdown:     result.breakdown,
        fallbacks_used: result.fallbacks_used,
        cached:        false,
      },
      error:  null,
      cached: false,
    })

  } catch (err) {
    console.error(`[repos] GET /${owner}/${repo}/score failed:`, err.message)
    return res.json({
      data:   null,
      error:  err.message,
      cached: false,
    })
  }
})

export default router
