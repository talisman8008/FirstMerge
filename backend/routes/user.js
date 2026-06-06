/**
 * /api/user
 *
 * Authenticated user operations — dashboard stats and issue status management.
 * All endpoints validate the Supabase JWT before responding.
 *
 * Endpoints:
 *   GET   /api/user/dashboard      — get dashboard stats + saved issues
 *   PATCH /api/user/issues/:issueId — update a saved issue's status
 */

import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
)

// ── Auth middleware ───────────────────────────────────────────────────────────

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' })
    }

    const token = authHeader.slice(7) // strip "Bearer "

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('[user] Auth middleware error:', err.message)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Calculate current streak — consecutive days (going back from today)
 * where at least one issue was marked "done".
 */
function calculateStreak(issues) {
  const doneIssues = issues.filter((i) => i.status === 'done' && i.created_at)

  if (doneIssues.length === 0) return 0

  // Get unique dates (YYYY-MM-DD) when issues were marked done
  const doneDates = new Set(
    doneIssues.map((i) => new Date(i.created_at).toISOString().slice(0, 10)),
  )

  let streak = 0
  const today = new Date()

  for (let d = 0; d < 365; d++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - d)
    const dateStr = checkDate.toISOString().slice(0, 10)

    if (doneDates.has(dateStr)) {
      streak++
    } else if (d > 0) {
      // Allow today to not have activity yet — only break on past gaps
      break
    }
  }

  return streak
}

// ── GET /api/user/dashboard ──────────────────────────────────────────────────

router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id

    const { data: issues, error } = await supabase
      .from('saved_issues')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[user] Dashboard query failed:', error.message)
      return res.status(500).json({ error: 'Failed to fetch dashboard data' })
    }

    const allIssues = issues || []

    const totalSaved = allIssues.length
    const totalDone = allIssues.filter((i) => i.status === 'done').length
    const mergeRate = totalSaved > 0
      ? Math.round((totalDone / totalSaved) * 1000) / 10
      : 0
    const currentStreak = calculateStreak(allIssues)

    return res.json({
      issues: allIssues,
      totalSaved,
      totalDone,
      mergeRate,
      currentStreak,
    })
  } catch (err) {
    console.error('[user] GET /dashboard failed:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

// ── PATCH /api/user/issues/:issueId ──────────────────────────────────────────

router.patch('/issues/:issueId', requireAuth, async (req, res) => {
  try {
    const { issueId } = req.params
    const { status } = req.body

    const validStatuses = ['saved', 'attempting', 'done']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const { data, error } = await supabase
      .from('saved_issues')
      .update({ status })
      .eq('id', issueId)
      .eq('user_id', req.user.id) // ensure user owns this issue
      .select()
      .single()

    if (error) {
      console.error('[user] PATCH issue failed:', error.message)
      return res.status(500).json({ error: 'Failed to update issue status' })
    }

    if (!data) {
      return res.status(404).json({ error: 'Issue not found or not owned by you' })
    }

    return res.json(data)
  } catch (err) {
    console.error('[user] PATCH /issues/:issueId failed:', err.message)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
})

export default router
