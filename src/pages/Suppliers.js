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
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Business,
  Email,
  Phone,
  LocationOn,
  Category,
  Payment,
  Visibility,
  Edit,
  CheckCircle
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import api from '../config/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: {
      name: '',
      email: '',
      phone: '',
      position: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Indonesia'
    },
    businessInfo: {
      taxId: '',
      registrationNumber: '',
      website: ''
    },
    paymentTerms: 'net_30',
    creditLimit: 0,
    categories: ['Electronics'],
    rating: 3,
    isActive: true,
    notes: ''
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      setError('Failed to load suppliers');
      console.error('Suppliers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      code: '',
      contactPerson: {
        name: '',
        email: '',
        phone: '',
        position: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Indonesia'
      },
      businessInfo: {
        taxId: '',
        registrationNumber: '',
        website: ''
      },
      paymentTerms: 'net_30',
      creditLimit: 0,
      categories: ['Electronics'],
      rating: 3,
      isActive: true,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      code: supplier.code,
      contactPerson: {
        name: supplier.contactPerson?.name || '',
        email: supplier.contactPerson?.email || '',
        phone: supplier.contactPerson?.phone || '',
        position: supplier.contactPerson?.position || ''
      },
      address: {
        street: supplier.address?.street || '',
        city: supplier.address?.city || '',
        state: supplier.address?.state || '',
        zipCode: supplier.address?.zipCode || '',
        country: supplier.address?.country || 'Indonesia'
      },
      businessInfo: {
        taxId: supplier.businessInfo?.taxId || '',
        registrationNumber: supplier.businessInfo?.registrationNumber || '',
        website: supplier.businessInfo?.website || ''
      },
      paymentTerms: supplier.paymentTerms || 'net_30',
      creditLimit: supplier.creditLimit || 0,
      categories: supplier.categories || ['Electronics'],
      rating: supplier.rating || 3,
      isActive: supplier.isActive,
      notes: supplier.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteSupplier = async (supplier) => {
    if (window.confirm(`Are you sure you want to delete supplier "${supplier.name}"?`)) {
      try {
        await api.delete(`/api/suppliers/${supplier._id}`);
        fetchSuppliers();
      } catch (err) {
        setError('Failed to delete supplier');
        console.error('Delete supplier error:', err);
      }
    }
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setViewDialogOpen(true);
  };

  const handleToggleStatus = async (supplier) => {
    try {
      await api.put(`/api/suppliers/${supplier._id}`, {
        isActive: !supplier.isActive
      });
      fetchSuppliers();
    } catch (err) {
      setError('Failed to update supplier status');
      console.error('Toggle status error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSupplier) {
        await api.put(`/api/suppliers/${editingSupplier._id}`, formData);
      } else {
        await api.post('/api/suppliers', formData);
      }
      
      setDialogOpen(false);
      fetchSuppliers();
    } catch (err) {
      setError(editingSupplier ? 'Failed to update supplier' : 'Failed to create supplier');
      console.error('Supplier operation error:', err);
    }
  };

  const columns = [
    {
      field: 'name',
      header: 'Supplier',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Code: {row.code}
          </Typography>
        </Box>
      )
    },
    {
      field: 'contactPerson',
      header: 'Contact',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.contactPerson?.name || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.contactPerson?.email || 'N/A'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'categories',
      header: 'Categories',
      render: (value, row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.categories?.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              color="primary"
              variant="outlined"
            />
          )) || <Chip label="N/A" size="small" color="default" variant="outlined" />}
        </Box>
      )
    },
    {
      field: 'paymentTerms',
      header: 'Payment Terms',
      render: (value, row) => (
        <Chip
          label={row.paymentTerms?.replace('_', ' ').toUpperCase() || 'N/A'}
          size="small"
          color="info"
          variant="outlined"
        />
      )
    },
    {
      field: 'isActive',
      header: 'Status',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Switch
            checked={value}
            onChange={() => handleToggleStatus(row)}
            size="small"
            color="success"
          />
          <Chip
            label={value ? 'Active' : 'Inactive'}
            size="small"
            color={value ? 'success' : 'default'}
            variant="outlined"
          />
        </Box>
      )
    },
    {
      field: 'createdAt',
      header: 'Added',
      type: 'date'
    }
  ];

  return (
    <Box sx={{ p: 3, pt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            Supplier Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage supplier relationships, contracts, and performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSupplier}
          sx={{
            background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
            }
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DataTable
        data={suppliers}
        columns={columns}
        title="Suppliers"
        loading={loading}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
        onView={handleViewSupplier}
        onRefresh={fetchSuppliers}
        searchPlaceholder="Search suppliers by name or code..."
        emptyMessage="No suppliers found"
      />

      {/* Supplier Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          Supplier Details - {selectedSupplier?.name}
        </DialogTitle>
        <DialogContent>
          {selectedSupplier && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Company Information
                    </Typography>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Business color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Company Name"
                          secondary={selectedSupplier.name}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Category color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Categories"
                          secondary={selectedSupplier.categories?.join(', ') || 'N/A'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Payment color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Payment Terms"
                          secondary={selectedSupplier.paymentTerms?.replace('_', ' ').toUpperCase() || 'N/A'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Contact Information
                    </Typography>
                    <List>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Contact Person"
                          secondary={selectedSupplier.contactPerson?.name || 'N/A'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Email color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={selectedSupplier.contactPerson?.email || 'N/A'}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Phone color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone"
                          secondary={selectedSupplier.contactPerson?.phone || 'N/A'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                      Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <LocationOn color="primary" sx={{ mt: 0.5 }} />
                      <Typography variant="body2">
                        {selectedSupplier.address?.street && `${selectedSupplier.address.street}, `}
                        {selectedSupplier.address?.city && `${selectedSupplier.address.city}, `}
                        {selectedSupplier.address?.state && `${selectedSupplier.address.state} `}
                        {selectedSupplier.address?.zipCode && `${selectedSupplier.address.zipCode}, `}
                        {selectedSupplier.address?.country || 'Indonesia'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Supplier Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  fullWidth
                />
              </Grid>
              
              {/* Contact Person Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1a237e' }}>
                  Contact Person
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Person Name"
                  value={formData.contactPerson.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactPerson: { ...formData.contactPerson, name: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Position"
                  value={formData.contactPerson.position}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactPerson: { ...formData.contactPerson, position: e.target.value }
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.contactPerson.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactPerson: { ...formData.contactPerson, email: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  value={formData.contactPerson.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactPerson: { ...formData.contactPerson, phone: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>

              {/* Address Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1a237e' }}>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street Address"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State/Province"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ZIP Code"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  value={formData.address.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })}
                  required
                  fullWidth
                />
              </Grid>

              {/* Business Info Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1a237e' }}>
                  Business Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tax ID"
                  value={formData.businessInfo.taxId}
                  onChange={(e) => setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, taxId: e.target.value }
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Registration Number"
                  value={formData.businessInfo.registrationNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, registrationNumber: e.target.value }
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Website"
                  value={formData.businessInfo.website}
                  onChange={(e) => setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, website: e.target.value }
                  })}
                  fullWidth
                />
              </Grid>

              {/* Payment and Categories */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Terms</InputLabel>
                  <Select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    label="Payment Terms"
                  >
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="net_15">Net 15</MenuItem>
                    <MenuItem value="net_30">Net 30</MenuItem>
                    <MenuItem value="net_60">Net 60</MenuItem>
                    <MenuItem value="net_90">Net 90</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Credit Limit"
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={formData.categories}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                    label="Categories"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
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
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    label="Rating"
                  >
                    <MenuItem value={1}>1 Star</MenuItem>
                    <MenuItem value={2}>2 Stars</MenuItem>
                    <MenuItem value={3}>3 Stars</MenuItem>
                    <MenuItem value={4}>4 Stars</MenuItem>
                    <MenuItem value={5}>5 Stars</MenuItem>
                  </Select>
                </FormControl>
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
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      color="success"
                    />
                  }
                  label="Active Supplier"
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
              {editingSupplier ? 'Update Supplier' : 'Create Supplier'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Suppliers; 