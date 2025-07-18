import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  People,
  Business,
  AttachMoney,
  Visibility,
  Add,
  Refresh,
  Notifications,
  Warning,
  CheckCircle,
  Error,
  Info,
  LocalShipping,
  Assessment,
  PieChart,
  BarChart,
  Timeline,
  Speed,
  Analytics,
  Dashboard as DashboardIcon,
  CalendarToday,
  AccessTime,
  Star,
  StarBorder
} from '@mui/icons-material';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../config/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [quickActionDialog, setQuickActionDialog] = useState(false);
  const [quickActionType, setQuickActionType] = useState('');
  const [quickActionData, setQuickActionData] = useState({});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        ordersRes,
        lowStockRes,
        topProductsRes,
        salesRes,
        categoryRes
      ] = await Promise.all([
        api.get('/api/dashboard/stats'),
        api.get('/api/orders?limit=5'),
        api.get('/api/products/alerts/low-stock'),
        api.get('/api/products?sort=sales&limit=5'),
        api.get('/api/orders/stats/sales-chart'),
        api.get('/api/products/stats/category-distribution')
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setLowStockProducts(lowStockRes.data);
      setTopProducts(topProductsRes.data);
      setSalesData(salesRes.data);
      setCategoryData(categoryRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleQuickAction = (type) => {
    setQuickActionType(type);
    setQuickActionData({});
    setQuickActionDialog(true);
  };

  const handleQuickActionSubmit = async () => {
    try {
      switch (quickActionType) {
        case 'order':
          await api.post('/api/orders', quickActionData);
          break;
        case 'product':
          await api.post('/api/products', quickActionData);
          break;
        case 'supplier':
          await api.post('/api/suppliers', quickActionData);
          break;
        default:
          break;
      }
      setQuickActionDialog(false);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to create ' + quickActionType);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Warning />;
      case 'processing': return <LocalShipping />;
      case 'cancelled': return <Error />;
      default: return <Info />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color, trend, subtitle }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend > 0 ? (
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />
                )}
                <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
                  {Math.abs(trend)}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, color: color }}>
            {icon}
          </Avatar>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, unit, color, progress }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}{unit}
        </Typography>
        {progress && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
              color={progress > 80 ? 'success' : progress > 50 ? 'warning' : 'error'}
            />
            <Typography variant="caption" color="textSecondary">
              {progress}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            AIROS Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's what's happening with your business today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Fab
            color="primary"
            size="medium"
            onClick={() => handleQuickAction('order')}
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
              }
            }}
          >
            <Add />
          </Fab>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue || 0)}
            icon={<AttachMoney />}
            color="#1a237e"
            trend={12.5}
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders"
            value={stats.totalOrders || 0}
            icon={<ShoppingCart />}
            color="#534bae"
            trend={8.2}
            subtitle={`Pending: ${stats.pendingOrders || 0}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Products"
            value={stats.totalProducts || 0}
            icon={<Inventory />}
            color="#00c853"
            trend={-2.1}
            subtitle={`Low stock: ${stats.lowStockCount || 0}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Customers"
            value={stats.totalCustomers || 0}
            icon={<People />}
            color="#ff6f00"
            trend={15.3}
            subtitle="New this month"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                Sales Trend (Last 30 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#1a237e"
                    fill="#1a237e"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
                Product Categories
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Order Fulfillment Rate"
            value={stats.fulfillmentRate || 0}
            unit="%"
            color="#1a237e"
            progress={stats.fulfillmentRate || 0}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Average Order Value"
            value={formatCurrency(stats.avgOrderValue || 0)}
            unit=""
            color="#534bae"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Customer Satisfaction"
            value={stats.satisfactionRate || 0}
            unit="%"
            color="#00c853"
            progress={stats.satisfactionRate || 0}
          />
        </Grid>
      </Grid>

      {/* Content Row */}
      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                  Recent Orders
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleQuickAction('order')}
                  startIcon={<Add />}
                >
                  New Order
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            #{order.orderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>{order.customer?.name}</TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={order.status}
                            size="small"
                            color={getStatusColor(order.status)}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alerts */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 600 }}>
                  Low Stock Alerts
                </Typography>
                <Badge badgeContent={lowStockProducts.length} color="error">
                  <Warning color="error" />
                </Badge>
              </Box>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {lowStockProducts.map((product, index) => (
                  <React.Fragment key={product._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <Inventory />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={`Stock: ${product.stockQuantity} | Min: ${product.minStockLevel}`}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(product.stockQuantity / product.minStockLevel) * 100}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                          color="warning"
                        />
                        <Typography variant="caption" color="textSecondary">
                          {Math.round((product.stockQuantity / product.minStockLevel) * 100)}%
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < lowStockProducts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions Dialog */}
      <Dialog open={quickActionDialog} onClose={() => setQuickActionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          Quick {quickActionType.charAt(0).toUpperCase() + quickActionType.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {quickActionType === 'order' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Customer Name"
                    value={quickActionData.customerName || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, customerName: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={quickActionData.customerEmail || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, customerEmail: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
            {quickActionType === 'product' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    value={quickActionData.name || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, name: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="SKU"
                    value={quickActionData.sku || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, sku: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
            {quickActionType === 'supplier' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Supplier Name"
                    value={quickActionData.name || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, name: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contact Email"
                    type="email"
                    value={quickActionData.email || ''}
                    onChange={(e) => setQuickActionData({ ...quickActionData, email: e.target.value })}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleQuickActionSubmit}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
              }
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 