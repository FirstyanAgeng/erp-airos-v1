import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Notifications,
  Warning,
  Info,
  CheckCircle,
  Error,
  Close,
  Refresh
} from '@mui/icons-material';
import api from '../config/api';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const fetchNotifications = async () => {
    try {
      const [lowStockRes, ordersRes] = await Promise.all([
        api.get('/api/products/alerts/low-stock'),
        api.get('/api/orders?status=pending')
      ]);

      const newNotifications = [];

      // Low stock alerts
      if (lowStockRes.data.length > 0) {
        newNotifications.push({
          id: 'low-stock',
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${lowStockRes.data.length} products are running low on stock`,
          count: lowStockRes.data.length,
          timestamp: new Date()
        });
      }

      // Pending orders
      if (ordersRes.data.length > 0) {
        newNotifications.push({
          id: 'pending-orders',
          type: 'info',
          title: 'Pending Orders',
          message: `${ordersRes.data.length} orders are pending approval`,
          count: ordersRes.data.length,
          timestamp: new Date()
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    handleMenuClose();
    
    // Show snackbar with notification details
    setSnackbar({
      open: true,
      message: notification.message,
      severity: notification.type
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'success': return <CheckCircle color="success" />;
      default: return <Info color="info" />;
    }
  };

  const totalNotifications = notifications.reduce((sum, notif) => sum + notif.count, 0);

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          background: totalNotifications > 0 
            ? 'linear-gradient(135deg, #ff6f00 0%, #ffa040 100%)'
            : 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          color: 'white',
          '&:hover': {
            background: totalNotifications > 0
              ? 'linear-gradient(135deg, #c43e00 0%, #ff6f00 100%)'
              : 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
          }
        }}
      >
        <Badge badgeContent={totalNotifications} color="error">
          <Notifications />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
              Notifications
            </Typography>
            <IconButton size="small" onClick={fetchNotifications}>
              <Refresh />
            </IconButton>
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No notifications at the moment
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ px: 2, py: 1.5 }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.count} 
                          size="small"
                          color={notification.type}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {notification.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationSystem; 