const express = require("express");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get unified analytics from all connected platforms
router.get("/unified", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Mock analytics data for demonstration
    const analytics = {
      totalSpend: 28890,
      totalImpressions: 1250000,
      totalClicks: 14500,
      totalConversions: 580,
      performance: {
        ctr: 1.16,
        cpc: 1.99,
        cpm: 23.11,
        conversionRate: 4.0,
        roas: 3.2,
      },
      platformBreakdown: {
        facebook: {
          spend: 12500,
          impressions: 600000,
          clicks: 7200,
          conversions: 290,
          ctr: 1.2,
          cpc: 1.74,
          cpm: 20.83,
          conversion_rate: 4.03,
        },
        google: {
          spend: 8900,
          impressions: 450000,
          clicks: 4800,
          conversions: 190,
          ctr: 1.07,
          cpc: 1.85,
          cpm: 19.78,
          conversion_rate: 3.96,
        },
        tiktok: {
          spend: 7490,
          impressions: 200000,
          clicks: 2500,
          conversions: 100,
          ctr: 1.25,
          cpc: 3.0,
          cpm: 37.45,
          conversion_rate: 4.0,
        },
      },
      campaigns: [
        {
          id: "camp_001",
          name: "Summer Sale Campaign",
          platform: "facebook",
          status: "active",
          spend: 8500,
          impressions: 400000,
          clicks: 4800,
          conversions: 192,
          ctr: 1.2,
          cpc: 1.77,
          conversion_rate: 4.0,
        },
        {
          id: "camp_002",
          name: "Brand Awareness",
          platform: "google",
          status: "active",
          spend: 6200,
          impressions: 300000,
          clicks: 3200,
          conversions: 128,
          ctr: 1.07,
          cpc: 1.94,
          conversion_rate: 4.0,
        },
        {
          id: "camp_003",
          name: "Product Launch",
          platform: "tiktok",
          status: "active",
          spend: 7490,
          impressions: 200000,
          clicks: 2500,
          conversions: 100,
          ctr: 1.25,
          cpc: 3.0,
          conversion_rate: 4.0,
        },
      ],
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get unified analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch unified analytics",
    });
  }
});

// Get analytics from specific platform
router.get("/platform/:platform", auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Mock platform-specific data
    const platformData = {
      facebook: {
        spend: 12500,
        impressions: 600000,
        clicks: 7200,
        conversions: 290,
        ctr: 1.2,
        cpc: 1.74,
        cpm: 20.83,
        conversion_rate: 4.03,
        campaigns: [
          {
            id: "fb_camp_001",
            name: "Summer Sale Campaign",
            status: "active",
            spend: 8500,
            impressions: 400000,
            clicks: 4800,
            conversions: 192,
          },
          {
            id: "fb_camp_002",
            name: "Retargeting Campaign",
            status: "active",
            spend: 4000,
            impressions: 200000,
            clicks: 2400,
            conversions: 98,
          },
        ],
      },
      google: {
        spend: 8900,
        impressions: 450000,
        clicks: 4800,
        conversions: 190,
        ctr: 1.07,
        cpc: 1.85,
        cpm: 19.78,
        conversion_rate: 3.96,
        campaigns: [
          {
            id: "google_camp_001",
            name: "Brand Awareness",
            status: "active",
            spend: 6200,
            impressions: 300000,
            clicks: 3200,
            conversions: 128,
          },
          {
            id: "google_camp_002",
            name: "Search Campaign",
            status: "active",
            spend: 2700,
            impressions: 150000,
            clicks: 1600,
            conversions: 62,
          },
        ],
      },
      tiktok: {
        spend: 7490,
        impressions: 200000,
        clicks: 2500,
        conversions: 100,
        ctr: 1.25,
        cpc: 3.0,
        cpm: 37.45,
        conversion_rate: 4.0,
        campaigns: [
          {
            id: "tiktok_camp_001",
            name: "Product Launch",
            status: "active",
            spend: 7490,
            impressions: 200000,
            clicks: 2500,
            conversions: 100,
          },
        ],
      },
    };

    const data = platformData[platform];
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Platform not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get platform analytics error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch platform analytics",
    });
  }
});

// Get campaign performance data
router.get("/campaigns", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Mock campaign data
    const campaigns = [
      {
        id: "camp_001",
        name: "Summer Sale Campaign",
        platform: "facebook",
        status: "active",
        spend: 8500,
        impressions: 400000,
        clicks: 4800,
        conversions: 192,
        ctr: 1.2,
        cpc: 1.77,
        conversion_rate: 4.0,
      },
      {
        id: "camp_002",
        name: "Brand Awareness",
        platform: "google",
        status: "active",
        spend: 6200,
        impressions: 300000,
        clicks: 3200,
        conversions: 128,
        ctr: 1.07,
        cpc: 1.94,
        conversion_rate: 4.0,
      },
      {
        id: "camp_003",
        name: "Product Launch",
        platform: "tiktok",
        status: "active",
        spend: 7490,
        impressions: 200000,
        clicks: 2500,
        conversions: 100,
        ctr: 1.25,
        cpc: 3.0,
        conversion_rate: 4.0,
      },
    ];

    // Sort campaigns by performance
    const sortedCampaigns = campaigns.sort((a, b) => b.spend - a.spend);

    res.json({
      success: true,
      data: {
        campaigns: sortedCampaigns,
        totalCampaigns: sortedCampaigns.length,
        activeCampaigns: sortedCampaigns.filter((c) => c.status === "active")
          .length,
        totalSpend: 28890,
      },
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch campaign data",
    });
  }
});

// Get performance metrics
router.get("/performance", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Mock performance data
    const performance = {
      ctr: 1.16,
      cpc: 1.99,
      cpm: 23.11,
      conversionRate: 4.0,
      roas: 3.2,
    };

    res.json({
      success: true,
      data: {
        metrics: performance,
        totals: {
          spend: 28890,
          impressions: 1250000,
          clicks: 14500,
          conversions: 580,
        },
        platformBreakdown: {
          facebook: {
            spend: 12500,
            impressions: 600000,
            clicks: 7200,
            conversions: 290,
            ctr: 1.2,
            cpc: 1.74,
            cpm: 20.83,
            conversion_rate: 4.03,
          },
          google: {
            spend: 8900,
            impressions: 450000,
            clicks: 4800,
            conversions: 190,
            ctr: 1.07,
            cpc: 1.85,
            cpm: 19.78,
            conversion_rate: 3.96,
          },
          tiktok: {
            spend: 7490,
            impressions: 200000,
            clicks: 2500,
            conversions: 100,
            ctr: 1.25,
            cpc: 3.0,
            cpm: 37.45,
            conversion_rate: 4.0,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get performance error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch performance data",
    });
  }
});

// Get insights and recommendations
router.get("/insights", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateRange = { startDate, endDate };

    // Mock insights data
    const insights = [
      {
        id: "insight_001",
        platform: "facebook",
        type: "performance",
        title: "High CTR on Facebook Campaigns",
        description:
          "Facebook campaigns are performing above industry average with 1.2% CTR",
        priority: "high",
        impact: "positive",
        recommendation:
          "Consider increasing budget allocation to Facebook campaigns",
      },
      {
        id: "insight_002",
        platform: "google",
        type: "cost",
        title: "Optimize Google Search Costs",
        description: "Google CPC is slightly higher than average at $1.85",
        priority: "medium",
        impact: "warning",
        recommendation: "Review bidding strategies and keyword optimization",
      },
      {
        id: "insight_003",
        platform: "tiktok",
        type: "reach",
        title: "TikTok Shows High Engagement",
        description:
          "TikTok campaigns have high engagement but lower conversion rates",
        priority: "low",
        impact: "positive",
        recommendation:
          "Focus on improving landing page experience for TikTok traffic",
      },
    ];

    res.json({
      success: true,
      data: {
        insights,
        totalInsights: insights.length,
        criticalInsights: insights.filter((i) => i.priority === "high").length,
      },
    });
  } catch (error) {
    console.error("Get insights error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch insights",
    });
  }
});

// Get real-time data (simulated)
router.get("/realtime", auth, async (req, res) => {
  try {
    // Simulate real-time data
    const realtimeData = {
      activeCampaigns: Math.floor(Math.random() * 10) + 5,
      todaySpend: Math.floor(Math.random() * 1000) + 200,
      todayClicks: Math.floor(Math.random() * 500) + 100,
      todayConversions: Math.floor(Math.random() * 20) + 5,
      lastUpdated: new Date(),
    };

    res.json({
      success: true,
      data: realtimeData,
    });
  } catch (error) {
    console.error("Get realtime data error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch real-time data",
    });
  }
});

module.exports = router;
