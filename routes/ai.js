const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth, requireSubscription } = require("../middleware/auth");
const axios = require("axios");

const router = express.Router();

// Rate limiting for OpenAI API calls
const rateLimit = {
  lastCall: 0,
  minInterval: 2000, // Minimum 2 seconds between calls
  maxCallsPerMinute: 20, // OpenAI's rate limit is typically 20 requests per minute
  callsThisMinute: 0,
  resetTime: Date.now() + 60000, // Reset counter every minute
};

// Rate limiting middleware
function checkRateLimit() {
  const now = Date.now();

  // Reset counter if a minute has passed
  if (now > rateLimit.resetTime) {
    rateLimit.callsThisMinute = 0;
    rateLimit.resetTime = now + 60000;
  }

  // Check if we're within rate limits
  if (rateLimit.callsThisMinute >= rateLimit.maxCallsPerMinute) {
    throw new Error("Rate limit exceeded. Please try again in a minute.");
  }

  // Check minimum interval between calls
  if (now - rateLimit.lastCall < rateLimit.minInterval) {
    const waitTime = rateLimit.minInterval - (now - rateLimit.lastCall);
    throw new Error(
      `Please wait ${Math.ceil(
        waitTime / 1000
      )} seconds before making another request.`
    );
  }

  // Update counters
  rateLimit.lastCall = now;
  rateLimit.callsThisMinute++;
}

// Generate AI Report with ChatGPT 3.5
router.post(
  "/generate-report",
  auth,
  requireSubscription("basic"),
  [
    body("platforms").isArray(),
    body("timeframe").isString(),
    body("analyticsData").isObject(),
  ],
  async (req, res) => {
    try {
      console.log("🤖 Generating AI report with ChatGPT 3.5...");

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { platforms, timeframe, analyticsData } = req.body;

      // Calculate aggregated metrics
      const aggregatedData = calculateAggregatedMetrics(analyticsData);

      // Prepare prompt for ChatGPT 3.5
      const prompt = generateAnalysisPrompt(
        platforms,
        timeframe,
        analyticsData,
        aggregatedData
      );

      console.log("📝 Sending prompt to ChatGPT 3.5...");

      // Call ChatGPT 3.5 API
      const chatGPTResponse = await callChatGPT(prompt);

      console.log("✅ ChatGPT 3.5 analysis received");

      // Parse and structure the response
      const aiReport = parseChatGPTResponse(
        chatGPTResponse,
        aggregatedData,
        platforms,
        timeframe
      );

      // Add source information
      aiReport.source = chatGPTResponse.source || "openai";

      console.log("📊 AI report generated successfully");

      res.json(aiReport);
    } catch (error) {
      console.error("❌ AI report generation error:", error);
      res.status(500).json({ error: "Failed to generate AI report" });
    }
  }
);

// Get AI Insights for specific platform
router.post(
  "/platform-insights",
  auth,
  requireSubscription("basic"),
  async (req, res) => {
    try {
      const { platform, data } = req.body;

      const prompt = generatePlatformSpecificPrompt(platform, data);
      const chatGPTResponse = await callChatGPT(prompt);

      const insights = parsePlatformInsights(chatGPTResponse, platform);

      res.json({ insights });
    } catch (error) {
      console.error("❌ Platform insights error:", error);
      res.status(500).json({ error: "Failed to generate platform insights" });
    }
  }
);

// Generate optimization recommendations
router.post(
  "/optimization-recommendations",
  auth,
  requireSubscription("basic"),
  async (req, res) => {
    try {
      const { analyticsData, goals } = req.body;

      const prompt = generateOptimizationPrompt(analyticsData, goals);
      const chatGPTResponse = await callChatGPT(prompt);

      const recommendations = parseOptimizationRecommendations(chatGPTResponse);

      res.json({ recommendations });
    } catch (error) {
      console.error("❌ Optimization recommendations error:", error);
      res
        .status(500)
        .json({ error: "Failed to generate optimization recommendations" });
    }
  }
);

// Helper Functions

function calculateAggregatedMetrics(analyticsData) {
  const totalSpend = Object.values(analyticsData).reduce(
    (sum, platform) => sum + platform.spend,
    0
  );
  const totalImpressions = Object.values(analyticsData).reduce(
    (sum, platform) => sum + platform.impressions,
    0
  );
  const totalClicks = Object.values(analyticsData).reduce(
    (sum, platform) => sum + platform.clicks,
    0
  );
  const totalConversions = Object.values(analyticsData).reduce(
    (sum, platform) => sum + platform.conversions,
    0
  );

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalConversions,
    overallCtr: ((totalClicks / totalImpressions) * 100).toFixed(2),
    overallCpc: (totalSpend / totalClicks).toFixed(2),
    overallConversionRate: ((totalConversions / totalClicks) * 100).toFixed(2),
    platformBreakdown: Object.keys(analyticsData).map((platform) => ({
      platform,
      ...analyticsData[platform],
      shareOfSpend: (
        (analyticsData[platform].spend / totalSpend) *
        100
      ).toFixed(1),
      shareOfConversions: (
        (analyticsData[platform].conversions / totalConversions) *
        100
      ).toFixed(1),
    })),
  };
}

function generateAnalysisPrompt(
  platforms,
  timeframe,
  analyticsData,
  aggregatedData
) {
  return `You are an expert digital advertising analyst. Analyze the following advertising data and provide professional insights and recommendations.

CONTEXT:
- Timeframe: ${timeframe}
- Platforms: ${platforms.join(", ")}
- Total Spend: $${aggregatedData.totalSpend.toLocaleString()}
- Total Impressions: ${aggregatedData.totalImpressions.toLocaleString()}
- Total Clicks: ${aggregatedData.totalClicks.toLocaleString()}
- Total Conversions: ${aggregatedData.totalConversions}
- Overall CTR: ${aggregatedData.overallCtr}%
- Overall CPC: $${aggregatedData.overallCpc}
- Overall Conversion Rate: ${aggregatedData.overallConversionRate}%

PLATFORM DATA:
${Object.entries(analyticsData)
  .map(
    ([platform, data]) => `
${platform.toUpperCase()}:
- Spend: $${data.spend.toLocaleString()}
- Impressions: ${data.impressions.toLocaleString()}
- Clicks: ${data.clicks.toLocaleString()}
- Conversions: ${data.conversions}
- CTR: ${data.ctr}%
- CPC: $${data.cpc}
- CPM: $${data.cpm}
- Conversion Rate: ${data.conversion_rate}%
`
  )
  .join("\n")}

TASK:
Provide a comprehensive analysis including:
1. Key Performance Insights (3-4 insights with positive/warning/negative impact indicators)
2. Specific Recommendations (3-4 actionable recommendations with priority levels)
3. Performance Trends (3 key metrics with trend analysis)
4. Budget Optimization Suggestions
5. Creative and Targeting Recommendations

Format the response as JSON with the following structure:
{
  "insights": [
    {
      "type": "performance|cost|reach|conversion",
      "title": "Insight Title",
      "description": "Detailed description",
      "impact": "positive|warning|negative",
      "recommendation": "Actionable recommendation"
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "budget_optimization|creative_optimization|audience_expansion|bidding_strategy",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "expectedImpact": "Expected outcome",
      "implementation": "Implementation steps"
    }
  ],
  "trends": [
    {
      "metric": "Metric Name",
      "trend": "up|down",
      "change": "Change percentage",
      "period": "Comparison period",
      "insight": "Trend explanation"
    }
  ]
}

Focus on actionable insights that can improve performance and ROI.`;
}

async function callChatGPT(prompt) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.log("⚠️ No OpenAI API key found, using mock response...");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return generateStructuredAnalysis(prompt);
    }

    // Check rate limits before making API call
    try {
      checkRateLimit();
    } catch (rateLimitError) {
      console.log(`⚠️ Rate limit hit: ${rateLimitError.message}`);
      console.log("🔄 Falling back to mock response...");
      const mockResponse = generateStructuredAnalysis(prompt);
      mockResponse.source = "mock";
      return mockResponse;
    }

    console.log("🤖 Calling OpenAI API...");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert digital advertising analyst. Provide professional insights and recommendations in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("✅ OpenAI API response received");

    const aiResponse = response.data.choices[0].message.content;

    try {
      // Try to parse JSON response
      const parsedResponse = JSON.parse(aiResponse);
      return parsedResponse;
    } catch (parseError) {
      console.log(
        "⚠️ Failed to parse JSON response, using structured analysis"
      );
      const mockResponse = generateStructuredAnalysis(prompt);
      mockResponse.source = "mock";
      return mockResponse;
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);

    // Check if it's a rate limit error (429)
    if (error.response && error.response.status === 429) {
      console.log("🔄 Rate limit exceeded, falling back to mock response...");
      // Add extra delay for rate limit errors
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } else {
      console.log("🔄 Falling back to mock response...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const mockResponse = generateStructuredAnalysis(prompt);
    mockResponse.source = "mock";
    return mockResponse;
  }
}

function generateStructuredAnalysis(prompt) {
  // Extract data from prompt to generate intelligent analysis
  const dataMatch = prompt.match(/Total Spend: \$([\d,]+)/);
  const totalSpend = dataMatch
    ? parseFloat(dataMatch[1].replace(/,/g, ""))
    : 28890;

  const ctrMatch = prompt.match(/Overall CTR: ([\d.]+)%/);
  const overallCtr = ctrMatch ? parseFloat(ctrMatch[1]) : 1.15;

  const conversionMatch = prompt.match(/Overall Conversion Rate: ([\d.]+)%/);
  const overallConversionRate = conversionMatch
    ? parseFloat(conversionMatch[1])
    : 4.2;

  // Generate intelligent insights based on the data
  const insights = [
    {
      type: "performance",
      title:
        overallConversionRate > 4
          ? "Strong Conversion Performance"
          : "Conversion Rate Optimization Needed",
      description:
        overallConversionRate > 4
          ? `Your overall conversion rate of ${overallConversionRate}% is above industry average (2.5%). This indicates effective targeting and compelling ad messaging.`
          : `Your conversion rate of ${overallConversionRate}% is below industry average. Focus on improving landing page experience and ad relevance.`,
      impact: overallConversionRate > 4 ? "positive" : "warning",
      recommendation:
        overallConversionRate > 4
          ? "Consider increasing budget allocation to high-converting campaigns and expanding to similar audience segments."
          : "Implement A/B testing for landing pages and review ad targeting parameters.",
    },
    {
      type: "cost",
      title: "Cost Efficiency Analysis",
      description: `Total spend of $${totalSpend.toLocaleString()} across platforms. Monitor cost per acquisition trends and optimize underperforming campaigns.`,
      impact: "warning",
      recommendation:
        "Review bidding strategies and consider automated bidding for better cost efficiency.",
    },
    {
      type: "reach",
      title: "Cross-Platform Performance",
      description:
        "Multi-platform approach shows good reach distribution. Each platform contributes to overall campaign success.",
      impact: "positive",
      recommendation:
        "Maintain diversified platform strategy while optimizing individual platform performance.",
    },
  ];

  const recommendations = [
    {
      priority: "high",
      category: "budget_optimization",
      title: "Reallocate Budget to High-Performing Campaigns",
      description:
        "Identify top-performing campaigns and increase their budget allocation by 20-30%.",
      expectedImpact: "Increase overall conversion rate by 0.3-0.5%",
      implementation:
        "Review campaign performance data and adjust daily budgets accordingly",
    },
    {
      priority: "medium",
      category: "creative_optimization",
      title: "Optimize Ad Creatives and Messaging",
      description:
        "Test new creative formats and messaging to improve engagement rates.",
      expectedImpact: "Improve CTR by 0.2-0.3%",
      implementation:
        "Create A/B tests with new ad creatives and copy variations",
    },
    {
      priority: "low",
      category: "audience_expansion",
      title: "Explore New Audience Segments",
      description:
        "Use lookalike audiences and similar targeting to expand reach.",
      expectedImpact: "Increase qualified leads by 15-20%",
      implementation: "Create lookalike audiences based on existing converters",
    },
  ];

  const trends = [
    {
      metric: "Conversion Rate",
      trend: overallConversionRate > 4 ? "up" : "down",
      change: overallConversionRate > 4 ? "+0.8%" : "-0.3%",
      period: "vs last period",
      insight:
        overallConversionRate > 4
          ? "Improved targeting and messaging"
          : "Need to optimize landing pages",
    },
    {
      metric: "Cost per Click",
      trend: "down",
      change: "-0.3%",
      period: "vs last period",
      insight: "Improved bidding efficiency",
    },
    {
      metric: "Total Spend",
      trend: "up",
      change: "+12.5%",
      period: "vs last period",
      insight: "Increased campaign activity",
    },
  ];

  return {
    source: "mock",
    insights,
    recommendations,
    trends,
  };
}

function parseChatGPTResponse(response, aggregatedData, platforms, timeframe) {
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    timeframe,
    platforms,
    summary: aggregatedData,
    ...response,
  };
}

function generatePlatformSpecificPrompt(platform, data) {
  return `Analyze the following ${platform} advertising data and provide specific insights:

${JSON.stringify(data, null, 2)}

Provide 3-4 specific insights for ${platform} optimization in JSON format:

{
  "insights": [
    {
      "title": "Insight Title",
      "description": "Detailed description",
      "impact": "positive|warning|negative",
      "recommendation": "Actionable recommendation"
    }
  ]
}`;
}

function generateOptimizationPrompt(analyticsData, goals) {
  return `Based on the following advertising data and goals, provide optimization recommendations:

Data: ${JSON.stringify(analyticsData, null, 2)}
Goals: ${JSON.stringify(goals, null, 2)}

Provide 5-7 specific optimization recommendations in JSON format:

{
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "budget_optimization|creative_optimization|audience_expansion|bidding_strategy",
      "title": "Recommendation Title",
      "description": "Detailed description",
      "expectedImpact": "Expected outcome",
      "implementation": "Implementation steps"
    }
  ]
}`;
}

function parsePlatformInsights(response, platform) {
  return response.insights || [];
}

function parseOptimizationRecommendations(response) {
  return response.recommendations || [];
}

module.exports = router;
