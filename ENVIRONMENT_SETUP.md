# Environment Variables Setup

## Development

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000

# App Configuration
REACT_APP_NAME=AIROS ERP
REACT_APP_VERSION=1.0.0
```

## Production (Vercel)

Set these environment variables in your Vercel dashboard:

```env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.vercel.app
REACT_APP_API_TIMEOUT=15000

# App Configuration
REACT_APP_NAME=AIROS ERP
REACT_APP_VERSION=1.0.0
```

## Environment Variables Reference

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000` |
| `REACT_APP_API_TIMEOUT` | API request timeout in milliseconds | `10000` |
| `REACT_APP_NAME` | Application name | `AIROS ERP` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the appropriate value
5. Redeploy your application

## Deployment Steps

### Backend Deployment (Vercel)
1. Push your backend code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`
4. Deploy

### Frontend Deployment (Vercel)
1. Push your frontend code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend Vercel URL
   - `REACT_APP_API_TIMEOUT`: `15000`
   - `REACT_APP_NAME`: `AIROS ERP`
   - `REACT_APP_VERSION`: `1.0.0`
4. Deploy

## Notes

- All environment variables must start with `REACT_APP_` to be accessible in React
- Changes to environment variables require a rebuild/redeploy
- Never commit `.env` files to version control
- Use `.env.example` as a template for team members
- The API configuration is now centralized in `src/config/constants.js`
- Proxy configuration has been removed from package.json 