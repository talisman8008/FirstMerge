import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const screenshots = [
  { src: '/screenshots/58b8bdf2-2546-4768-95e8-ff29d608a83a.jpg', alt: 'Screenshot 1', caption: 'Reddit post — Beginner struggling to find projects to contribute to' },
  { src: '/screenshots/86089123-19df-488a-8b9f-e63a8da82a5a.jpg', alt: 'Screenshot 2', caption: 'Tweet — PR spam destroying open source credibility' },
  { src: '/screenshots/f4f6cec9cb761109ef05f697fada89293d384351-958x627.avif', alt: 'Screenshot 3', caption: 'The Apna College effect — repos flooded with copy-paste README PRs' },
  { src: '/screenshots/gsoc_mentor_suggestion.jpg', alt: 'Screenshot 4', caption: 'GSoC mentor suggesting AI-assisted PR guidance for beginners' },
  { src: '/screenshots/tweet_farming_prs.png', alt: 'Screenshot 5', caption: 'Tweet — Contributors farming issues with raw ChatGPT output as PRs' },
];

const HorizontalScroller = () => {
  const sectionRef = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [topOffset, setTopOffset] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Smooth spring
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  // Horizontal slide: maps scroll progress to horizontal translation
  const x = useTransform(smooth, [0, 1], ["0%", "-75%"]);

  // Fade in at start, fade out at end
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.3, 1, 1, 0.3]);

  // Use IntersectionObserver + scroll tracking for pinning
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const viewportHeight = window.innerHeight;

      // Pin when section top is at or above viewport top, 
      // and section bottom is below viewport bottom
      if (sectionTop <= 0 && sectionBottom >= viewportHeight) {
        setPinned(true);
      } else {
        setPinned(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: '250vh' }}>
      {/* The pinned content */}
      <div
        className="w-full h-screen flex flex-col justify-center bg-[var(--bg-primary)]"
        style={{
          position: pinned ? 'fixed' : 'relative',
          top: pinned ? 0 : 'auto',
          left: 0,
          right: 0,
          zIndex: 30,
        }}
      >
        <motion.div style={{ opacity }}>
          {/* Title */}
          <h2 className="font-display text-[40px] md:text-[56px] font-bold text-[var(--text-primary)] leading-tight text-center mb-8 md:mb-12 px-6">
            What <span className="text-[var(--accent-orange)]">motivated</span> us.
          </h2>

          {/* Horizontal track */}
          <div className="overflow-hidden">
            <motion.div
              style={{ x }}
              className="flex gap-8 md:gap-12 items-center w-max pl-[8vw] relative"
            >
              {/* Straight line */}
              <div className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-blue)] to-[var(--accent-green)] opacity-20 pointer-events-none" style={{ width: '300vw' }} />

              {screenshots.map((shot, i) => (
                <div key={i} className="relative flex-shrink-0">
                  <div className="h-[200px] md:h-[300px] w-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                    <img src={shot.src} alt={shot.alt} className="h-full w-auto object-contain" loading="eager" />
                  </div>
                  <p className="mt-3 text-center font-display text-[13px] md:text-[15px] text-[var(--text-muted)] italic max-w-[400px]">
                    {shot.caption}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScroller;
