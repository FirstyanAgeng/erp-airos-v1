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
  Switch,
  FormControlLabel,
  Grid,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Add,
  Inventory,
  Warning,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import api from '../config/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: 'Electronics',
    price: '',
    cost: '',
    stockQuantity: '',
    minStockLevel: '',
    supplier: '',
    unit: 'pcs',
    tags: []
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, suppliersRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/suppliers')
      ]);
      setProducts(productsRes.data);
      setSuppliers(suppliersRes.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Products error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      sku: '',
      category: 'Electronics',
      price: '',
      cost: '',
      stockQuantity: '',
      minStockLevel: '',
      supplier: '',
      unit: 'pcs',
      tags: []
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      sku: product.sku,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel,
      supplier: product.supplier?._id || '',
      unit: product.unit,
      tags: product.tags || []
    });
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      try {
        await api.delete(`/api/products/${product._id}`);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Delete product error:', err);
      }
    }
  };

  const handleViewProduct = (product) => {
    alert(`Product: ${product.name}\nSKU: ${product.sku}\nCategory: ${product.category}\nPrice: $${product.price}\nStock: ${product.stockQuantity}\nSupplier: ${product.supplier?.name || 'N/A'}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: parseInt(formData.minStockLevel)
      };

      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, submitData);
      } else {
        await api.post('/api/products', submitData);
      }
      
      setDialogOpen(false);
      fetchProducts();
    } catch (err) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error('Product operation error:', err);
    }
  };

  const getStockStatus = (product) => {
    const percentage = (product.stockQuantity / product.minStockLevel) * 100;
    if (product.stockQuantity === 0) return { status: 'Out of Stock', color: 'error', percentage: 0 };
    if (product.stockQuantity <= product.minStockLevel) return { status: 'Low Stock', color: 'warning', percentage };
    if (percentage > 200) return { status: 'Overstocked', color: 'info', percentage: 100 };
    return { status: 'In Stock', color: 'success', percentage: 100 };
  };

  const columns = [
    {
      field: 'name',
      header: 'Product',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            SKU: {row.sku}
          </Typography>
        </Box>
      )
    },
    {
      field: 'category',
      header: 'Category',
      type: 'chip',
      chipColor: 'primary'
    },
    {
      field: 'price',
      header: 'Price',
      type: 'currency'
    },
    {
      field: 'stockQuantity',
      header: 'Stock Level',
      render: (value, row) => {
        const stockStatus = getStockStatus(row);
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {value}
              </Typography>
              <Chip
                label={stockStatus.status}
                size="small"
                color={stockStatus.color}
                variant="outlined"
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={stockStatus.percentage}
              color={stockStatus.color}
              sx={{ height: 4, borderRadius: 2 }}
            />
            <Typography variant="caption" color="textSecondary">
              Min: {row.minStockLevel}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'supplier',
      header: 'Supplier',
      render: (value) => value?.name || 'N/A'
    },
    {
      field: 'cost',
      header: 'Cost',
      type: 'currency'
    },
    {
      field: 'createdAt',
      header: 'Added',
      type: 'date'
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            Product Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage product catalog, inventory, and supplier relationships
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          sx={{
            background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
            }
          }}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DataTable
        data={products}
        columns={columns}
        title="Products"
        loading={loading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onView={handleViewProduct}
        onRefresh={fetchProducts}
        searchPlaceholder="Search products by name or SKU..."
        emptyMessage="No products found"
      />

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                    required
                  >
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Books">Books</MenuItem>
                    <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    label="Supplier"
                    required
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Cost ($)"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    label="Unit"
                    required
                  >
                    <MenuItem value="pcs">Pieces</MenuItem>
                    <MenuItem value="kg">Kilograms</MenuItem>
                    <MenuItem value="liter">Liters</MenuItem>
                    <MenuItem value="box">Box</MenuItem>
                    <MenuItem value="pair">Pair</MenuItem>
                    <MenuItem value="set">Set</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock Quantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Minimum Stock Level"
                  type="number"
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
                }
              }}
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products; 