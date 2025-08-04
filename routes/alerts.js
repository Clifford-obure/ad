const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get user alerts
router.get("/", auth, async (req, res) => {
  try {
    // Mock alerts data
    const alerts = [
      {
        id: "alert_001",
        type: "performance",
        title: "High Cost per Click Alert",
        message:
          "Your Google Ads CPC has increased by 15% in the last 24 hours",
        severity: "warning",
        platform: "google",
        createdAt: "2024-01-20T10:30:00Z",
        isRead: false,
        data: {
          metric: "CPC",
          change: "+15%",
          threshold: 10,
        },
      },
      {
        id: "alert_002",
        type: "budget",
        title: "Budget Limit Reached",
        message:
          "Facebook campaign 'Summer Sale' has reached 90% of daily budget",
        severity: "info",
        platform: "facebook",
        createdAt: "2024-01-20T09:15:00Z",
        isRead: true,
        data: {
          campaign: "Summer Sale",
          budgetUsed: 90,
          threshold: 90,
        },
      },
      {
        id: "alert_003",
        type: "conversion",
        title: "Conversion Rate Drop",
        message:
          "TikTok conversion rate has dropped by 20% compared to last week",
        severity: "critical",
        platform: "tiktok",
        createdAt: "2024-01-20T08:45:00Z",
        isRead: false,
        data: {
          metric: "Conversion Rate",
          change: "-20%",
          threshold: -15,
        },
      },
    ];

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alerts",
    });
  }
});

// Create alert
router.post(
  "/",
  auth,
  [
    body("type").isString(),
    body("title").isString(),
    body("message").isString(),
    body("severity").isIn(["info", "warning", "critical"]),
    body("platform").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, title, message, severity, platform, data } = req.body;

      // Mock alert creation
      const newAlert = {
        id: `alert_${Date.now()}`,
        type,
        title,
        message,
        severity,
        platform,
        createdAt: new Date().toISOString(),
        isRead: false,
        data,
      };

      res.status(201).json({
        success: true,
        message: "Alert created successfully",
        data: newAlert,
      });
    } catch (error) {
      console.error("Create alert error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create alert",
      });
    }
  }
);

// Mark alert as read
router.put("/:alertId/read", auth, async (req, res) => {
  try {
    const { alertId } = req.params;

    // Mock marking alert as read
    res.json({
      success: true,
      message: "Alert marked as read",
    });
  } catch (error) {
    console.error("Mark alert as read error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark alert as read",
    });
  }
});

// Delete alert
router.delete("/:alertId", auth, async (req, res) => {
  try {
    const { alertId } = req.params;

    // Mock alert deletion
    res.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Delete alert error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete alert",
    });
  }
});

// Get alert settings
router.get("/settings", auth, async (req, res) => {
  try {
    // Mock alert settings
    const settings = {
      emailNotifications: true,
      pushNotifications: true,
      performanceAlerts: {
        enabled: true,
        cpcThreshold: 10,
        ctrThreshold: -15,
        conversionRateThreshold: -20,
      },
      budgetAlerts: {
        enabled: true,
        dailyBudgetThreshold: 90,
        totalBudgetThreshold: 95,
      },
      customAlerts: [
        {
          id: "custom_001",
          name: "High Spend Alert",
          metric: "spend",
          condition: "greater_than",
          value: 1000,
          enabled: true,
        },
      ],
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get alert settings error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch alert settings",
    });
  }
});

// Update alert settings
router.put(
  "/settings",
  auth,
  [
    body("emailNotifications").optional().isBoolean(),
    body("pushNotifications").optional().isBoolean(),
    body("performanceAlerts").optional().isObject(),
    body("budgetAlerts").optional().isObject(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        emailNotifications,
        pushNotifications,
        performanceAlerts,
        budgetAlerts,
      } = req.body;

      // Mock settings update
      res.json({
        success: true,
        message: "Alert settings updated successfully",
      });
    } catch (error) {
      console.error("Update alert settings error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update alert settings",
      });
    }
  }
);

module.exports = router;
