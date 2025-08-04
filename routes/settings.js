const express = require("express");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get user settings
router.get("/", auth, async (req, res) => {
  try {
    // Mock user settings
    const settings = {
      general: {
        timezone: "UTC",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        language: "en",
      },
      notifications: {
        email: true,
        push: true,
        sms: false,
        frequency: "daily",
      },
      display: {
        theme: "light",
        compactMode: false,
        showAdvancedMetrics: true,
      },
      integrations: {
        slack: {
          enabled: false,
          webhook: "",
        },
        zapier: {
          enabled: false,
          apiKey: "",
        },
      },
      privacy: {
        dataRetention: 90,
        shareAnalytics: false,
        allowCookies: true,
      },
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch settings",
    });
  }
});

// Update user settings
router.put("/", auth, async (req, res) => {
  try {
    const { general, notifications, display, integrations, privacy } = req.body;

    // Mock settings update
    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update settings",
    });
  }
});

// Get subscription information
router.get("/subscription", auth, async (req, res) => {
  try {
    const user = req.user;

    const subscription = {
      plan: user.subscription.plan,
      status: user.subscription.status,
      startDate: user.subscription.startDate,
      endDate: user.subscription.endDate,
      features: {
        free: ["Basic analytics", "2 platform connections", "Email support"],
        basic: [
          "Advanced analytics",
          "5 platform connections",
          "AI insights",
          "Priority support",
        ],
        pro: [
          "Unlimited analytics",
          "Unlimited platforms",
          "Custom reports",
          "API access",
          "Dedicated support",
        ],
        enterprise: [
          "Everything in Pro",
          "Custom integrations",
          "White-label options",
          "Account manager",
        ],
      },
      usage: {
        platformsConnected: 3,
        reportsGenerated: 15,
        aiInsightsUsed: 8,
      },
      limits: {
        platforms:
          user.subscription.plan === "free"
            ? 2
            : user.subscription.plan === "basic"
            ? 5
            : "unlimited",
        reports: user.subscription.plan === "free" ? 5 : "unlimited",
        aiInsights: user.subscription.plan === "free" ? 3 : "unlimited",
      },
    };

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch subscription information",
    });
  }
});

// Get billing information
router.get("/billing", auth, async (req, res) => {
  try {
    // Mock billing information
    const billing = {
      currentPlan: "basic",
      nextBillingDate: "2024-02-20T00:00:00Z",
      amount: 29.99,
      currency: "USD",
      billingCycle: "monthly",
      paymentMethod: {
        type: "card",
        last4: "4242",
        brand: "visa",
        expiryMonth: 12,
        expiryYear: 2025,
      },
      invoices: [
        {
          id: "inv_001",
          date: "2024-01-20T00:00:00Z",
          amount: 29.99,
          status: "paid",
          downloadUrl: "/api/settings/billing/invoice/inv_001",
        },
        {
          id: "inv_002",
          date: "2023-12-20T00:00:00Z",
          amount: 29.99,
          status: "paid",
          downloadUrl: "/api/settings/billing/invoice/inv_002",
        },
      ],
    };

    res.json({
      success: true,
      data: billing,
    });
  } catch (error) {
    console.error("Get billing error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch billing information",
    });
  }
});

// Update payment method
router.put("/billing/payment-method", auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    // Mock payment method update
    res.json({
      success: true,
      message: "Payment method updated successfully",
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update payment method",
    });
  }
});

// Cancel subscription
router.post("/billing/cancel", auth, async (req, res) => {
  try {
    // Mock subscription cancellation
    res.json({
      success: true,
      message:
        "Subscription cancelled successfully. You can continue using the service until the end of your billing period.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel subscription",
    });
  }
});

// Get API keys
router.get("/api-keys", auth, async (req, res) => {
  try {
    // Mock API keys
    const apiKeys = [
      {
        id: "key_001",
        name: "Production API Key",
        key: "sk_live_...",
        created: "2024-01-15T10:30:00Z",
        lastUsed: "2024-01-20T15:45:00Z",
        permissions: ["read", "write"],
        status: "active",
      },
      {
        id: "key_002",
        name: "Development API Key",
        key: "sk_test_...",
        created: "2024-01-10T09:15:00Z",
        lastUsed: "2024-01-19T14:30:00Z",
        permissions: ["read"],
        status: "active",
      },
    ];

    res.json({
      success: true,
      data: apiKeys,
    });
  } catch (error) {
    console.error("Get API keys error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch API keys",
    });
  }
});

// Create API key
router.post("/api-keys", auth, async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Mock API key creation
    const newApiKey = {
      id: `key_${Date.now()}`,
      name,
      key: `sk_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString(),
      lastUsed: null,
      permissions: permissions || ["read"],
      status: "active",
    };

    res.status(201).json({
      success: true,
      message: "API key created successfully",
      data: newApiKey,
    });
  } catch (error) {
    console.error("Create API key error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create API key",
    });
  }
});

// Revoke API key
router.delete("/api-keys/:keyId", auth, async (req, res) => {
  try {
    const { keyId } = req.params;

    // Mock API key revocation
    res.json({
      success: true,
      message: "API key revoked successfully",
    });
  } catch (error) {
    console.error("Revoke API key error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to revoke API key",
    });
  }
});

module.exports = router;
