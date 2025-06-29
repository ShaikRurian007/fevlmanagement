import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  mode: 'light' | 'dark';
  features: Feature[];
  featuresInView: boolean;
  fadeInUp: any;
  staggerChildren: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ 
  mode, 
  features, 
  featuresInView, 
  fadeInUp, 
  staggerChildren, 
  sectionRef 
}) => (
  <Box
    component="section"
    ref={sectionRef}
    id="features"
    sx={{
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Container maxWidth={false} sx={{ px: { xs: 3, sm: 4, md: 6, lg: 8 }, mx: 0, width: '100%' }}>
      <motion.div
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div variants={fadeInUp}>
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
              Features
            </Typography>
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
              Everything you need to automate
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Powerful features designed to streamline your workflow and boost productivity
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={{ xs: 3, sm: 4, md: 4 }} sx={{ mx: 0, width: '100%' }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <motion.div variants={fadeInUp}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        fontSize: '3rem',
                        mb: 2,
                        display: 'block',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  </Box>
);

export default FeaturesSection;
