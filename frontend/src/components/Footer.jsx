import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);



export default function Footer() {
  const [theme, setTheme] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('light') ? 'light' : 'dark'
  );

  useEffect(() => {
    // Sync the initial theme immediately on mount in case we missed Navbar's setup
    const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full bg-[var(--bg-primary)] border-t border-[var(--border)] pt-16 pb-8 relative z-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <img
              src={theme === 'light' ? "/logos/firstmerge-logo.svg" : "/logos/firstmerge-logo-dark-bg.svg"}
              alt="FirstMerge Logo"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <p className="text-[14px] text-[var(--text-muted)] max-w-sm mb-6 leading-relaxed">
            Helping developers make their very first open-source contribution through AI-curated issues, step-by-step roadmaps, and PR analysis.
          </p>
          <div className="flex items-center gap-4 text-[var(--text-faint)]">
            <a href="https://github.com/talisman8008/FirstMerge" target="_blank" rel="noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
              <GitHubIcon />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="col-span-1 flex flex-col gap-3">
          <h4 className="font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">Product</h4>
          <Link to="/explore" className="font-sans text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Explore Issues</Link>
          <Link to="/dashboard" className="font-sans text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
          <a href="#" className="font-sans text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Chrome Extension</a>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <h4 className="font-mono text-[12px] font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1">Contact</h4>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[14px] font-medium text-[var(--text-primary)]">Devesh Hegde</span>
            <a href="https://www.linkedin.com/in/devesh-hegde-91506138b/" target="_blank" rel="noreferrer" className="font-sans text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">LinkedIn Profile</a>
            <a href="mailto:deveshhegde04@gmail.com" className="font-sans text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">deveshhegde04@gmail.com</a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-[14px] font-medium text-[var(--text-primary)]">Ankita Dharmani</span>
            <a href="https://www.linkedin.com/in/ankita-dharmani/" target="_blank" rel="noreferrer" className="font-sans text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">LinkedIn Profile</a>
            <a href="mailto:anki.dharmani@gmail.com" className="font-sans text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">anki.dharmani@gmail.com</a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-[12px] text-[var(--text-faint)]">
          &copy; {new Date().getFullYear()} FirstMerge. Made for Hackverse 2026.
        </p>
        <p className="font-sans text-[12px] text-[var(--text-muted)] flex items-center gap-1">
          Made with <span className="text-[var(--accent-purple)]">♥</span> by Team Amor Fati.
        </p>
      </div>
    </footer>
  );
}
