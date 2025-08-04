const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty().trim(),
    body("lastName").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, company } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        company,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed." });
    }
  }
);

// Login user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials." });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed." });
    }
  }
);

// Social authentication routes
router.post("/google", async (req, res) => {
  try {
    const {
      accessToken,
      idToken,
      email,
      firstName,
      lastName,
      avatar,
      socialId,
    } = req.body;

    if (!accessToken || !email) {
      return res
        .status(400)
        .json({ error: "Google authentication data is required." });
    }

    // In a real implementation, you would verify the Google token here
    // For now, we'll trust the client data
    const socialData = {
      provider: "google",
      socialId: socialId || `google_${Date.now()}`,
      email,
      firstName: firstName || "Google",
      lastName: "User",
      avatar,
      socialProfile: { accessToken, idToken },
    };

    const user = await User.findOrCreateBySocial(socialData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google authentication successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed." });
  }
});

router.post("/facebook", async (req, res) => {
  try {
    const { accessToken, email, firstName, lastName, avatar, socialId } =
      req.body;

    if (!accessToken || !email) {
      return res
        .status(400)
        .json({ error: "Facebook authentication data is required." });
    }

    // In a real implementation, you would verify the Facebook token here
    const socialData = {
      provider: "facebook",
      socialId: socialId || `facebook_${Date.now()}`,
      email,
      firstName: firstName || "Facebook",
      lastName: "User",
      avatar,
      socialProfile: { accessToken },
    };

    const user = await User.findOrCreateBySocial(socialData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Facebook authentication successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Facebook auth error:", error);
    res.status(500).json({ error: "Facebook authentication failed." });
  }
});

router.post("/linkedin", async (req, res) => {
  try {
    const { accessToken, email, firstName, lastName, avatar, socialId } =
      req.body;

    if (!accessToken || !email) {
      return res
        .status(400)
        .json({ error: "LinkedIn authentication data is required." });
    }

    // In a real implementation, you would verify the LinkedIn token here
    const socialData = {
      provider: "linkedin",
      socialId: socialId || `linkedin_${Date.now()}`,
      email,
      firstName: firstName || "LinkedIn",
      lastName: "User",
      avatar,
      socialProfile: { accessToken },
    };

    const user = await User.findOrCreateBySocial(socialData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "LinkedIn authentication successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("LinkedIn auth error:", error);
    res.status(500).json({ error: "LinkedIn authentication failed." });
  }
});

router.post("/twitter", async (req, res) => {
  try {
    const { accessToken, email, firstName, lastName, avatar, socialId } =
      req.body;

    if (!accessToken) {
      return res
        .status(400)
        .json({ error: "Twitter authentication data is required." });
    }

    // In a real implementation, you would verify the Twitter token here
    const socialData = {
      provider: "twitter",
      socialId: socialId || `twitter_${Date.now()}`,
      email: email || `twitter_${Date.now()}@example.com`,
      firstName: firstName || "Twitter",
      lastName: "User",
      avatar,
      socialProfile: { accessToken },
    };

    const user = await User.findOrCreateBySocial(socialData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Twitter authentication successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Twitter auth error:", error);
    res.status(500).json({ error: "Twitter authentication failed." });
  }
});

// TEST ROUTE: Upgrade user subscription to basic for testing
router.post("/upgrade-subscription", auth, async (req, res) => {
  try {
    const user = req.user;

    // Upgrade to basic subscription
    user.subscription = {
      plan: "basic",
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };

    await user.save();

    res.json({
      message: "Subscription upgraded to basic successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    res.status(500).json({ error: "Failed to upgrade subscription." });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user data." });
  }
});

// Logout (client-side token removal)
router.post("/logout", auth, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed." });
  }
});

module.exports = router;
