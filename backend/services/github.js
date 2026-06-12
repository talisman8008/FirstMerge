/**
 * github.js — GitHub REST API client for FirstMerge backend.
 * Never let API failure crash the response — every function catches its own errors.
 */

import 'dotenv/config'
console.log('GitHub token:', process.env.GITHUB_TOKEN?.slice(0, 10))
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = 'https://api.github.com'

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
}

// ── Internal fetch helper ─────────────────────────────────────────────────────

async function ghFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  const res = await fetch(url.toString(), { headers: DEFAULT_HEADERS })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status} ${res.statusText}: ${text.slice(0, 120)}`)
  }
  return res.json()
}

async function ghGraphQL(query, variables = {}) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ query, variables })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub GraphQL ${res.status}: ${text.slice(0, 120)}`)
  }
  const json = await res.json()
  if (json.errors) {
    throw new Error(`GraphQL Error: ${json.errors[0].message}`)
  }
  return json.data
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Search open "good first issue" issues for a language + skill level.
 * Never let API failure crash the response — returns [] on any error.
 */
export async function searchIssues(language, skillLevel, page = 1) {
  try {
    let q = `label:"good first issue" language:${language} state:open`
    if (skillLevel?.toLowerCase() === 'beginner') q += ' label:"good-first-issue" -label:complexity:high'

    const data = await ghFetch('/search/issues', {
      q,
      sort: 'created',
      order: 'desc',
      per_page: 30,
      page,
    })

    if (!Array.isArray(data?.items)) return []

    return data.items.map((issue) => ({
      id: issue.id,
      title: issue.title,
      html_url: issue.html_url,
      repository_url: issue.repository_url,
      created_at: issue.created_at,
      comments: issue.comments,
      number: issue.number,
      language: language,
    }))
  } catch (err) {
    console.error('[github.searchIssues] failed:', err.message)
    return []
  }
}

/**
 * Fetch closed/merged PRs for a repo (used for merge rate signal).
 * Never let API failure crash the response — returns [] on any error.
 */
export async function getRepoPRs(owner, repo, state = 'closed', perPage = 50) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/pulls`, {
      state,
      per_page: perPage,
      sort: 'updated',
      direction: 'desc',
    })

    if (!Array.isArray(data)) return []

    return data.map((pr) => ({
      merged_at: pr.merged_at ?? null,
      created_at: pr.created_at,
      user: pr.user?.login ?? null,
    }))
  } catch (err) {
    console.error(`[github.getRepoPRs] ${owner}/${repo} failed:`, err.message)
    return []
  }
}

/**
 * Fetch recently closed issues for a repo (used for response time signal).
 * Never let API failure crash the response — returns [] on any error.
 * Note: GitHub issues endpoint includes PRs — they are filtered out.
 */
export async function getRepoIssues(owner, repo, perPage = 20) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/issues`, {
      state: 'closed',
      per_page: perPage,
      sort: 'updated',
      direction: 'desc',
    })

    if (!Array.isArray(data)) return []

    return data
      .filter((item) => !item.pull_request) // exclude PRs returned by this endpoint
      .map((issue) => ({
        created_at: issue.created_at,
        closed_at: issue.closed_at,
        comments: issue.comments,
      }))
  } catch (err) {
    console.error(`[github.getRepoIssues] ${owner}/${repo} failed:`, err.message)
    return []
  }
}

/**
 * Count open PRs whose title or body references a specific issue number.
 * Never let API failure crash the response — returns 0 on any error.
 */
export async function getIssueOpenPRs(owner, repo, issueNumber) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}/pulls`, {
      state: 'open',
      per_page: 50,
    })

    if (!Array.isArray(data)) return 0

    const pattern = new RegExp(`#${issueNumber}\\b`, 'i')
    return data.filter((pr) =>
      pattern.test(pr.title ?? '') || pattern.test(pr.body ?? ''),
    ).length
  } catch (err) {
    console.error(`[github.getIssueOpenPRs] ${owner}/${repo}#${issueNumber} failed:`, err.message)
    return 0
  }
}

/**
 * Get the repository data (language, stars).
 * Never let API failure crash the response — returns default object on any error.
 */
export async function getRepoData(owner, repo) {
  try {
    const data = await ghFetch(`/repos/${owner}/${repo}`)
    return {
      language: data?.language ?? null,
      stars: data?.stargazers_count ?? 0
    }
  } catch (err) {
    console.error(`[github.getRepoData] ${owner}/${repo} failed:`, err.message)
    return { language: null, stars: 0 }
  }
}

/**
 * Fetch user profile from GitHub
 */
export async function getUserProfile(username) {
  try {
    const data = await ghFetch(`/users/${username}`)
    return {
      avatar_url: data.avatar_url,
      name: data.name,
      login: data.login,
      followers: data.followers,
      public_repos: data.public_repos,
    }
  } catch (err) {
    console.error(`[github.getUserProfile] ${username} failed:`, err.message)
    return null
  }
}

/**
 * Fetch user activity (languages, PR counts, and mock 365-day heatmap seeded with recent events)
 */
export async function getUserActivity(username) {
  try {
    // 1. Calculate languages from recent repos and get top repos using GraphQL
    // 1. Calculate languages from recent repos and get top contributed repos using GraphQL
    const repoQuery = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
          repositoriesContributedTo(first: 10, contributionTypes: [COMMIT, PULL_REQUEST], orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              nameWithOwner
              description
              url
              stargazerCount
            }
          }
        }
      }
    `
    const languages = {}
    let topRepos = []
    let totalSize = 0
    try {
      const repoDataGql = await ghGraphQL(repoQuery, { username })
      
      // Parse language sizes from owned repos
      const ownedNodes = repoDataGql?.user?.repositories?.nodes || []
      ownedNodes.forEach(repo => {
        if (repo.languages?.edges) {
          repo.languages.edges.forEach(edge => {
            const langName = edge.node.name
            const size = edge.size
            languages[langName] = (languages[langName] || 0) + size
            totalSize += size
          })
        }
      })
      
      // Parse top contributed repos (external)
      const contributedNodes = repoDataGql?.user?.repositoriesContributedTo?.nodes || []
      topRepos = contributedNodes
        .slice(0, 3)
        .map(r => ({
          name: r.nameWithOwner,
          url: r.url,
          stars: r.stargazerCount || 0,
          description: r.description
        }))
    } catch(err) {
      console.error('GraphQL repo/languages error:', err)
    }

    const sortedLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, size]) => ({ 
        lang, 
        percentage: totalSize > 0 ? ((size / totalSize) * 100).toFixed(1) : 0 
      }))

    // 2. Fetch total PRs opened
    const prData = await ghFetch('/search/issues', { q: `author:${username} type:pr`, per_page: 1 })
    const totalPRs = prData?.total_count || 0

    // 3. Fetch total issues closed
    const issueData = await ghFetch('/search/issues', { q: `author:${username} type:issue is:closed`, per_page: 1 })
    const totalIssuesClosed = issueData?.total_count || 0

    // 4. Generate heatmap for the current year using GraphQL
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(Date.UTC(currentYear, 0, 1)).toISOString();
    const toDate = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59)).toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `
    const heatmap = []
    let recentActivity = []
    let contributionSplit = []
    try {
      const gqlData = await ghGraphQL(query, { username, from: fromDate, to: toDate })
      const coll = gqlData?.user?.contributionsCollection || {}
      const weeks = coll.contributionCalendar?.weeks || []
      
      contributionSplit = [
        { name: 'Commits', value: coll.totalCommitContributions || 0, color: '#5c5c5c' },
        { name: 'PRs', value: coll.totalPullRequestContributions || 0, color: '#b8a282' },
        { name: 'Issues', value: coll.totalIssueContributions || 0, color: '#e2ccab' },
        { name: 'Reviews', value: coll.totalPullRequestReviewContributions || 0, color: '#d99c52' }
      ].filter(item => item.value > 0)
      
      const dayMap = {}
      weeks.forEach(week => {
        week.contributionDays.forEach(day => {
          dayMap[day.date] = day.contributionCount
        })
      })

      // Generate exact calendar days for the year to ensure frontend alignment
      const isLeap = currentYear % 4 === 0 && (currentYear % 100 !== 0 || currentYear % 400 === 0);
      const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      for (let m = 0; m < 12; m++) {
        for (let d = 1; d <= daysInMonth[m]; d++) {
          const dateStr = `${currentYear}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          heatmap.push({
            date: dateStr,
            count: dayMap[dateStr] || 0
          })
        }
      }

      // 5. Generate recent activity graph data (last 14 days up to today)
      const todayStr = new Date().toISOString().slice(0, 10)
      const todayIndex = heatmap.findIndex(d => d.date === todayStr)
      if (todayIndex !== -1) {
        recentActivity = heatmap.slice(Math.max(0, todayIndex - 13), todayIndex + 1)
      } else {
        recentActivity = heatmap.slice(-14)
      }
    } catch(err) {
      console.error('GraphQL heatmap error:', err)
      // gracefully fail, returning empty array
    }

    return {
      languages: sortedLanguages,
      totalPRs,
      totalIssuesClosed,
      heatmap,
      recentActivity,
      contributionSplit,
      topRepos
    }
  } catch (err) {
    console.error(`[github.getUserActivity] ${username} failed:`, err.message)
    return null
  }
}
