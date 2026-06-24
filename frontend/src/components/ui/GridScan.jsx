import { motion } from 'framer-motion';

export default function GridScan({ className = "", scanDuration = 4 }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      
      {/* Scanning Line */}
      <motion.div
        className="absolute w-full h-[2px] opacity-70"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--accent-blue), transparent)',
          boxShadow: '0px 2px 15px 1px var(--accent-blue)'
        }}
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: scanDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Ambient Glow for Scanner */}
      <motion.div
        className="absolute w-full h-[150px] opacity-20"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--accent-blue-dim), transparent)'
        }}
        animate={{
          top: ['-20%', '100%'],
        }}
        transition={{
          duration: scanDuration,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
