import React, { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Paper,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import ProductShowcase from './components/ProductShowcase';
import CTASection from './components/CTASection';
import FeaturesSection from './components/FeaturesSection';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

// Type for theme mode
type ThemeMode = 'light' | 'dark';

// 3D Floating Particles Component
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
              ease: "easeInOut"
            }}
          />
        );
      })}
    </Box>
  );
};

// 3D geometric shapes component
const GeometricShapes: React.FC<{ mode: ThemeMode, scrollYProgress: any }> = ({ mode, scrollYProgress }) => {
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

// Main App Component
const App: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Refs for section animations
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 });
  
  const productRef = useRef<HTMLDivElement>(null);
  const productInView = useInView(productRef, { once: false, amount: 0.2 });
  
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.3 });

  // Handle scroll for navbar transparency and parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  // Parallax effect for background elements
  const bgParallax1 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgParallax2 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const bgParallax3 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  // Add spring physics to make parallax smoother
  const springBgParallax1 = useSpring(bgParallax1, { stiffness: 50, damping: 30 });
  const springBgParallax2 = useSpring(bgParallax2, { stiffness: 50, damping: 30 });
  const springBgParallax3 = useSpring(bgParallax3, { stiffness: 50, damping: 30 });

  // Handle successful login
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Toggle theme
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Create theme with Apple-inspired styling
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#2997FF' : '#0066CC',
      },
      secondary: {
        main: mode === 'dark' ? '#5AC8FA' : '#AF52DE',
      },
      background: {
        default: mode === 'dark' ? '#000000' : '#FFFFFF',
        paper: mode === 'dark' ? '#111111' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#1D1D1F',
        secondary: mode === 'dark' ? '#86868B' : '#6E6E73',
      },
    },
    typography: {
      fontFamily: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif`,
      h1: {
        fontWeight: 600,
        fontSize: '3.5rem',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2.75rem',
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 500,
        fontSize: '2.25rem',
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 500,
        fontSize: '1.75rem',
        letterSpacing: '-0.015em',
      },
      h6: {
        fontWeight: 500,
        fontSize: '1.25rem',
        letterSpacing: '-0.01em',
      },
      body1: {
        fontSize: '1.125rem',
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      },
      body2: {
        fontSize: '1rem',
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              transform: 'scale(1.01)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'dark' ? '#333' : '#ddd',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: mode === 'dark' ? '#111' : '#f5f5f5',
            },
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, #000000, #080B18)'
              : 'linear-gradient(135deg, #FFFFFF, #F6F9FC)',
            backgroundAttachment: 'fixed',
          },
        },
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      title: 'Intelligent Task Creation',
      description: 'Describe your task in natural language and our AI will set it up across all your platforms instantly.',
      icon: '🔄',
    },
    {
      title: 'Seamless Notifications',
      description: 'Get beautifully designed alerts that intelligently notify you when tasks need attention.',
      icon: '📱',
    },
    {
      title: 'Integration Ecosystem',
      description: 'Connect with all major productivity tools in one unified workflow experience.',
      icon: '🔗',
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0], // Apple-style easing
      } 
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Show Dashboard if authenticated, otherwise show landing page */}
      {isAuthenticated ? (
        <Dashboard mode={mode} user={user} onLogout={handleLogout} />
      ) : (
        <>
          {/* Background gradient shapes that move on scroll */}
          <Box 
            sx={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -2,
              overflow: 'hidden',
            }}
          >
            {/* Animated background gradients */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '50%',
                height: '50%',
                borderRadius: '50%',
                background: mode === 'dark' 
                  ? 'radial-gradient(circle at center, rgba(41, 151, 255, 0.15), rgba(0, 0, 0, 0) 70%)' 
                  : 'radial-gradient(circle at center, rgba(0, 102, 204, 0.07), rgba(255, 255, 255, 0) 70%)',
                y: springBgParallax1,
              }}
            />
            <motion.div
              style={{
                position: 'absolute',
                bottom: '-5%',
                right: '-10%',
                width: '45%',
                height: '45%',
                borderRadius: '50%',
                background: mode === 'dark' 
                  ? 'radial-gradient(circle at center, rgba(90, 200, 250, 0.1), rgba(0, 0, 0, 0) 70%)' 
                  : 'radial-gradient(circle at center, rgba(175, 82, 222, 0.06), rgba(255, 255, 255, 0) 70%)',
                y: springBgParallax2,
              }}
            />
            <motion.div
              style={{
                position: 'absolute',
                top: '40%',
                right: '15%',
                width: '35%',
                height: '35%',
                borderRadius: '50%',
                background: mode === 'dark' 
                  ? 'radial-gradient(circle at center, rgba(80, 70, 180, 0.08), rgba(0, 0, 0, 0) 70%)' 
                  : 'radial-gradient(circle at center, rgba(120, 80, 220, 0.05), rgba(255, 255, 255, 0) 70%)',
                y: springBgParallax3,
              }}
            />
          </Box>
          
          {/* 3D floating elements to enhance depth */}
          <FloatingParticles mode={mode} />
          <GeometricShapes mode={mode} scrollYProgress={scrollYProgress} />
          
          <Box sx={{ 
            position: 'relative',
            bgcolor: 'transparent', 
            color: 'text.primary',
            minHeight: '100vh',
            overflow: 'hidden',
            zIndex: 1,
          }}>
            {/* Use custom Header component */}
            <Header
              mode={mode}
              toggleTheme={toggleTheme}
              isMobile={isMobile}
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              scrolled={scrolled}
              theme={theme}
              onAuthClick={() => setAuthOpen(true)}
            />

            {/* Hero Section */}
            <HeroSection
              mode={mode}
              heroScale={heroScale}
              heroOpacity={heroOpacity}
              email={email}
              setEmail={setEmail}
              submitted={submitted}
              setSubmitted={setSubmitted}
              isMobile={isMobile}
              fadeInUp={fadeInUp}
            />

            {/* Features Section */}
            <FeaturesSection
              mode={mode}
              features={features}
              featuresInView={featuresInView}
              fadeInUp={fadeInUp}
              staggerChildren={staggerChildren}
              sectionRef={featuresRef as React.RefObject<HTMLDivElement>}
            />

            {/* Product Showcase Section */}
            <ProductShowcase
              mode={mode}
              inView={productInView}
              fadeInUp={fadeInUp}
              sectionRef={productRef as React.RefObject<HTMLDivElement>}
            />

            {/* CTA Section */}
            <CTASection
              mode={mode}
              inView={ctaInView}
              fadeInUp={fadeInUp}
              sectionRef={ctaRef as React.RefObject<HTMLDivElement>}
            />

            {/* Footer with subtle 3D elements */}
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
              {/* Subtle 3D footer background elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                  background: mode === 'dark'
                    ? 'radial-gradient(circle at 20% 80%, rgba(41, 151, 255, 0.03), rgba(0, 0, 0, 0) 40%)'
                    : 'radial-gradient(circle at 20% 80%, rgba(0, 102, 204, 0.02), rgba(255, 255, 255, 0) 40%)',
                }}
              />
              
              <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    textAlign: { xs: 'center', md: 'left' },
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ mb: { xs: 4, md: 0 } }}>
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
                        textShadow: mode === 'dark'
                          ? '0 2px 4px rgba(0,0,0,0.2)'
                          : '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      Fevl
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ maxWidth: '300px', mx: { xs: 'auto', md: 0 } }}
                    >
                      Automate your workflow with intelligence and elegance.
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: 4, md: 6, lg: 8 },
                      justifyContent: { xs: 'center', md: 'flex-end' },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Product
                      </Typography>
                      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                        {['Features', 'Solutions', 'Integrations', 'Enterprise', 'Security'].map((item) => (
                          <Box component="li" key={item} sx={{ mb: 1 }}>
                            <Button
                              color="inherit"
                              sx={{
                                p: 0,
                                minWidth: 'auto',
                                color: 'text.secondary',
                                fontSize: '0.9rem',
                                fontWeight: 400,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: 'primary.main',
                                  transform: 'translateX(3px)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {item}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Company
                      </Typography>
                      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                        {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                          <Box component="li" key={item} sx={{ mb: 1 }}>
                            <Button
                              color="inherit"
                              sx={{
                                p: 0,
                                minWidth: 'auto',
                                color: 'text.secondary',
                                fontSize: '0.9rem',
                                fontWeight: 400,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: 'primary.main',
                                  transform: 'translateX(3px)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {item}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Resources
                      </Typography>
                      <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                        {['Documentation', 'Guides', 'API', 'Status', 'Community'].map((item) => (
                          <Box component="li" key={item} sx={{ mb: 1 }}>
                            <Button
                              color="inherit"
                              sx={{
                                p: 0,
                                minWidth: 'auto',
                                color: 'text.secondary',
                                fontSize: '0.9rem',
                                fontWeight: 400,
                                '&:hover': {
                                  backgroundColor: 'transparent',
                                  color: 'primary.main',
                                  transform: 'translateX(3px)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {item}
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    mt: 6,
                    pt: 3,
                    borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{ fontSize: '0.875rem', mb: { xs: 2, sm: 0 } }}
                  >
                    &copy; 2025 Fevl, Inc. All rights reserved.
                  </Typography>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 3,
                    }}
                  >
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
                </Box>
              </Container>
            </Box>
          </Box>
        </>
      )}

      {/* Auth Page Modal */}
      {authOpen && (
        <AuthPage
          mode={mode}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </ThemeProvider>
  );
};

export default App;