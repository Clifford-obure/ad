# Ads Analytics Backend API

A comprehensive backend API for cross-platform ads analytics and AI-powered insights. This backend provides authentication, analytics data management, AI-powered insights, and platform integration capabilities.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with social login support
- 📊 **Analytics Management**: Unified analytics across multiple advertising platforms
- 🤖 **AI-Powered Insights**: ChatGPT integration for intelligent campaign analysis
- 🔗 **Platform Integration**: Support for Facebook, Google, TikTok, and more
- 🚨 **Alert System**: Real-time monitoring and notifications
- ⚙️ **Settings Management**: User preferences and subscription management
- 📈 **Real-time Data**: Live campaign performance monitoring

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **AI Integration**: OpenAI GPT-3.5
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Monitoring**: morgan logging

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone and install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

The API will be available at `http://localhost:5000`

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "company": "My Company"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "subscription": {
      "plan": "free",
      "status": "active"
    }
  }
}
```

### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Social Authentication

```http
POST /auth/google
POST /auth/facebook
POST /auth/linkedin
POST /auth/twitter
Content-Type: application/json

{
  "accessToken": "social-access-token",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

### Upgrade Subscription (Test)

```http
POST /auth/upgrade-subscription
Authorization: Bearer <token>
```

---

## 📊 Analytics Endpoints

### Get Unified Analytics

```http
GET /analytics/unified?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSpend": 28890,
    "totalImpressions": 1250000,
    "totalClicks": 14500,
    "totalConversions": 580,
    "performance": {
      "ctr": 1.16,
      "cpc": 1.99,
      "cpm": 23.11,
      "conversionRate": 4.0,
      "roas": 3.2
    },
    "platformBreakdown": {
      "facebook": {
        "spend": 12500,
        "impressions": 600000,
        "clicks": 7200,
        "conversions": 290,
        "ctr": 1.2,
        "cpc": 1.74,
        "cpm": 20.83,
        "conversion_rate": 4.03
      }
    },
    "campaigns": [...]
  }
}
```

### Get Platform-Specific Analytics

```http
GET /analytics/platform/facebook?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Get Campaign Performance

```http
GET /analytics/campaigns?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Get Performance Metrics

```http
GET /analytics/performance?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Get Insights

```http
GET /analytics/insights?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Get Real-time Data

```http
GET /analytics/realtime
Authorization: Bearer <token>
```

---

## 🤖 AI Endpoints

### Generate AI Report

```http
POST /ai/generate-report
Authorization: Bearer <token>
Content-Type: application/json

{
  "platforms": ["facebook", "google", "tiktok"],
  "timeframe": "Last 30 days",
  "analyticsData": {
    "facebook": {
      "spend": 12500,
      "impressions": 600000,
      "clicks": 7200,
      "conversions": 290,
      "ctr": 1.2,
      "cpc": 1.74,
      "cpm": 20.83,
      "conversion_rate": 4.03
    },
    "google": {
      "spend": 8900,
      "impressions": 450000,
      "clicks": 4800,
      "conversions": 190,
      "ctr": 1.07,
      "cpc": 1.85,
      "cpm": 19.78,
      "conversion_rate": 3.96
    }
  }
}
```

**Response:**

```json
{
  "id": 1705756800000,
  "timestamp": "2024-01-20T15:45:00.000Z",
  "timeframe": "Last 30 days",
  "platforms": ["facebook", "google", "tiktok"],
  "summary": {
    "totalSpend": 28890,
    "totalImpressions": 1250000,
    "totalClicks": 14500,
    "totalConversions": 580
  },
  "insights": [
    {
      "type": "performance",
      "title": "Strong Conversion Performance",
      "description": "Your overall conversion rate of 4.0% is above industry average",
      "impact": "positive",
      "recommendation": "Consider increasing budget allocation to high-converting campaigns"
    }
  ],
  "recommendations": [
    {
      "priority": "high",
      "category": "budget_optimization",
      "title": "Reallocate Budget to High-Performing Campaigns",
      "description": "Identify top-performing campaigns and increase their budget allocation",
      "expectedImpact": "Increase overall conversion rate by 0.3-0.5%",
      "implementation": "Review campaign performance data and adjust daily budgets"
    }
  ],
  "trends": [
    {
      "metric": "Conversion Rate",
      "trend": "up",
      "change": "+0.8%",
      "period": "vs last period",
      "insight": "Improved targeting and messaging"
    }
  ],
  "source": "openai"
}
```

### Get Platform-Specific Insights

```http
POST /ai/platform-insights
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "facebook",
  "data": {
    "spend": 12500,
    "impressions": 600000,
    "clicks": 7200,
    "conversions": 290
  }
}
```

### Generate Optimization Recommendations

```http
POST /ai/optimization-recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "analyticsData": {
    "facebook": { ... },
    "google": { ... }
  },
  "goals": {
    "increaseConversions": true,
    "reduceCosts": false,
    "expandReach": true
  }
}
```

---

## 🔗 Platform Management

### Get Connected Platforms

```http
GET /platforms/connected
Authorization: Bearer <token>
```

### Get Available Platforms

```http
GET /platforms/available
Authorization: Bearer <token>
```

### Connect Platform

```http
POST /platforms/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "facebook",
  "credentials": {
    "accessToken": "facebook-access-token",
    "accountId": "123456789"
  }
}
```

### Disconnect Platform

```http
DELETE /platforms/disconnect/:platformId
Authorization: Bearer <token>
```

### Sync Platform Data

```http
POST /platforms/sync/:platformId
Authorization: Bearer <token>
```

---

## 🚨 Alert System

### Get Alerts

```http
GET /alerts
Authorization: Bearer <token>
```

### Create Alert

```http
POST /alerts
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "performance",
  "title": "High CPC Alert",
  "message": "CPC has increased by 15%",
  "severity": "warning",
  "platform": "google"
}
```

### Mark Alert as Read

```http
PUT /alerts/:alertId/read
Authorization: Bearer <token>
```

### Delete Alert

```http
DELETE /alerts/:alertId
Authorization: Bearer <token>
```

### Get Alert Settings

```http
GET /alerts/settings
Authorization: Bearer <token>
```

### Update Alert Settings

```http
PUT /alerts/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "pushNotifications": true,
  "performanceAlerts": {
    "enabled": true,
    "cpcThreshold": 10
  }
}
```

---

## 👤 User Management

### Get User Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

### Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "company": "Updated Company"
}
```

### Update Preferences

```http
PUT /users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "timezone": "UTC",
  "currency": "USD",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

### Change Password

```http
PUT /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Delete Account

```http
DELETE /users/account
Authorization: Bearer <token>
```

---

## ⚙️ Settings Management

### Get Settings

```http
GET /settings
Authorization: Bearer <token>
```

### Update Settings

```http
PUT /settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "general": {
    "timezone": "UTC",
    "currency": "USD"
  },
  "notifications": {
    "email": true,
    "push": true
  }
}
```

### Get Subscription Info

```http
GET /settings/subscription
Authorization: Bearer <token>
```

### Get Billing Info

```http
GET /settings/billing
Authorization: Bearer <token>
```

### Update Payment Method

```http
PUT /settings/billing/payment-method
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": {
    "type": "card",
    "number": "4242424242424242",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "cvc": "123"
  }
}
```

### Cancel Subscription

```http
POST /settings/billing/cancel
Authorization: Bearer <token>
```

### Get API Keys

```http
GET /settings/api-keys
Authorization: Bearer <token>
```

### Create API Key

```http
POST /settings/api-keys
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Production API Key",
  "permissions": ["read", "write"]
}
```

### Revoke API Key

```http
DELETE /settings/api-keys/:keyId
Authorization: Bearer <token>
```

---

## 🔍 Health Check

### API Health

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "message": "Ads Analytics API is running"
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description (in development)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ads-analytics

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

---

## Development

### Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The database and collections will be created automatically

### AI Features Setup

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add `OPENAI_API_KEY` to your `.env` file
3. AI features will work with mock data if no API key is provided

---

## Production Deployment

### Requirements

- Node.js 14+
- MongoDB 4.4+
- Environment variables configured
- SSL certificate (recommended)

### Deployment Steps

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set strong JWT secret
4. Configure CORS for your domain
5. Set up reverse proxy (nginx recommended)
6. Use PM2 or similar for process management

### Security Considerations

- Use HTTPS in production
- Set strong JWT secrets
- Configure proper CORS origins
- Implement rate limiting
- Use environment variables for secrets
- Regular security updates

---

## License

MIT License - see LICENSE file for details.
