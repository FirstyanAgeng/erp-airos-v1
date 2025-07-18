import React from 'react';
import { Box, Typography } from '@mui/material';

const AirosLogo = ({ 
  size = 'medium', 
  variant = 'full', 
  color = 'primary',
  sx = {} 
}) => {
  const sizeMap = {
    small: { logoSize: 32, fontSize: '1rem' },
    medium: { logoSize: 40, fontSize: '1.25rem' },
    large: { logoSize: 60, fontSize: '1.5rem' },
    xlarge: { logoSize: 80, fontSize: '2rem' }
  };

  const colorMap = {
    primary: '#1a237e',
    white: '#ffffff',
    dark: '#212121'
  };

  const { logoSize, fontSize } = sizeMap[size];
  const logoColor = colorMap[color];

  if (variant === 'icon') {
    return (
      <Box
        sx={{
          width: logoSize,
          height: logoSize,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(26, 35, 126, 0.3)',
          ...sx
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 700,
            fontSize: fontSize
          }}
        >
          A
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <Box
        sx={{
          width: logoSize,
          height: logoSize,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          boxShadow: '0 4px 20px rgba(26, 35, 126, 0.3)'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 700,
            fontSize: fontSize
          }}
        >
          A
        </Typography>
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          color: logoColor,
          fontWeight: 700,
          fontSize: fontSize
        }}
      >
        AIROS ERP
      </Typography>
    </Box>
  );
};

export default AirosLogo; 