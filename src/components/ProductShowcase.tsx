import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';

interface ProductShowcaseProps {
  mode: 'light' | 'dark';
  inView: boolean;
  fadeInUp: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ mode, inView, fadeInUp, sectionRef }) => (
  <Box
    component="section"
    ref={sectionRef}
    sx={{
      py: { xs: 10, md: 14 },
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: mode === 'dark'
          ? 'linear-gradient(135deg, rgba(41,151,255,0.05), rgba(90,200,250,0.02))'
          : 'linear-gradient(135deg, rgba(0,102,204,0.03), rgba(175,82,222,0.015))',
        opacity: inView ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: -1,
      }}
    />
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 8, md: 6 },
        }}
      >
        {/* Text Content */}
        <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <Typography
              component="span"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'primary.main',
                mb: 2,
                display: 'inline-block',
              }}
            >
              Beautiful Interface
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 3,
                lineHeight: 1.2,
                textShadow: mode === 'dark'
                  ? '0 2px 5px rgba(0,0,0,0.3)'
                  : '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              Design that works the way you think
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6,
              }}
            >
              Fevl's interface adapts to your workflow with an intelligent, clean design 
              that feels natural and intuitive. We've obsessively crafted every detail 
              to create a tool that disappears when you use it.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  background: mode === 'dark'
                    ? 'linear-gradient(to right, #2997FF, #5AC8FA)'
                    : 'linear-gradient(to right, #0066CC, #AF52DE)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'all 0.6s ease',
                  },
                  '&:hover': {
                    boxShadow: mode === 'dark' 
                      ? '0 8px 25px rgba(41, 151, 255, 0.3)' 
                      : '0 8px 25px rgba(0, 102, 204, 0.2)',
                    transform: 'translateY(-2px)',
                    '&::before': {
                      left: '100%',
                    }
                  },
                }}
              >
                Get Early Access
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                    backgroundColor: 'transparent',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </motion.div>
        </Box>
        {/* Product Image/Mockup with 3D effect */}
        <Box 
          sx={{ 
            flex: 1,
            order: { xs: 1, md: 2 },
            width: '100%', 
            position: 'relative',
          }}
        >
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInUp}
            whileHover={{ 
              rotateY: 5, 
              rotateX: -5,
              transition: { duration: 0.5 }
            }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
          >
            <Box
              sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: mode === 'dark'
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(41, 151, 255, 0.2)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 30px rgba(0, 102, 204, 0.1)',
                bgcolor: mode === 'dark' ? '#111' : '#fff',
                border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                transform: 'translateZ(0)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent, transparent)',
                  zIndex: 1,
                }
              }}
            >
              <Box
                component="div"
                sx={{
                  width: '100%',
                  height: 0,
                  paddingBottom: '70%',
                  background: mode === 'dark'
                    ? 'linear-gradient(45deg, #111, #1A1A1A)'
                    : 'linear-gradient(45deg, #f5f5f5, #FFFFFF)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                {/* Product mockup area (customize as needed) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '80%',
                    height: '80%',
                    borderRadius: 2,
                    background: mode === 'dark'
                      ? 'linear-gradient(135deg, #2997FF20, #5AC8FA10)'
                      : 'linear-gradient(135deg, #0066CC10, #AF52DE10)',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    transform: 'translateZ(5px)',
                    boxShadow: mode === 'dark'
                      ? '0 5px 15px rgba(0,0,0,0.4)'
                      : '0 5px 15px rgba(0,0,0,0.05)',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '8%',
                      borderRadius: 1,
                      mb: 2,
                      background: mode === 'dark' ? '#222' : '#eee',
                      transform: 'translateZ(10px)',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default ProductShowcase;
