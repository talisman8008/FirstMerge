import { motion } from 'framer-motion';

export default function Aurora({ color = "var(--accent-blue)", className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] aspect-square rounded-full opacity-[0.15] blur-[100px]"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
        }}
        animate={{
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.15, 0.25, 0.1, 0.2, 0.15],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-[30%] left-[30%] w-[60%] max-w-[600px] aspect-square rounded-full opacity-[0.1] blur-[120px]"
        style={{
          background: `radial-gradient(circle, var(--accent-green) 0%, transparent 70%)`
        }}
        animate={{
          scale: [0.8, 1.1, 0.9, 1.2, 0.8],
          x: [0, 50, -50, 20, 0],
          y: [0, -30, 40, -10, 0]
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
