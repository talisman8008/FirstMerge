import { motion } from 'framer-motion';

export default function MergeField({ className = "" }) {
  // A tightly-woven, highly realistic Git Network Graph.
  const commits = [
    // Main Trunk (Purple) at X=800
    { cx: 800, cy: 150, color: "url(#purpleGrad)", hash: "init" },
    { cx: 800, cy: 450, color: "url(#purpleGrad)", hash: "b4f2a9" },
    { cx: 800, cy: 1100, color: "url(#purpleGrad)", hash: "Merge feat/auth", isMerge: true },
    { cx: 800, cy: 1300, color: "url(#purpleGrad)", hash: "v1.0.0" },

    // Blue Feature Branch at X=950
    { cx: 950, cy: 350, color: "url(#blueGrad)", hash: "feat/auth" },
    { cx: 950, cy: 600, color: "url(#blueGrad)", hash: "8c1e3d" },
    { cx: 950, cy: 800, color: "url(#blueGrad)", hash: "Merge fix/ui", isMerge: true },
    { cx: 950, cy: 950, color: "url(#blueGrad)", hash: "a1b2c3" },

    // Green Bugfix Branch at X=1100
    { cx: 1100, cy: 550, color: "url(#greenGrad)", hash: "fix/ui" },
    { cx: 1100, cy: 700, color: "url(#greenGrad)", hash: "e7b210" },
  ];

  // A perfectly straight vertical line (with .1 offset to prevent 0-width culling)
  const pathMain = "M 800 0 L 800.1 1400";
  const pathBlue = "M 800 200 C 800 250, 950 250, 950 300 L 950 1000 C 950 1050, 800 1050, 800 1100";
  const pathGreen = "M 950 400 C 950 450, 1100 450, 1100 500 L 1100 700 C 1100 750, 950 750, 950 800";

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center ${className}`}>
      
      <motion.svg
        className="absolute w-[1200px] h-[1400px] top-[0px] lg:left-[5%]"
        viewBox="0 0 1200 1400"
        fill="none"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <defs>
          <linearGradient id="purpleGrad" gradientUnits="userSpaceOnUse" x1="800" y1="0" x2="800" y2="1400">
            <stop offset="0%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="#4A43A6" />
          </linearGradient>
          <linearGradient id="blueGrad" gradientUnits="userSpaceOnUse" x1="800" y1="200" x2="950" y2="1100">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="greenGrad" gradientUnits="userSpaceOnUse" x1="950" y1="400" x2="1100" y2="800">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          {/* Using userSpaceOnUse ensures the filter bounding box never collapses to 0-width for straight vertical lines */}
          <filter id="premiumGlow" filterUnits="userSpaceOnUse" x="-500" y="-500" width="2200" height="2400">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- BACKGROUND SHADOW TRACKS FOR DEPTH --- */}
        <path d={pathMain} stroke="rgba(0,0,0,0.03)" strokeWidth="8" strokeLinecap="round" />
        <path d={pathBlue} stroke="rgba(0,0,0,0.03)" strokeWidth="8" strokeLinecap="round" />
        <path d={pathGreen} stroke="rgba(0,0,0,0.03)" strokeWidth="8" strokeLinecap="round" />

        {/* --- TRACKS (BRANCHES) --- */}
        <motion.path
          d={pathMain}
          stroke="url(#purpleGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#premiumGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />

        <motion.path
          d={pathBlue}
          stroke="url(#blueGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#premiumGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        <motion.path
          d={pathGreen}
          stroke="url(#greenGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#premiumGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
        />

        {/* --- COMMITS (NODES) --- */}
        {commits.map((commit, i) => {
          const nodeDelay = 1 + (commit.cy / 1400) * 1.5;
          const textX = commit.cx === 800 ? commit.cx - 40 : commit.cx + 40;
          const textAnchor = commit.cx === 800 ? "end" : "start";

          return (
            <g key={i}>
              {/* Outer Ring */}
              <motion.circle
                cx={commit.cx}
                cy={commit.cy}
                r={commit.isMerge ? "18" : "14"}
                fill="var(--bg-primary)"
                stroke={commit.color}
                strokeWidth="6"
                filter="url(#premiumGlow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: nodeDelay }}
              />
              
              {/* Inner Core */}
              <motion.circle
                cx={commit.cx}
                cy={commit.cy}
                r={commit.isMerge ? "8" : "6"}
                fill={commit.isMerge ? "var(--bg-primary)" : commit.color}
                stroke={commit.isMerge ? commit.color : "none"}
                strokeWidth={commit.isMerge ? "4" : "0"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: nodeDelay + 0.2 }}
              />
              
              {/* Hash Text - Using native SVG text to guarantee rendering bypass of framer bugs */}
              <text
                x={textX}
                y={commit.cy + 6}
                fill="#6B7280"
                fontSize="16"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor={textAnchor}
                opacity="0"
              >
                {commit.hash}
                <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${nodeDelay + 0.2}s`} fill="freeze" />
              </text>
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}
