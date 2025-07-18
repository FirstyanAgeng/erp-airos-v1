import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Breadcrumbs,
  Link,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Business,
  AccountCircle,
  Notifications,
  Settings,
  Logout,
  ChevronRight,
  Home,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AirosLogo from './AirosLogo';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
    badge: null
  },
  {
    text: 'Users',
    icon: <People />,
    path: '/users',
    badge: null
  },
  {
    text: 'Products',
    icon: <Inventory />,
    path: '/products',
    badge: null
  },
  {
    text: 'Orders',
    icon: <ShoppingCart />,
    path: '/orders',
    badge: null
  },
  {
    text: 'Suppliers',
    icon: <Business />,
    path: '/suppliers',
    badge: null
  }
];

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [
      <Link
        key="home"
        color="inherit"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <Home sx={{ mr: 0.5, fontSize: 16 }} />
        Home
      </Link>
    ];

    pathnames.forEach((name, index) => {
      const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      const menuItem = menuItems.find(item => 
        item.path === routeTo || item.path === `/${name}`
      );

      if (menuItem) {
        breadcrumbs.push(
          <Link
            key={name}
            color={isLast ? 'text.primary' : 'inherit'}
            href={routeTo}
            onClick={(e) => {
              e.preventDefault();
              if (!isLast) {
                navigate(routeTo);
              }
            }}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              fontWeight: isLast ? 600 : 400
            }}
          >
            {menuItem.text}
          </Link>
        );
      }
    });

    return breadcrumbs;
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <AirosLogo size="small" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            AIROS ERP
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Enterprise Resource Planning
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const hasBadge = item.badge && item.badge > 0;

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor: isActive ? 'rgba(26, 35, 126, 0.1)' : 'transparent',
                    color: isActive ? '#1a237e' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(26, 35, 126, 0.15)' 
                        : 'rgba(0, 0, 0, 0.04)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: isActive ? '#1a237e' : 'inherit',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400
                    }}
                  />
                  {hasBadge && (
                    <Badge 
                      badgeContent={item.badge} 
                      color="error"
                      sx={{ mr: 1 }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.role || 'User'}
            </Typography>
          </Box>
          <ChevronRight sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Breadcrumbs */}
            <Breadcrumbs 
              separator={<ChevronRight fontSize="small" />}
              sx={{ 
                '& .MuiBreadcrumbs-separator': { 
                  color: 'text.secondary',
                  mx: 1
                }
              }}
            >
              {getBreadcrumbs()}
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit" size="large">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton color="inherit" size="large">
                <Settings />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Tooltip title="User Menu">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box sx={{ p: 0 }}>
          {children}
        </Box>
      </Box>

      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout; 