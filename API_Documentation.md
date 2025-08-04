# Ads Analytics API Documentation

**Version:** 1.0.0  
**Date:** August 4, 2025  
**Author:** Your Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Error Handling](#error-handling)
6. [Environment Variables](#environment-variables)
7. [Development Guidelines](#development-guidelines)

---

## Overview

The Ads Analytics API is a comprehensive backend service for cross-platform advertising analytics and AI-powered insights. This API provides endpoints for user management, analytics data, AI-powered reports, platform integration, alert systems, and settings management.

### Features

- **User Authentication & Authorization**: JWT-based authentication with social login support
- **Cross-Platform Analytics**: Unified analytics across multiple advertising platforms
- **AI-Powered Insights**: OpenAI GPT-3.5 integration for intelligent reporting
- **Platform Management**: Connect and manage multiple advertising platforms
- **Alert System**: Real-time monitoring and notifications
- **Subscription Management**: Role-based access control
- **Settings & Configuration**: User preferences and system settings

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI GPT-3.5
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Task Scheduling**: Node-cron

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ads-analytics-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ads-analytics

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration (Optional - for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header.

### Authentication Flow

1. **Register/Login**: Get JWT token
2. **Include Token**: Add to request headers
3. **Token Validation**: Middleware validates token
4. **Access Control**: Subscription-based authorization

### Headers Format

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

### Token Structure

```json
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "subscription": "premium",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "status": "OK",
  "message": "Ads Analytics API is running"
}
```

---

### 1. Authentication Endpoints

#### Register User

```
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscription": "free"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User

```
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscription": "premium"
    },
    "token": "jwt_token_here"
  }
}
```

#### Social Authentication

**Google Login:**

```
POST /api/auth/google
```

**Facebook Login:**

```
POST /api/auth/facebook
```

**LinkedIn Login:**

```
POST /api/auth/linkedin
```

**Twitter Login:**

```
POST /api/auth/twitter
```

**Request Body (for all social auth):**

```json
{
  "accessToken": "social_platform_access_token"
}
```

#### Get Current User

```
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscription": "premium",
      "preferences": {
        "timezone": "UTC",
        "currency": "USD"
      }
    }
  }
}
```

#### Logout

```
POST /api/auth/logout
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Analytics Endpoints

#### Get Unified Analytics

```
GET /api/analytics/unified
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `period`: daily, weekly, monthly (default: monthly)
- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSpend": 15420.5,
      "totalRevenue": 28750.75,
      "totalClicks": 125000,
      "totalImpressions": 2500000,
      "averageCTR": 5.0,
      "averageCPC": 0.12,
      "averageCPM": 6.17,
      "roas": 1.87
    },
    "trends": [
      {
        "date": "2025-08-01",
        "spend": 1250.0,
        "revenue": 2350.0,
        "clicks": 10000,
        "impressions": 200000
      }
    ],
    "platformBreakdown": [
      {
        "platform": "Google Ads",
        "spend": 8500.25,
        "revenue": 15800.5,
        "clicks": 68000,
        "impressions": 1360000
      }
    ]
  }
}
```

#### Get Platform-Specific Analytics

```
GET /api/analytics/platform/:platformId
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "platform": "Google Ads",
    "metrics": {
      "spend": 8500.25,
      "revenue": 15800.5,
      "clicks": 68000,
      "impressions": 1360000,
      "ctr": 5.0,
      "cpc": 0.125,
      "cpm": 6.25,
      "roas": 1.86
    },
    "campaigns": [
      {
        "id": "campaign_1",
        "name": "Summer Sale Campaign",
        "spend": 2500.0,
        "revenue": 4800.0,
        "clicks": 20000,
        "impressions": 400000
      }
    ],
    "adGroups": [
      {
        "id": "adgroup_1",
        "name": "Electronics",
        "spend": 1200.0,
        "revenue": 2300.0,
        "clicks": 9500,
        "impressions": 190000
      }
    ]
  }
}
```

#### Get Campaign Performance

```
GET /api/analytics/campaigns
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `platform`: platform_id (optional)
- `status`: active, paused, completed (optional)

**Response:**

```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "campaign_1",
        "name": "Summer Sale Campaign",
        "platform": "Google Ads",
        "status": "active",
        "spend": 2500.0,
        "revenue": 4800.0,
        "clicks": 20000,
        "impressions": 400000,
        "ctr": 5.0,
        "cpc": 0.125,
        "cpm": 6.25,
        "roas": 1.92
      }
    ],
    "summary": {
      "totalCampaigns": 15,
      "activeCampaigns": 12,
      "totalSpend": 15420.5,
      "totalRevenue": 28750.75
    }
  }
}
```

#### Get Performance Metrics

```
GET /api/analytics/performance
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalSpend": 15420.5,
      "totalRevenue": 28750.75,
      "totalClicks": 125000,
      "totalImpressions": 2500000,
      "averageCTR": 5.0,
      "averageCPC": 0.12,
      "averageCPM": 6.17,
      "roas": 1.87
    },
    "trends": [
      {
        "date": "2025-08-01",
        "spend": 1250.0,
        "revenue": 2350.0,
        "clicks": 10000,
        "impressions": 200000
      }
    ],
    "topPerformers": [
      {
        "campaign": "Summer Sale Campaign",
        "platform": "Google Ads",
        "roas": 1.92,
        "revenue": 4800.0
      }
    ]
  }
}
```

#### Get Insights

```
GET /api/analytics/insights
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "performance",
        "title": "High ROAS Campaign",
        "description": "Summer Sale Campaign is performing exceptionally well with 1.92 ROAS",
        "impact": "positive",
        "recommendation": "Consider increasing budget for this campaign"
      },
      {
        "type": "opportunity",
        "title": "Underperforming Keywords",
        "description": "15 keywords have CTR below 2%",
        "impact": "negative",
        "recommendation": "Review and optimize these keywords"
      }
    ],
    "summary": {
      "totalInsights": 8,
      "positiveInsights": 5,
      "negativeInsights": 3
    }
  }
}
```

#### Get Real-time Data

```
GET /api/analytics/realtime
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "currentHour": {
      "spend": 125.5,
      "clicks": 850,
      "impressions": 15000,
      "conversions": 12
    },
    "last24Hours": {
      "spend": 2850.75,
      "clicks": 18500,
      "impressions": 350000,
      "conversions": 245
    },
    "activeCampaigns": 12,
    "alerts": 2
  }
}
```

---

### 3. AI-Powered Endpoints

#### Generate AI Report

```
POST /api/ai/report
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "period": "monthly",
  "platforms": ["google_ads", "facebook_ads"],
  "focus": "performance_optimization"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "report": {
      "summary": "Your advertising campaigns showed strong performance this month...",
      "keyFindings": [
        "ROAS improved by 15% compared to last month",
        "Google Ads campaigns are outperforming Facebook Ads",
        "Mobile traffic shows higher conversion rates"
      ],
      "recommendations": [
        "Increase budget allocation to Google Ads",
        "Optimize mobile ad creatives",
        "Test new audience segments"
      ],
      "metrics": {
        "totalSpend": 15420.5,
        "totalRevenue": 28750.75,
        "roas": 1.87
      }
    }
  }
}
```

#### Get Platform-Specific AI Insights

```
POST /api/ai/platform-insights
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "platform": "google_ads",
  "period": "weekly",
  "focus": "keyword_optimization"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "platform": "Google Ads",
    "insights": [
      {
        "type": "keyword",
        "title": "High-Performing Keywords",
        "description": "Electronics and tech keywords show 40% higher CTR",
        "recommendation": "Increase bids on electronics-related keywords"
      },
      {
        "type": "audience",
        "title": "Audience Opportunity",
        "description": "Mobile users aged 25-34 show 60% higher conversion rate",
        "recommendation": "Create mobile-specific campaigns for this demographic"
      }
    ],
    "optimization": {
      "budgetAllocation": "Increase mobile budget by 25%",
      "bidAdjustments": "Increase bids for high-converting keywords by 15%",
      "adCopy": "Test new ad copy focusing on mobile benefits"
    }
  }
}
```

#### Get Optimization Recommendations

```
POST /api/ai/optimization
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "campaignId": "campaign_123",
  "goal": "increase_roas",
  "constraints": {
    "maxBudgetIncrease": 20,
    "maintainCTR": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "campaign": "Summer Sale Campaign",
    "currentMetrics": {
      "roas": 1.87,
      "spend": 2500.0,
      "revenue": 4675.0
    },
    "recommendations": [
      {
        "type": "budget",
        "action": "Increase daily budget by 15%",
        "expectedImpact": "ROAS improvement of 8-12%",
        "confidence": 85
      },
      {
        "type": "targeting",
        "action": "Add similar audiences",
        "expectedImpact": "Increase reach by 20%",
        "confidence": 78
      },
      {
        "type": "creative",
        "action": "Test new ad variations",
        "expectedImpact": "CTR improvement of 5-10%",
        "confidence": 72
      }
    ],
    "implementation": {
      "priority": "high",
      "timeline": "1-2 weeks",
      "estimatedROI": "15-20% improvement"
    }
  }
}
```

---

### 4. Platform Management Endpoints

#### Get Connected Platforms

```
GET /api/platforms/connected
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "id": "google_ads",
        "name": "Google Ads",
        "status": "connected",
        "lastSync": "2025-08-04T10:30:00Z",
        "accountInfo": {
          "accountName": "My Google Ads Account",
          "accountId": "123456789"
        }
      },
      {
        "id": "facebook_ads",
        "name": "Facebook Ads",
        "status": "connected",
        "lastSync": "2025-08-04T09:15:00Z",
        "accountInfo": {
          "accountName": "My Facebook Ads Account",
          "accountId": "987654321"
        }
      }
    ]
  }
}
```

#### Get Available Platforms

```
GET /api/platforms/available
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "id": "google_ads",
        "name": "Google Ads",
        "description": "Search and display advertising platform",
        "features": ["search_ads", "display_ads", "shopping_ads"],
        "status": "connected"
      },
      {
        "id": "facebook_ads",
        "name": "Facebook Ads",
        "description": "Social media advertising platform",
        "features": ["social_ads", "video_ads", "stories_ads"],
        "status": "connected"
      },
      {
        "id": "linkedin_ads",
        "name": "LinkedIn Ads",
        "description": "Professional networking advertising",
        "features": ["b2b_ads", "sponsored_content"],
        "status": "available"
      }
    ]
  }
}
```

#### Connect Platform

```
POST /api/platforms/connect
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "platform": "linkedin_ads",
  "credentials": {
    "accessToken": "linkedin_access_token",
    "refreshToken": "linkedin_refresh_token"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "LinkedIn Ads connected successfully",
  "data": {
    "platform": {
      "id": "linkedin_ads",
      "name": "LinkedIn Ads",
      "status": "connected",
      "accountInfo": {
        "accountName": "My LinkedIn Ads Account",
        "accountId": "456789123"
      }
    }
  }
}
```

#### Disconnect Platform

```
POST /api/platforms/disconnect
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "platform": "linkedin_ads"
}
```

**Response:**

```json
{
  "success": true,
  "message": "LinkedIn Ads disconnected successfully"
}
```

#### Sync Platform Data

```
POST /api/platforms/sync
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "platform": "google_ads",
  "syncType": "full"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Google Ads data synced successfully",
  "data": {
    "syncInfo": {
      "platform": "Google Ads",
      "syncType": "full",
      "recordsSynced": 1250,
      "lastSync": "2025-08-04T11:00:00Z"
    }
  }
}
```

---

### 5. Alert System Endpoints

#### Get Alerts

```
GET /api/alerts
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `status`: all, unread, read (default: all)
- `type`: performance, budget, technical (optional)
- `limit`: number of alerts (default: 20)

**Response:**

```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert_1",
        "type": "performance",
        "title": "High ROAS Alert",
        "message": "Campaign 'Summer Sale' achieved 2.5 ROAS",
        "status": "unread",
        "priority": "high",
        "createdAt": "2025-08-04T10:30:00Z",
        "metadata": {
          "campaignId": "campaign_123",
          "roas": 2.5
        }
      },
      {
        "id": "alert_2",
        "type": "budget",
        "title": "Budget Limit Reached",
        "message": "Daily budget limit reached for campaign 'Winter Sale'",
        "status": "read",
        "priority": "medium",
        "createdAt": "2025-08-04T09:15:00Z",
        "metadata": {
          "campaignId": "campaign_456",
          "budget": 500.0
        }
      }
    ],
    "summary": {
      "total": 15,
      "unread": 8,
      "highPriority": 3
    }
  }
}
```

#### Create Alert

```
POST /api/alerts
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "type": "performance",
  "title": "Custom Alert",
  "message": "Custom alert message",
  "priority": "medium",
  "metadata": {
    "campaignId": "campaign_123",
    "metric": "roas"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Alert created successfully",
  "data": {
    "alert": {
      "id": "alert_new",
      "type": "performance",
      "title": "Custom Alert",
      "message": "Custom alert message",
      "status": "unread",
      "priority": "medium",
      "createdAt": "2025-08-04T11:00:00Z"
    }
  }
}
```

#### Mark Alert as Read

```
PUT /api/alerts/:alertId/read
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Alert marked as read"
}
```

#### Delete Alert

```
DELETE /api/alerts/:alertId
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Alert deleted successfully"
}
```

#### Get Alert Settings

```
GET /api/alerts/settings
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "settings": {
      "emailNotifications": true,
      "pushNotifications": true,
      "alertTypes": {
        "performance": true,
        "budget": true,
        "technical": false
      },
      "thresholds": {
        "roas": 2.0,
        "ctr": 5.0,
        "budget": 1000.0
      }
    }
  }
}
```

#### Update Alert Settings

```
PUT /api/alerts/settings
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "emailNotifications": true,
  "pushNotifications": false,
  "alertTypes": {
    "performance": true,
    "budget": true,
    "technical": true
  },
  "thresholds": {
    "roas": 2.5,
    "ctr": 6.0,
    "budget": 1500.0
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Alert settings updated successfully"
}
```

---

### 6. User Management Endpoints

#### Get User Profile

```
GET /api/users/profile
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "subscription": "premium",
      "createdAt": "2025-01-15T10:30:00Z",
      "lastLogin": "2025-08-04T09:00:00Z"
    }
  }
}
```

#### Update User Profile

```
PUT /api/users/profile
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "timezone": "America/New_York"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "timezone": "America/New_York"
    }
  }
}
```

#### Update User Preferences

```
PUT /api/users/preferences
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "preferences": {
    "timezone": "America/New_York",
    "currency": "USD",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "frequency": "daily"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

#### Change Password

```
PUT /api/users/password
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newsecurepassword456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

#### Deactivate Account

```
DELETE /api/users/account
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "password": "currentpassword123",
  "reason": "No longer needed"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

### 7. Settings Management Endpoints

#### Get Settings

```
GET /api/settings
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "settings": {
      "general": {
        "timezone": "America/New_York",
        "currency": "USD",
        "language": "en"
      },
      "notifications": {
        "email": true,
        "push": true,
        "frequency": "daily"
      },
      "display": {
        "theme": "light",
        "dashboardLayout": "grid"
      },
      "privacy": {
        "dataSharing": false,
        "analyticsTracking": true
      }
    }
  }
}
```

#### Update Settings

```
PUT /api/settings
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "general": {
    "timezone": "America/Los_Angeles",
    "currency": "EUR"
  },
  "notifications": {
    "email": true,
    "push": false,
    "frequency": "weekly"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

#### Get Subscription Info

```
GET /api/settings/subscription
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "subscription": {
      "plan": "premium",
      "status": "active",
      "startDate": "2025-01-15T00:00:00Z",
      "endDate": "2026-01-15T00:00:00Z",
      "features": [
        "unlimited_analytics",
        "ai_insights",
        "priority_support",
        "advanced_reporting"
      ],
      "limits": {
        "platforms": 10,
        "campaigns": 100,
        "aiReports": 50
      }
    }
  }
}
```

#### Get Billing Info

```
GET /api/settings/billing
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "billing": {
      "currentPlan": "premium",
      "amount": 99.0,
      "currency": "USD",
      "billingCycle": "monthly",
      "nextBillingDate": "2025-09-15T00:00:00Z",
      "paymentMethod": {
        "type": "card",
        "last4": "1234",
        "brand": "Visa"
      },
      "invoices": [
        {
          "id": "inv_123",
          "amount": 99.0,
          "status": "paid",
          "date": "2025-08-15T00:00:00Z"
        }
      ]
    }
  }
}
```

#### Get API Keys

```
GET /api/settings/api-keys
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "apiKeys": [
      {
        "id": "key_1",
        "name": "Production API Key",
        "key": "ak_123456789abcdef",
        "permissions": ["read", "write"],
        "createdAt": "2025-01-15T10:30:00Z",
        "lastUsed": "2025-08-04T09:00:00Z"
      },
      {
        "id": "key_2",
        "name": "Development API Key",
        "key": "ak_987654321fedcba",
        "permissions": ["read"],
        "createdAt": "2025-07-01T14:20:00Z",
        "lastUsed": "2025-08-03T16:45:00Z"
      }
    ]
  }
}
```

#### Create API Key

```
POST /api/settings/api-keys
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "New API Key",
  "permissions": ["read", "write"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "API key created successfully",
  "data": {
    "apiKey": {
      "id": "key_new",
      "name": "New API Key",
      "key": "ak_newlygeneratedkey123",
      "permissions": ["read", "write"],
      "createdAt": "2025-08-04T11:00:00Z"
    }
  }
}
```

#### Delete API Key

```
DELETE /api/settings/api-keys/:keyId
```

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "code": "ERROR_CODE"
}
```

### Common Error Codes

| Code                       | Description                | HTTP Status |
| -------------------------- | -------------------------- | ----------- |
| `AUTH_REQUIRED`            | Authentication required    | 401         |
| `INVALID_TOKEN`            | Invalid or expired token   | 401         |
| `INSUFFICIENT_PERMISSIONS` | Subscription level too low | 403         |
| `VALIDATION_ERROR`         | Request validation failed  | 400         |
| `NOT_FOUND`                | Resource not found         | 404         |
| `RATE_LIMIT_EXCEEDED`      | Too many requests          | 429         |
| `INTERNAL_ERROR`           | Server error               | 500         |

### Example Error Responses

#### Authentication Error

```json
{
  "success": false,
  "error": "Authentication Error",
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

#### Validation Error

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Email is required",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "constraint": "required"
  }
}
```

#### Subscription Error

```json
{
  "success": false,
  "error": "Subscription Error",
  "message": "Premium subscription required for AI features",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

---

## Development Guidelines

### Code Structure

```
backend/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── env.example          # Environment variables template
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── models/             # Database models
│   └── User.js         # User model
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── analytics.js    # Analytics routes
│   ├── ai.js          # AI-powered routes
│   ├── platforms.js    # Platform management
│   ├── alerts.js       # Alert system
│   ├── users.js        # User management
│   └── settings.js     # Settings management
└── services/           # Business logic
    └── alertService.js # Alert monitoring service
```

### Best Practices

1. **Authentication**: Always use JWT tokens for protected endpoints
2. **Validation**: Validate all input data using express-validator
3. **Error Handling**: Use consistent error response format
4. **Rate Limiting**: Implement rate limiting for all endpoints
5. **Logging**: Use morgan for HTTP request logging
6. **Security**: Use helmet for security headers
7. **CORS**: Configure CORS properly for cross-origin requests

### Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

### Deployment

1. **Environment Setup**: Configure all environment variables
2. **Database**: Set up MongoDB connection
3. **Security**: Update JWT secret and other sensitive values
4. **Monitoring**: Set up logging and monitoring
5. **SSL**: Use HTTPS in production

### API Versioning

The API uses URL versioning:

```
/api/v1/auth/login
/api/v2/auth/login
```

Current version: v1 (default)

---

## Support

For technical support or questions about the API:

- **Email**: support@adsanalytics.com
- **Documentation**: https://docs.adsanalytics.com
- **GitHub**: https://github.com/adsanalytics/api

---

**Document Version:** 1.0.0  
**Last Updated:** August 4, 2025  
**Next Review:** September 4, 2025
