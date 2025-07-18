import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Tooltip
} from '@mui/material';
import {
  Add,
  ShoppingCart,
  Inventory,
  People,
  Business,
  Assessment,
  Receipt,
  LocalShipping
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Order',
      description: 'Create a new customer order',
      icon: <ShoppingCart />,
      color: '#ed6c02',
      path: '/orders',
      action: 'create'
    },
    {
      title: 'Add Product',
      description: 'Add a new product to inventory',
      icon: <Inventory />,
      color: '#2e7d32',
      path: '/products',
      action: 'create'
    },
    {
      title: 'New User',
      description: 'Create a new user account',
      icon: <People />,
      color: '#1976d2',
      path: '/users',
      action: 'create'
    },
    {
      title: 'Add Supplier',
      description: 'Add a new supplier',
      icon: <Business />,
      color: '#9c27b0',
      path: '/suppliers',
      action: 'create'
    },
    {
      title: 'View Reports',
      description: 'Access detailed reports',
      icon: <Assessment />,
      color: '#d32f2f',
      path: '/dashboard',
      action: 'view'
    },
    {
      title: 'Process Orders',
      description: 'Manage pending orders',
      icon: <LocalShipping />,
      color: '#f57c00',
      path: '/orders',
      action: 'manage'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action.path);
  };

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      border: '1px solid rgba(0,0,0,0.04)',
      mb: 3
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Tooltip title={action.description}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={() => handleActionClick(action)}
                  sx={{
                    p: 2,
                    height: 'auto',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    borderColor: `${action.color}30`,
                    color: action.color,
                    '&:hover': {
                      borderColor: action.color,
                      backgroundColor: `${action.color}10`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${action.color}20`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                    <Box sx={{ 
                      color: action.color,
                      mr: 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {action.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'left' }}>
                    {action.description}
                  </Typography>
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions; 