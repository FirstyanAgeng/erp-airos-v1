# AIROS ERP Frontend

Frontend React application untuk AIROS ERP System dengan tema AIROS-inspired.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 atau lebih baru)
- Backend server berjalan di `http://localhost:5000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - URL: http://localhost:3000
   - Login: admin@airos.id / admin123

## 🔧 Configuration

### API Configuration
API base URL dikonfigurasi di `src/config/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

### Environment Variables
Untuk production, buat file `.env`:
```env
REACT_APP_API_URL=http://your-api-domain.com
REACT_APP_API_TIMEOUT=10000
```

## 📁 Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── contexts/      # React contexts
├── config/        # Configuration files
│   ├── api.js     # API configuration
│   └── constants.js # App constants
└── utils/         # Utility functions
```

## 🎨 Theme

Aplikasi menggunakan tema AIROS-inspired dengan:
- **Primary Color**: Dark Blue (#1a237e)
- **Secondary Color**: Orange (#ff6f00)
- **Font**: Inter (Google Fonts)
- **Design**: Modern dengan gradients dan glass morphism

## 🔐 Authentication

- JWT-based authentication
- Automatic token management
- Protected routes
- Role-based access control

## 📱 Features

- ✅ Responsive design
- ✅ Modern UI/UX
- ✅ Dashboard dengan charts
- ✅ User management
- ✅ Profile management
- ✅ Navigation dengan sidebar

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔗 API Endpoints

Frontend terhubung ke backend dengan endpoint:
- Base URL: `http://localhost:5000`
- Health Check: `GET /api/health`
- Auth: `POST /api/auth/login`
- Users: `GET /api/users`
- Products: `GET /api/products`
- Orders: `GET /api/orders`
- Suppliers: `GET /api/suppliers`

## 🐛 Troubleshooting

### CORS Issues
Pastikan backend mengizinkan CORS dari `http://localhost:3000`

### API Connection Issues
1. Pastikan backend server berjalan di port 5000
2. Periksa koneksi network
3. Cek console browser untuk error details

### Build Issues
1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install` 