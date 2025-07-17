import React from "react";
import { motion } from "framer-motion";

const Particles = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return null;
  }
  const particles = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="particle absolute w-4 h-4 bg-cyan-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.7, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Particles; 