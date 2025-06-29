import React from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

const DebugPanel: React.FC = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  const isConfigured = !!(googleClientId && googleClientId !== 'your-google-client-id-here' && googleClientId.length > 0);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        p: 2, 
        zIndex: 9999, 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        color: 'white',
        maxWidth: 400
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>Debug Panel</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Google Client ID:</strong> {googleClientId ? `${googleClientId.substring(0, 20)}...` : 'NOT SET'}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Length:</strong> {googleClientId.length}
      </Typography>
      <Alert severity={isConfigured ? 'success' : 'error'} sx={{ mt: 1 }}>
        {isConfigured ? 'Google Auth is configured!' : 'Google Auth is NOT configured'}
      </Alert>
    </Paper>
  );
};

export default DebugPanel;
