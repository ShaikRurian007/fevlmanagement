import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CTASectionProps {
  mode: 'light' | 'dark';
  inView: boolean;
  fadeInUp: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const CTASection: React.FC<CTASectionProps> = ({ mode, inView, fadeInUp, sectionRef }) => (
  <Box
    component="section"
    ref={sectionRef}
    sx={{
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '600px', mx: 'auto' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Ready to transform your workflow?
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
            }}
          >
            Join thousands of teams already using Fevl to automate their processes
            and boost productivity.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              background: mode === 'dark'
                ? 'linear-gradient(to right, #2997FF, #5AC8FA)'
                : 'linear-gradient(to right, #0066CC, #AF52DE)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: mode === 'dark' 
                  ? '0 8px 25px rgba(41, 151, 255, 0.3)' 
                  : '0 8px 25px rgba(0, 102, 204, 0.2)',
              },
            }}
          >
            Start Free Trial
          </Button>
        </Box>
      </motion.div>
    </Container>
  </Box>
);

export default CTASection;
