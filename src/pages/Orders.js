import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add,
  ShoppingCart,
  CheckCircle,
  Pending,
  Cancel,
  LocalShipping,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import api from '../config/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: ''
    },
    items: [],
    tax: 0,
    shipping: 0,
    paymentMethod: 'credit_card',
    notes: ''
  });
  const [newItem, setNewItem] = useState({
    product: '',
    quantity: 1
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/api/orders'),
        api.get('/api/products')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      customer: {
        name: '',
        email: '',
        phone: ''
      },
      items: [],
      tax: 0,
      shipping: 0,
      paymentMethod: 'credit_card',
      notes: ''
    });
    setNewItem({
      product: '',
      quantity: 1
    });
    setDialogOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setFormData({
      customer: order.customer,
      items: order.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price
      })),
      tax: order.tax,
      shipping: order.shipping,
      paymentMethod: order.paymentMethod,
      notes: order.notes || ''
    });
    setNewItem({
      product: '',
      quantity: 1
    });
    setDialogOpen(true);
  };

  const handleDeleteOrder = async (order) => {
    if (window.confirm(`Are you sure you want to delete order "${order.orderNumber}"?`)) {
      try {
        await api.delete(`/api/orders/${order._id}`);
        fetchOrders();
      } catch (err) {
        setError('Failed to delete order');
        console.error('Delete order error:', err);
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = async (order, newStatus) => {
    try {
      await api.put(`/api/orders/${order._id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status');
      console.error('Status update error:', err);
    }
  };

  const handleAddItem = () => {
    if (!newItem.product || newItem.quantity <= 0) {
      setError('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find(p => p._id === newItem.product);
    if (!product) {
      setError('Product not found');
      return;
    }

    if (product.stockQuantity < newItem.quantity) {
      setError(`Insufficient stock. Available: ${product.stockQuantity}`);
      return;
    }

    const existingItemIndex = formData.items.findIndex(item => item.product === newItem.product);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setFormData({ ...formData, items: updatedItems });
    } else {
      // Add new item
      setFormData({
        ...formData,
        items: [...formData.items, {
          product: newItem.product,
          quantity: newItem.quantity,
          price: product.price
        }]
      });
    }

    setNewItem({ product: '', quantity: 1 });
    setError('');
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => {
      const product = products.find(p => p._id === item.product);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + (formData.tax || 0) + (formData.shipping || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    if (!formData.customer.name || !formData.customer.email || !formData.customer.phone) {
      setError('Please fill in all customer information');
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        items: formData.items.map(item => ({
          product: item.product,
          quantity: item.quantity
        }))
      };

      if (editingOrder) {
        await api.put(`/api/orders/${editingOrder._id}`, submitData);
      } else {
        await api.post('/api/orders', submitData);
      }
      
      setDialogOpen(false);
      fetchOrders();
    } catch (err) {
      setError(editingOrder ? 'Failed to update order' : 'Failed to create order');
      console.error('Order operation error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      case 'processing': return <LocalShipping />;
      default: return <ShoppingCart />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const columns = [
    {
      field: 'orderNumber',
      header: 'Order',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            #{value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.customer?.name}
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      header: 'Status',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getStatusIcon(value)}
          <Chip
            label={value.charAt(0).toUpperCase() + value.slice(1)}
            size="small"
            color={getStatusColor(value)}
            variant="outlined"
          />
        </Box>
      )
    },
    {
      field: 'total',
      header: 'Total',
      type: 'currency'
    },
    {
      field: 'items',
      header: 'Items',
      render: (value) => `${value.length} item${value.length !== 1 ? 's' : ''}`
    },
    {
      field: 'paymentMethod',
      header: 'Payment',
      render: (value) => value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    {
      field: 'createdAt',
      header: 'Date',
      type: 'datetime'
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            Order Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Process orders, track sales, and manage customer relationships
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddOrder}
          sx={{
            background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
            }
          }}
        >
          New Order
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DataTable
        data={orders}
        columns={columns}
        title="Orders"
        loading={loading}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        onView={handleViewOrder}
        onRefresh={fetchOrders}
        searchPlaceholder="Search orders by number or customer..."
        emptyMessage="No orders found"
      />

      {/* Order Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          Order Details - #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Customer Information
                    </Typography>
                    <Typography variant="body2"><strong>Name:</strong> {selectedOrder.customer.name}</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {selectedOrder.customer.email}</Typography>
                    <Typography variant="body2"><strong>Phone:</strong> {selectedOrder.customer.phone}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Order Information
                    </Typography>
                    <Typography variant="body2"><strong>Status:</strong> 
                      <Chip 
                        label={selectedOrder.status} 
                        size="small" 
                        color={getStatusColor(selectedOrder.status)}
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2"><strong>Payment:</strong> {selectedOrder.paymentMethod}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Order Items
                    </Typography>
                    <List>
                      {selectedOrder.items.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={item.product.name}
                              secondary={`Quantity: ${item.quantity} | Price: ${formatCurrency(item.price)} | Total: ${formatCurrency(item.total)}`}
                            />
                          </ListItem>
                          {index < selectedOrder.items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Subtotal: {formatCurrency(selectedOrder.subtotal)}</Typography>
                      <Typography variant="body2">Tax: {formatCurrency(selectedOrder.tax)}</Typography>
                      <Typography variant="body2">Shipping: {formatCurrency(selectedOrder.shipping)}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                        Total: {formatCurrency(selectedOrder.total)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              {selectedOrder.notes && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                        Notes
                      </Typography>
                      <Typography variant="body2">{selectedOrder.notes}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedOrder && selectedOrder.status === 'pending' && (
            <Button
              variant="contained"
              onClick={() => handleStatusUpdate(selectedOrder, 'processing')}
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
                }
              }}
            >
              Process Order
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add/Edit Order Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          {editingOrder ? 'Edit Order' : 'Create New Order'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Customer Information
                </Typography>
                <TextField
                  label="Customer Name"
                  value={formData.customer.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, name: e.target.value }
                  })}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, email: e.target.value }
                  })}
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Phone"
                  value={formData.customer.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, phone: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Order Details
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    label="Payment Method"
                    required
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit_card">Credit Card</MenuItem>
                    <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    <MenuItem value="online_payment">Online Payment</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Tax ($)"
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                <TextField
                  label="Shipping ($)"
                  type="number"
                  value={formData.shipping}
                  onChange={(e) => setFormData({ ...formData, shipping: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              
              {/* Order Items Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  Order Items
                </Typography>
                
                {/* Add Item Form */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={newItem.product}
                      onChange={(e) => setNewItem({ ...newItem, product: e.target.value })}
                      label="Product"
                    >
                      {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                          {product.name} - ${product.price} (Stock: {product.stockQuantity})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    inputProps={{ min: 1 }}
                    sx={{ width: 100 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddItem}
                    startIcon={<Add />}
                  >
                    Add Item
                  </Button>
                </Box>

                {/* Items Table */}
                {formData.items.length > 0 && (
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.items.map((item, index) => {
                          const product = products.find(p => p._id === item.product);
                          return (
                            <TableRow key={index}>
                              <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                              <TableCell>{formatCurrency(product?.price || 0)}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency((product?.price || 0) * item.quantity)}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <Delete />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {/* Order Summary */}
                {formData.items.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2">Subtotal: {formatCurrency(calculateSubtotal())}</Typography>
                    <Typography variant="body2">Tax: {formatCurrency(formData.tax || 0)}</Typography>
                    <Typography variant="body2">Shipping: {formatCurrency(formData.shipping || 0)}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Total: {formatCurrency(calculateTotal())}
                    </Typography>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formData.items.length === 0}
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
                }
              }}
            >
              {editingOrder ? 'Update Order' : 'Create Order'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Orders; 