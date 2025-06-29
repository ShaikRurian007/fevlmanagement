import React from 'react';
import { AppBar, Toolbar, Container, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PersonIcon from '@mui/icons-material/Person';

// If ThemeMode is a value, use a string union type for mode
type ThemeModeType = 'light' | 'dark';

interface HeaderProps {
  mode: ThemeModeType;
  toggleTheme: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  scrolled: boolean;
  theme: any;
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, toggleTheme, isMobile, mobileOpen, setMobileOpen, scrolled, theme, onAuthClick }) => (
  <AppBar 
    position="fixed" 
    color="transparent" 
    elevation={0} 
    sx={{ 
      py: 1,
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      backgroundColor: scrolled 
        ? `${theme.palette.background.default}${mode === 'dark' ? 'b3' : 'b3'}` // 70% opacity
        : 'transparent',
      borderBottom: scrolled 
        ? `1px solid ${theme.palette.divider}1a` // 10% opacity
        : 'none',
      transition: 'all 0.3s ease',
      zIndex: 10,
    }}
  >
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: 0 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.3rem', sm: '1.5rem' },
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #2997FF, #5AC8FA)' 
              : 'linear-gradient(90deg, #0066CC, #AF52DE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Fevl
        </Typography>
        {/* Desktop Nav */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2.5, lg: 3 } }}>
            {/* Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2.5, lg: 3 } }}>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.85, '&:hover': { opacity: 1 } }} href="#features">Product</Button>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.85, '&:hover': { opacity: 1 } }} href="#solutions">Solutions</Button>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.85, '&:hover': { opacity: 1 } }} href="#pricing">Pricing</Button>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.9rem', opacity: 0.85, '&:hover': { opacity: 1 } }} href="#company">Company</Button>
            </Box>
            
            {/* Auth Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2.5, lg: 3 } }}>
              <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={onAuthClick}
                sx={{
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  color: mode === 'dark' ? 'white' : 'inherit',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  px: 2,
                  py: 0.8,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        )}
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={onAuthClick}
              size="small"
              sx={{
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                color: mode === 'dark' ? 'white' : 'inherit',
                fontWeight: 500,
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                minWidth: 'auto',
                '&:hover': {
                  borderColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            >
              Sign In
            </Button>
            
            <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </Container>
    <Drawer 
      anchor="right" 
      open={mobileOpen} 
      onClose={() => setMobileOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '80%', sm: '70%' },
          maxWidth: '300px',
          bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderLeft: `1px solid ${theme.palette.divider}1a`,
        }
      }}
    >
      <Box sx={{ pt: 8, pb: 2, px: 2, borderBottom: `1px solid ${theme.palette.divider}1a` }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, #2997FF, #5AC8FA)' 
              : 'linear-gradient(90deg, #0066CC, #AF52DE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Fevl
        </Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#features" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Product" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#solutions" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Solutions" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#pricing" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Pricing" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#company" onClick={() => setMobileOpen(false)}>
            <ListItemText primary="Company" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mt: 2, px: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => {
              setMobileOpen(false);
              onAuthClick();
            }}
            sx={{
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              color: mode === 'dark' ? 'white' : 'inherit',
              fontWeight: 500,
              py: 1,
              borderRadius: 2,
              '&:hover': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              },
            }}
          >
            Sign In
          </Button>
        </ListItem>
      </List>
    </Drawer>
  </AppBar>
);

export default Header;
