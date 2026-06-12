import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import Navbar from '../components/Navbar.jsx'
import supabase from '../lib/supabase.js'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 rounded-full border-2 border-[var(--color-dashboard-muted)] border-t-[var(--color-dashboard-text)] animate-spin" />
  </div>
)

function Heatmap({ data, totalIssues, activeDays }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: '' });

  const plotData = (!data || data.length === 0) 
    ? Array.from({ length: 365 }, () => ({ count: 0, date: '' }))
    : data;

  // Match exact number of days per month (assuming current year)
  const year = new Date().getFullYear();
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const months = [];
  let currentDayIndex = 0;

  daysInMonth.forEach((numDays) => {
    const monthDays = plotData.slice(currentDayIndex, currentDayIndex + numDays);
    currentDayIndex += numDays;

    const monthWeeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      monthWeeks.push(monthDays.slice(i, i + 7));
    }
    months.push(monthWeeks);
  });

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatTooltipText = (dateStr, count) => {
    if (!dateStr) return 'No data';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return 'No data';
    
    const monthsFull = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const monthName = monthsFull[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    
    let suffix = 'th';
    if (day % 10 === 1 && day !== 11) suffix = 'st';
    else if (day % 10 === 2 && day !== 12) suffix = 'nd';
    else if (day % 10 === 3 && day !== 13) suffix = 'rd';
    
    const countText = count === 1 ? '1 contribution' : `${count} contributions`;
    return `${countText} on ${monthName} ${day}${suffix}`;
  };

  return (
    <div className="w-full flex flex-col relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 text-[13px] text-[#908989] px-2">
        <div>
          <span className="text-[18px] text-black font-semibold mr-1">{totalIssues || 0}</span> 
          issues solved in the past one year
        </div>
        <div className="flex gap-4">
          <span>Total active days: {activeDays || 0}</span>

        </div>
      </div>

      {/* Grid of Months */}
      <div className="flex justify-between overflow-x-auto pb-2 w-full custom-scrollbar" onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}>
        {months.map((monthWeeks, mIdx) => (
          <div key={mIdx} className="flex flex-col items-center gap-1">
            <div className="flex gap-[3px]">
              {monthWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => {
                    let bg = 'bg-[#e0e0e0]'; // empty
                    if (day.count === 1) bg = 'bg-[#9be9a8]';
                    if (day.count === 2) bg = 'bg-[#40c463]';
                    if (day.count >= 3) bg = 'bg-[#30a14e]';
                    
                    const tooltipText = formatTooltipText(day.date, day.count);
                    
                    return (
                      <div 
                        key={dIdx} 
                        className={`w-[12px] h-[12px] rounded-[2px] ${bg} hover:ring-[1.5px] hover:ring-black hover:scale-110 transition-all duration-100 cursor-pointer`} 
                        onMouseEnter={(e) => setTooltip({ show: true, x: e.clientX, y: e.clientY, text: tooltipText })}
                        onMouseMove={(e) => setTooltip({ show: true, x: e.clientX, y: e.clientY, text: tooltipText })}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
            {/* Month Label directly under the block */}
            <span className="text-[11px] text-[#908989] mt-1">{monthLabels[mIdx]}</span>
          </div>
        ))}

        {/* Floating Tooltip */}
        {tooltip.show && (
          <div 
            className="fixed z-[100] bg-gray-900 text-white text-[11px] font-medium px-2 py-1.5 rounded shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y - 12 }}
          >
            {tooltip.text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}

const DashboardSkeleton = () => (
  <div className="max-w-[2880px] mx-auto px-8 py-8 flex flex-col md:flex-row gap-8 w-full animate-pulse">
    {/* Left Sidebar Skeleton */}
    <div className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-24 bg-gray-200 rounded-md w-full"></div>
      </div>
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between"><div className="h-3 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-8"></div></div>
        <div className="flex justify-between"><div className="h-3 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-8"></div></div>
        <div className="flex justify-between"><div className="h-3 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-8"></div></div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="flex-1 flex flex-col gap-6">
      <div className="rounded-xl p-6 h-[250px] bg-gray-100 border border-gray-200"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 h-[200px] bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="flex gap-8">
            <div className="w-16 h-12 bg-gray-200 rounded"></div>
            <div className="w-16 h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="rounded-xl p-6 h-[200px] bg-gray-100 border border-gray-200 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded-sm w-full"></div>
          <div className="h-8 bg-gray-200 rounded-sm w-11/12"></div>
          <div className="h-8 bg-gray-200 rounded-sm w-full"></div>
        </div>
      </div>
      <div className="rounded-xl p-6 h-[220px] bg-gray-100 border border-gray-200"></div>
      <div className="rounded-xl p-6 h-[200px] bg-gray-100 border border-gray-200"></div>
    </div>
  </div>
)

export default function Dashboard({ user, signIn, signOut }) {
  const [dashData, setDashData] = useState(null)
  const [githubData, setGithubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('Saved')

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) throw new Error('No active session.')

        const headers = { Authorization: `Bearer ${session.access_token}` }

        const [dashRes, ghRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/user/dashboard`, { headers }),
          fetch(`${BACKEND_URL}/api/user/github-profile`, { headers })
        ])

        if (!dashRes.ok) throw new Error('Failed to load dashboard data')
        const dData = await dashRes.json()
        setDashData(dData)

        if (ghRes.ok) {
          const gData = await ghRes.json()
          setGithubData(gData)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  if (!user) {
    return (
      <div className="bg-[var(--color-dashboard-bg)] min-h-screen text-[var(--color-dashboard-text)]">
        <div className="bg-[var(--color-dashboard-nav)]"><Navbar user={user} signIn={signIn} signOut={signOut} /></div>
        <div className="flex justify-center py-20">
          <button onClick={signIn} className="px-4 py-2 bg-black text-white rounded-md">Log in with GitHub</button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="bg-[var(--color-dashboard-bg)] min-h-screen">
      <div className="bg-[var(--color-dashboard-nav)]">
        <Navbar user={user} signIn={signIn} signOut={signOut} />
      </div>
      <DashboardSkeleton />
    </div>
  )

  const profile = githubData?.profile || {}
  const activity = githubData?.activity || {}

  const totalCommits = activity.contributionSplit?.find(i => i.name === 'Commits')?.value || 0;
  const totalOS = (activity.totalPRs || 0) + (activity.totalIssuesClosed || dashData?.totalDone || 0);

  const milestones = [
    { name: 'The Spark', desc: '10 Commits', image: '/medals/commit_bronze.png', achieved: true, progress: `10/10` },
    { name: 'Consistent', desc: '100 Commits', image: '/medals/commit_silver.png', achieved: true, progress: `100/100` },
    { name: 'Machine', desc: '500 Commits', image: '/medals/commit_gold.png', achieved: true, progress: `500/500` },
    { name: 'First Issue', desc: '1 OS PR/Issue', image: '/medals/os_bronze.png', achieved: true, progress: `1/1` },
    { name: 'Helper', desc: '10 OS PR/Issues', image: '/medals/os_silver.png', achieved: true, progress: `10/10` },
    { name: 'Legend', desc: '50 OS PR/Issues', image: '/medals/os_gold.png', achieved: true, progress: `50/50` },
  ];

  return (
    <div className="bg-[var(--color-dashboard-bg)] min-h-screen text-[var(--color-dashboard-text)] font-sans">
      <div className="bg-[var(--color-dashboard-nav)]">
        <Navbar user={user} signIn={signIn} signOut={signOut} />
      </div>

      {error && <div className="p-4 text-red-600 text-center">{error}</div>}

      <div className="max-w-[2880px] mx-auto px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[300px] flex-shrink-0 flex flex-col gap-8">
          
          {/* User Info */}
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 bg-gray-200 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-2xl flex items-center justify-center text-sm text-gray-500">user icon</div>
            )}
            <div>
              <h2 className="text-xl font-bold uppercase">
                {profile.name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'GITHUB NAME'}
              </h2>
              <p className="text-sm text-[var(--color-dashboard-muted)] mt-1">
                {profile.login || user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || 'github username'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[var(--color-dashboard-muted)]">Milestones Rewards:</h3>
            <div className="border border-gray-200 rounded-md mt-2 p-5 grid grid-cols-3 gap-y-6 gap-x-2" style={{ backgroundColor: '#fffbf4' }}>
              {milestones.map((m, idx) => (
                <div key={idx} className="h-16 flex flex-col items-center justify-center group relative cursor-help">
                  <div className={`${idx === 0 ? 'w-16 h-16' : 'w-14 h-14'} rounded-full flex items-center justify-center ${m.achieved ? 'bg-[#fffbf4] shadow-sm ring-1 ring-gray-200' : 'bg-gray-100'} transition-all duration-300 group-hover:scale-110`}>
                    <img 
                      src={m.image} 
                      alt={m.name} 
                      className={`${idx === 0 ? 'w-16 h-16 scale-110' : 'w-11 h-11'} object-contain transition-all duration-300 ${m.achieved ? 'drop-shadow-md' : 'grayscale opacity-40 blur-[0.5px]'}`} 
                    />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full mt-3 w-32 bg-gray-900 text-white text-xs p-2.5 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-center pointer-events-none">
                    <p className="font-bold mb-1">{m.name}</p>
                    <p className="text-gray-300 mb-2 text-[10px]">{m.desc}</p>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#e3b341] h-full transition-all duration-1000" style={{ width: `${(parseInt(m.progress.split('/')[0]) / parseInt(m.progress.split('/')[1])) * 100}%` }}></div>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-300">{m.progress}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-[var(--color-dashboard-muted)] mb-4">Community Stats</h3>
            <div className="space-y-4">
              <p className="flex justify-between text-sm">
                <span>Total issues Closed :</span>
                <span className="font-semibold">{activity.totalIssuesClosed || dashData?.totalDone || 0}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span>Total PR's Opened:</span>
                <span className="font-semibold">{activity.totalPRs || 0}</span>
              </p>

            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-[var(--color-dashboard-muted)] mb-4">Languages</h3>
            <div className="space-y-3">
              {(activity.languages || []).slice(0, 3).map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">{lang.lang}</span>
                  <span className="text-xs text-[var(--color-dashboard-muted)]">{lang.percentage}%</span>
                </div>
              ))}
              {(!activity.languages || activity.languages.length === 0) && (
                <p className="text-sm text-gray-400">No language data</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-[var(--color-dashboard-muted)] mb-4">Type of Issue solved</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">Good First issue</span>
                <span className="text-xs text-[var(--color-dashboard-muted)]">x{dashData?.totalDone || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">Ui Fixes</span>
                <span className="text-xs text-[var(--color-dashboard-muted)]">x0</span>
              </div>
            </div>
          </div>

        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Stats Box (now Contribution Split) */}
            <div className="border border-gray-200 rounded-xl p-6 min-h-[200px] flex flex-col" style={{ backgroundColor: '#fffbf4' }}>
              <h3 className="text-xl font-bold text-[var(--color-dashboard-muted)] mb-2">Contribution Split</h3>
              <div className="flex flex-row items-center flex-1 w-full">
                {/* Chart Container (Left) */}
                <div className="flex-1 h-full flex items-center justify-start">
                  {activity.contributionSplit && activity.contributionSplit.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={activity.contributionSplit}
                          cx="35%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {activity.contributionSplit.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '12px', padding: '4px 8px' }}
                          itemStyle={{ color: '#000', fontWeight: '500' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No recent contributions</div>
                  )}
                </div>

                {/* Legend Container (Right) */}
                <div className="flex flex-col justify-center gap-4 w-[130px] pl-4">
                  {(activity.contributionSplit || []).map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-medium text-[var(--color-dashboard-muted)]">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Contribution */}
            <div className="border border-gray-200 rounded-xl p-6 min-h-[200px]" style={{ backgroundColor: '#fffbf4' }}>
              <h3 className="text-xl font-bold text-[var(--color-dashboard-muted)] mb-4">Your Top contribution</h3>
              <div className="space-y-3">
                {activity.topRepos && activity.topRepos.length > 0 ? (
                  activity.topRepos.map((repo, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-md border border-gray-100" style={{ backgroundColor: '#fff' }}>
                      <div className="flex-1 min-w-0 pr-4">
                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:underline truncate block text-black">
                          {repo.name}
                        </a>
                        <p className="text-xs text-[var(--color-dashboard-muted)] truncate mt-0.5">{repo.description || 'No description'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-dashboard-muted)]">
                        <span className="text-[#e3b341]">★</span>
                        <span>{repo.stars}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="h-8 bg-gray-200 rounded-sm w-full"></div>
                    <div className="h-8 bg-gray-200 rounded-sm w-[90%]"></div>
                    <div className="h-8 bg-gray-200 rounded-sm w-[95%]"></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="border border-gray-200 rounded-xl pt-6 pb-6 px-4 md:px-8 flex flex-col" style={{ backgroundColor: '#fffbf4' }}>
            <Heatmap 
              data={activity.heatmap || []} 
              totalIssues={activity.totalIssuesClosed || dashData?.totalDone || 0}
              activeDays={activity.heatmap?.filter(d => d.count > 0)?.length || 0}

            />
          </div>

          {/* Bottom Tabs */}
          <div className="border border-gray-200 rounded-xl p-6" style={{ backgroundColor: '#fffbf4' }}>
            <div className="flex gap-8 border-b border-gray-200 pb-4 mb-4">
              {['Saved', 'Open PR', 'Closed PRs'].map(tab => (
                <button 
                  key={tab}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                  className={`flex items-center gap-2 text-sm font-medium ${activeTab === tab ? 'text-black' : 'text-[var(--color-dashboard-muted)]'}`}
                >
                  {tab === 'Open PR' && <span className="text-lg">⑂</span>}
                  {tab === 'Closed PRs' && <span className="text-lg opacity-60">⑂</span>}
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="space-y-3">
              {(dashData?.issues || []).map((issue, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-md border border-gray-100" style={{ backgroundColor: '#fff' }}>
                  <span className="text-sm font-medium uppercase">{issue.repo_name} - {issue.issue_title}</span>
                  <a href={issue.issue_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black">
                    ↗
                  </a>
                </div>
              ))}
              {dashData?.issues?.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No repos to show.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
