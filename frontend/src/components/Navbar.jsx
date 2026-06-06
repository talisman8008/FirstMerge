import { NavLink } from 'react-router-dom'

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const navLinkClass = ({ isActive }) =>
  `text-sm transition-all duration-200 ${
    isActive
      ? 'text-[#238636]'
      : 'text-[#8b949e] hover:text-[#f0f6fc]'
  }`

export default function Navbar({ user, signIn, signOut }) {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-[#30363d]">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* Wordmark */}
        <NavLink
          to="/"
          id="nav-wordmark"
          className="text-sm font-bold tracking-widest text-[#238636] flex-shrink-0"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          FIRSTMERGE
        </NavLink>

        {/* Nav links — only when logged in */}
        {user && (
          <div className="flex items-center gap-6">
            <NavLink to="/explore" id="nav-explore" className={navLinkClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Explore
            </NavLink>
            <NavLink to="/prcheck" id="nav-prcheck" className={navLinkClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              PR Check
            </NavLink>
            <NavLink to="/dashboard" id="nav-dashboard" className={navLinkClass} style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Dashboard
            </NavLink>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {user ? (
            <>
              {/* Avatar + username */}
              <div className="flex items-center gap-2">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.user_name ?? 'avatar'}
                    className="w-7 h-7 rounded-full border border-[#30363d]"
                  />
                )}
                <span
                  className="text-sm text-[#f0f6fc] hidden sm:inline"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {user.user_metadata?.user_name ?? user.email}
                </span>
              </div>

              {/* Sign out */}
              <button
                id="navbar-signout-btn"
                onClick={signOut}
                className="text-xs text-[#8b949e] hover:text-[#f0f6fc] border border-[#30363d] rounded-md px-3 py-1.5 transition-all duration-200 hover:bg-[#161b22]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              id="navbar-login-btn"
              onClick={signIn}
              className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold rounded-md px-3 py-1.5 transition-all duration-200"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <GitHubIcon />
              Login with GitHub
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}
