const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get connected platforms
router.get("/connected", auth, async (req, res) => {
  try {
    // Mock connected platforms data
    const connectedPlatforms = [
      {
        id: "fb_001",
        platform: "facebook",
        name: "Facebook Ads",
        status: "connected",
        connectedAt: "2024-01-15T10:30:00Z",
        accountName: "My Business Page",
        accountId: "123456789",
        lastSync: "2024-01-20T15:45:00Z",
        spend: 12500,
        campaigns: 3,
      },
      {
        id: "google_001",
        platform: "google",
        name: "Google Ads",
        status: "connected",
        connectedAt: "2024-01-10T09:15:00Z",
        accountName: "My Google Ads Account",
        accountId: "987654321",
        lastSync: "2024-01-20T14:30:00Z",
        spend: 8900,
        campaigns: 2,
      },
      {
        id: "tiktok_001",
        platform: "tiktok",
        name: "TikTok Ads",
        status: "connected",
        connectedAt: "2024-01-05T11:20:00Z",
        accountName: "My TikTok Business",
        accountId: "456789123",
        lastSync: "2024-01-20T16:00:00Z",
        spend: 7490,
        campaigns: 1,
      },
    ];

    res.json({
      success: true,
      data: connectedPlatforms,
    });
  } catch (error) {
    console.error("Get connected platforms error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch connected platforms",
    });
  }
});

// Get available platforms
router.get("/available", auth, async (req, res) => {
  try {
    // Mock available platforms
    const availablePlatforms = [
      {
        id: "facebook",
        name: "Facebook Ads",
        description: "Connect your Facebook Ads account to track performance",
        icon: "facebook",
        status: "available",
        features: [
          "Campaign tracking",
          "Audience insights",
          "Creative analytics",
        ],
      },
      {
        id: "google",
        name: "Google Ads",
        description:
          "Connect your Google Ads account for comprehensive analytics",
        icon: "google",
        status: "available",
        features: ["Search campaigns", "Display campaigns", "Shopping ads"],
      },
      {
        id: "tiktok",
        name: "TikTok Ads",
        description: "Track your TikTok advertising performance",
        icon: "tiktok",
        status: "available",
        features: ["Video campaigns", "Brand awareness", "Engagement tracking"],
      },
      {
        id: "instagram",
        name: "Instagram Ads",
        description: "Monitor your Instagram advertising campaigns",
        icon: "instagram",
        status: "coming_soon",
        features: ["Story ads", "Feed ads", "IGTV campaigns"],
      },
      {
        id: "linkedin",
        name: "LinkedIn Ads",
        description: "Track B2B advertising performance on LinkedIn",
        icon: "linkedin",
        status: "coming_soon",
        features: ["Sponsored content", "Message ads", "Dynamic ads"],
      },
    ];

    res.json({
      success: true,
      data: availablePlatforms,
    });
  } catch (error) {
    console.error("Get available platforms error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available platforms",
    });
  }
});

// Connect platform
router.post(
  "/connect",
  auth,
  [body("platform").isString(), body("credentials").isObject()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { platform, credentials } = req.body;

      // Mock platform connection
      const connectedPlatform = {
        id: `${platform}_${Date.now()}`,
        platform,
        name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Ads`,
        status: "connected",
        connectedAt: new Date().toISOString(),
        accountName: `My ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        } Account`,
        accountId: `acc_${Date.now()}`,
        lastSync: new Date().toISOString(),
        spend: 0,
        campaigns: 0,
      };

      res.json({
        success: true,
        message: `${platform} connected successfully`,
        data: connectedPlatform,
      });
    } catch (error) {
      console.error("Connect platform error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to connect platform",
      });
    }
  }
);

// Disconnect platform
router.delete("/disconnect/:platformId", auth, async (req, res) => {
  try {
    const { platformId } = req.params;

    // Mock platform disconnection
    res.json({
      success: true,
      message: "Platform disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect platform error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to disconnect platform",
    });
  }
});

// Sync platform data
router.post("/sync/:platformId", auth, async (req, res) => {
  try {
    const { platformId } = req.params;

    // Mock platform sync
    res.json({
      success: true,
      message: "Platform data synced successfully",
      data: {
        lastSync: new Date().toISOString(),
        campaignsSynced: Math.floor(Math.random() * 10) + 1,
        dataPoints: Math.floor(Math.random() * 1000) + 100,
      },
    });
  } catch (error) {
    console.error("Sync platform error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync platform data",
    });
  }
});

module.exports = router;
