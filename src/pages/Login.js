import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AirosLogo from '../components/AirosLogo';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <AirosLogo 
              size="xlarge" 
              variant="icon" 
              sx={{ mb: 3 }}
            />
            
            <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
              AIROS ERP
            </Typography>
            <Typography component="h2" variant="h6" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
              Welcome to AIROS Enterprise Resource Planning
            </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                background: 'linear-gradient(135deg, #1a237e 0%, #534bae 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #000051 0%, #1a237e 100%)',
                }
              }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center', p: 2, background: 'rgba(26, 35, 126, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: admin@airos.id
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
    </Box>
  );
};

export default Login; 