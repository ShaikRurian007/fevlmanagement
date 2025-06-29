import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
type ThemeMode = 'light' | 'dark';

const FloatingParticles: React.FC<{ mode: ThemeMode }> = ({ mode }) => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {particles.map((i) => {
        const size = Math.random() * 60 + 20;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              left: `${initialX}%`,
              top: `${initialY}%`,
              background: mode === 'dark'
                ? `radial-gradient(circle at 30% 30%, rgba(41, 151, 255, 0.08), rgba(41, 151, 255, 0.02))`
                : `radial-gradient(circle at 30% 30%, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.01))`,
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: 0,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              scale: [1, 1.1, 0.9, 1],
              opacity: [0.2, 0.5, 0.3, 0.2],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </Box>
  );
};

export default FloatingParticles;
