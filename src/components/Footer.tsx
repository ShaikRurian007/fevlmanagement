import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Footer: React.FC<{ mode: 'light' | 'dark' }> = ({ mode }) => (
  <Box
    component="footer"
    sx={{
      py: 6,
      bgcolor: mode === 'dark' ? 'rgba(10, 10, 10, 0.7)' : 'rgba(249, 250, 251, 0.7)',
      backdropFilter: 'blur(10px)',
      borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ textAlign: 'center', zIndex: 1 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          mb: 2,
          background: mode === 'dark'
            ? 'linear-gradient(90deg, #2997FF, #5AC8FA)'
            : 'linear-gradient(90deg, #0066CC, #AF52DE)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Fevl
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: '300px', mx: 'auto' }}>
        Automate your workflow with intelligence and elegance.
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3 }}>
        {['Privacy', 'Terms', 'Cookies'].map((item) => (
          <Button
            key={item}
            color="inherit"
            sx={{
              p: 0,
              minWidth: 'auto',
              color: 'text.secondary',
              fontSize: '0.875rem',
              fontWeight: 400,
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {item}
          </Button>
        ))}
      </Box>
      <Typography color="text.secondary" sx={{ fontSize: '0.875rem', mt: 3 }}>
        &copy; 2025 Fevl, Inc. All rights reserved.
      </Typography>
    </Box>
  </Box>
);

export default Footer;
