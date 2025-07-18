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
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Block,
  CheckCircle
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import api from '../config/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'IT',
    isActive: true
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      department: 'IT',
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await api.delete(`/api/users/${user._id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error('Delete user error:', err);
      }
    }
  };

  const handleViewUser = (user) => {
    // For now, just show user details in console
    console.log('User details:', user);
    alert(`User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nDepartment: ${user.department}\nStatus: ${user.isActive ? 'Active' : 'Inactive'}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/api/users/${editingUser._id}`, updateData);
      } else {
        await api.post('/api/users', formData);
      }
      
      setDialogOpen(false);
      fetchUsers();
    } catch (err) {
      setError(editingUser ? 'Failed to update user' : 'Failed to create user');
      console.error('User operation error:', err);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/api/users/${user._id}`, {
        isActive: !user.isActive
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to update user status');
      console.error('Toggle status error:', err);
    }
  };

  const columns = [
    {
      field: 'name',
      header: 'Name',
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.email}
          </Typography>
        </Box>
      )
    },
    {
      field: 'role',
      header: 'Role',
      type: 'chip',
      chipColor: (value) => {
        switch (value) {
          case 'admin': return 'error';
          case 'manager': return 'warning';
          default: return 'default';
        }
      },
      render: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    {
      field: 'department',
      header: 'Department',
      type: 'chip',
      chipColor: 'info'
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
      field: 'lastLogin',
      header: 'Last Login',
      type: 'datetime',
      render: (value) => value ? new Date(value).toLocaleString() : 'Never'
    },
    {
      field: 'createdAt',
      header: 'Created',
      type: 'date'
    }
  ];

  return (
    <Box sx={{ p: 3, pt: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            User Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
          sx={{
            background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
            }
          }}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DataTable
        data={users}
        columns={columns}
        title="Users"
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onView={handleViewUser}
        onRefresh={fetchUsers}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found"
      />

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1a237e', fontWeight: 600 }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Inventory">Inventory</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    color="success"
                  />
                }
                label="Active Account"
              />
            </Box>
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
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users; 