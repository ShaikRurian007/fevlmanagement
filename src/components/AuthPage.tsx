import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { googleAuthService, GoogleUser } from '../services/googleAuth';

interface AuthPageProps {
  mode: 'light' | 'dark';
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ mode, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');

  // Initialize Google Auth on component mount
  useEffect(() => {
    googleAuthService.initialize().catch(error => {
      console.error('Failed to initialize Google Auth:', error);
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'agreeToTerms' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (isSignUp) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(isSignUp ? 'Sign up successful' : 'Sign in successful', formData);
      
      // Mock user data - replace with real API response
      const mockUser = {
        id: '1',
        name: isSignUp ? `${formData.firstName} ${formData.lastName}` : 'John Doe',
        email: formData.email,
        role: 'Product Manager',
        avatar: 'https://i.pravatar.cc/150?u=' + formData.email,
      };
      
      // Handle successful authentication here
      onLoginSuccess(mockUser);
      onClose();
    }, 2000);
  };

  const handleSocialAuth = async (provider: string) => {
    if (provider === 'Google') {
      await handleGoogleAuth();
    } else {
      console.log(`${provider} authentication - not implemented yet`);
      setAuthError(`${provider} authentication is not implemented yet`);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError('');

      const googleUser: GoogleUser = await googleAuthService.signInWithGoogle();
      
      // Convert Google user to your app's user format
      const user = {
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        role: 'User', // Default role, you can modify this based on your needs
        avatar: googleUser.picture,
        provider: 'google',
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        emailVerified: googleUser.email_verified,
      };

      console.log('Google authentication successful:', user);
      
      // Handle successful authentication
      onLoginSuccess(user);
      onClose();
    } catch (error: any) {
      console.error('Google authentication failed:', error);
      setAuthError(error.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Background gradient shapes */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: -1,
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: mode === 'dark' 
              ? 'radial-gradient(circle at center, rgba(41, 151, 255, 0.1), rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle at center, rgba(0, 102, 204, 0.05), rgba(255, 255, 255, 0) 70%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '35%',
            height: '35%',
            borderRadius: '50%',
            background: mode === 'dark' 
              ? 'radial-gradient(circle at center, rgba(90, 200, 250, 0.08), rgba(0, 0, 0, 0) 70%)' 
              : 'radial-gradient(circle at center, rgba(175, 82, 222, 0.04), rgba(255, 255, 255, 0) 70%)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3 } }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Card
            sx={{
              bgcolor: mode === 'dark' ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 4,
              boxShadow: mode === 'dark' 
                ? '0 20px 40px rgba(0,0,0,0.3)' 
                : '0 20px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Close button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1,
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, pt: { xs: 6, sm: 7 } }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    background: mode === 'dark'
                      ? 'linear-gradient(90deg, #2997FF, #5AC8FA)'
                      : 'linear-gradient(90deg, #0066CC, #AF52DE)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                  {isSignUp ? 'Join thousands of teams using Fevl' : 'Sign in to your account'}
                </Typography>
              </Box>

              {/* Error Alert */}
              {authError && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3 }}
                  onClose={() => setAuthError('')}
                >
                  {authError}
                </Alert>
              )}

              {/* Social Authentication */}
              <Box sx={{ mb: 4 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={isGoogleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                  onClick={() => handleSocialAuth('Google')}
                  disabled={isGoogleLoading || isLoading}
                  sx={{
                    mb: 2,
                    py: 1.5,
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    '&:hover': {
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialAuth('GitHub')}
                  disabled={isGoogleLoading || isLoading}
                  sx={{
                    py: 1.5,
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    '&:hover': {
                      borderColor: mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  Continue with GitHub
                </Button>
              </Box>

              <Divider sx={{ mb: 4 }}>
                <Typography color="text.secondary" sx={{ px: 2 }}>
                  or
                </Typography>
              </Divider>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange('firstName')}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange('lastName')}
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: isSignUp ? 3 : 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange('agreeToTerms')}
                            sx={{
                              color: errors.agreeToTerms ? 'error.main' : 'inherit',
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: '0.9rem' }}>
                            I agree to the{' '}
                            <Link href="#" color="primary">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="#" color="primary">
                              Privacy Policy
                            </Link>
                          </Typography>
                        }
                        sx={{ mb: 2 }}
                      />
                      {errors.agreeToTerms && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {errors.agreeToTerms}
                        </Alert>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isSignUp && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Link href="#" color="primary" sx={{ fontSize: '0.9rem' }}>
                      Forgot password?
                    </Link>
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading || isGoogleLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: mode === 'dark'
                      ? 'linear-gradient(to right, #2997FF, #5AC8FA)'
                      : 'linear-gradient(to right, #0066CC, #AF52DE)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: mode === 'dark' 
                        ? '0 8px 25px rgba(41, 151, 255, 0.3)' 
                        : '0 8px 25px rgba(0, 102, 204, 0.2)',
                    },
                    '&:disabled': {
                      background: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      transform: 'none',
                    },
                  }}
                >
                  {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </Box>

              {/* Switch between Sign In/Sign Up */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography color="text.secondary">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setErrors({});
                      setFormData({
                        email: '',
                        password: '',
                        confirmPassword: '',
                        firstName: '',
                        lastName: '',
                        agreeToTerms: false,
                      });
                    }}
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthPage;
