const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ error: "Invalid token or user not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

const requireSubscription = (plan) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const subscriptionPlans = ["free", "basic", "pro", "enterprise"];
    const userPlanIndex = subscriptionPlans.indexOf(user.subscription.plan);
    const requiredPlanIndex = subscriptionPlans.indexOf(plan);

    if (userPlanIndex < requiredPlanIndex) {
      return res.status(403).json({
        error: `This feature requires a ${plan} subscription or higher.`,
      });
    }

    next();
  };
};

module.exports = { auth, optionalAuth, requireSubscription };
