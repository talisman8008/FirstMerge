import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export default function DecryptedText({ 
  text, 
  speed = 50, 
  maxIterations = 10,
  className = "",
  animateOn = "hover", // 'hover' or 'view' or 'mount'
  revealDirection = "start" // 'start', 'center', 'end'
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    let iteration = 0;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText((prevText) =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            // Logic for revealing characters based on iteration and index
            let revealCondition = false;
            if (revealDirection === 'start') {
              revealCondition = index < iteration;
            } else if (revealDirection === 'end') {
              revealCondition = index > text.length - iteration;
            } else {
              // center reveal
              const mid = Math.floor(text.length / 2);
              revealCondition = Math.abs(index - mid) < iteration;
            }

            if (revealCondition) {
              return text[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join('')
      );

      if (iteration >= text.length + maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
      }
      
      // Increment iteration slightly slower than characters to give the scramble effect time
      iteration += 1/3;
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'mount') {
      startAnimation();
    }
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <motion.span
      className={`inline-block ${className}`}
      onHoverStart={animateOn === 'hover' ? startAnimation : undefined}
      whileInView={animateOn === 'view' ? startAnimation : undefined}
      viewport={{ once: true, margin: "-10%" }}
    >
      {displayText}
    </motion.span>
  );
}
