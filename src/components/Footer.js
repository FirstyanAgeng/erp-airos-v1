import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import AirosLogo from './AirosLogo';

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <AirosLogo 
          size="small" 
          variant="full" 
          color="white"
          sx={{ 
            '& .MuiTypography-root': { 
              color: 'white !important' 
            } 
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
        © 2025 AIROS.id - Advanced Enterprise Resource Planning System
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        Built with modern technologies for optimal performance and user experience
      </Typography>
    </Box>
  );
};

export default Footer; 