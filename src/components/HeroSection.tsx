import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  mode: 'light' | 'dark';
  heroScale: any;
  heroOpacity: any;
  email: string;
  setEmail: (email: string) => void;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
  isMobile: boolean;
  fadeInUp: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mode, heroScale, heroOpacity, email, setEmail, submitted, setSubmitted, isMobile, fadeInUp }) => (
  <Box
    component="section"
    sx={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      pt: { xs: 10, md: 0 },
      mb: 0,
    }}
  >
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
      <motion.div style={{ scale: heroScale, opacity: heroOpacity }}>
        <Box sx={{ textAlign: 'center', maxWidth: '860px', mx: 'auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.75rem' }, lineHeight: 1.1, mb: 3, background: mode === 'dark' ? 'linear-gradient(135deg, #FFFFFF 0%, #AAAAAA 100%)' : 'linear-gradient(135deg, #1D1D1F 0%, #434344 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Automate Your Entire Workflow With Intelligence
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' }, opacity: 0.8, px: { xs: 1, sm: 2 } }}>
              From creative thinking to task completion — your team's productivity, reimagined through beautiful automation.
            </Typography>
            <Box component="form" onSubmit={e => e.preventDefault()} display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} sx={{ maxWidth: '560px', mx: 'auto' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ position: 'relative', width: '100%', padding: '16px 20px', borderRadius: 20, border: 'none', backgroundColor: mode === 'dark' ? '#1A1A1A' : '#f5f5f5', color: mode === 'dark' ? '#fff' : '#1D1D1F', outline: 'none', fontSize: '1rem' }}
              />
              <Button variant="contained" color="primary" size="large" onClick={() => { if (email.trim()) { setSubmitted(true); setEmail(''); } }} sx={{ borderRadius: 2, py: { xs: 1.5, md: 1.8 }, px: { xs: 2, md: 3 }, fontSize: { xs: '0.9rem', md: '1rem' }, position: 'relative', overflow: 'hidden', background: mode === 'dark' ? 'linear-gradient(to right, #2997FF, #5AC8FA)' : 'linear-gradient(to right, #0066CC, #AF52DE)', whiteSpace: 'nowrap' }}>
                Join Beta
              </Button>
            </Box>
            {submitted && <Typography color="primary" sx={{ mt: 2, fontWeight: 500, opacity: 0.9 }}>Thanks for joining! We'll be in touch soon.</Typography>}
          </motion.div>
        </Box>
      </motion.div>
    </Container>
    {/* Scroll indicator */}
    <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 0.7 }}>
      <motion.div animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 1, fontSize: '0.85rem' }}>Scroll to explore</Typography>
        <Box sx={{ width: '28px', height: '44px', border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`, borderRadius: '14px', mx: 'auto', position: 'relative', '&::before': { content: '""', position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', animation: 'scroll 2s ease infinite' }, '@keyframes scroll': { '0%': { top: '8px', opacity: 1 }, '100%': { top: '28px', opacity: 0 } } }} />
      </motion.div>
    </Box>
  </Box>
);

export default HeroSection;
