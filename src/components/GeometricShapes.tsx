import React from 'react';
import { Box } from '@mui/material';
import { motion, useSpring, useTransform } from 'framer-motion';
// Define ThemeMode type here or import the type if it exists in '../App'
type ThemeMode = 'light' | 'dark';

interface GeometricShapesProps {
  mode: ThemeMode;
  scrollYProgress: any;
}

const GeometricShapes: React.FC<GeometricShapesProps> = ({ mode, scrollYProgress }) => {
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const springRotate1 = useSpring(rotate1, { stiffness: 50, damping: 30 });
  const springRotate2 = useSpring(rotate2, { stiffness: 50, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 50, damping: 30 });
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
      {/* Large circle */}
      <motion.div
        style={{
          position: 'absolute',
          left: '15%',
          top: '30%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          border: `1px solid ${mode === 'dark' ? 'rgba(41, 151, 255, 0.1)' : 'rgba(0, 102, 204, 0.05)'}`,
          rotate: springRotate1,
          scale: springScale,
          opacity: 0.6,
        }}
      />
      {/* Rectangle */}
      <motion.div
        style={{
          position: 'absolute',
          right: '10%',
          bottom: '20%',
          width: '200px',
          height: '200px',
          borderRadius: '20px',
          border: `1px solid ${mode === 'dark' ? 'rgba(90, 200, 250, 0.1)' : 'rgba(175, 82, 222, 0.05)'}`,
          rotate: springRotate2,
          scale: springScale,
          opacity: 0.4,
        }}
      />
      {/* Triangle */}
      <motion.div
        style={{
          position: 'absolute',
          right: '30%',
          top: '15%',
          width: 0,
          height: 0,
          borderLeft: '100px solid transparent',
          borderRight: '100px solid transparent',
          borderBottom: `173px solid ${mode === 'dark' ? 'rgba(90, 200, 250, 0.05)' : 'rgba(175, 82, 222, 0.03)'}`,
          rotate: springRotate1,
          scale: springScale,
          opacity: 0.3,
          transformOrigin: 'center',
        }}
      />
    </Box>
  );
};

export default GeometricShapes;
