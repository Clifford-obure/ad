const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("firstName").optional().trim(),
    body("lastName").optional().trim(),
    body("company").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, company } = req.body;
      const user = req.user;

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (company) user.company = company;

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  }
);

// Update user preferences
router.put(
  "/preferences",
  auth,
  [
    body("timezone").optional().isString(),
    body("currency").optional().isString(),
    body("notifications.email").optional().isBoolean(),
    body("notifications.push").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { timezone, currency, notifications } = req.body;
      const user = req.user;

      if (timezone) user.preferences.timezone = timezone;
      if (currency) user.preferences.currency = currency;
      if (notifications) {
        if (notifications.email !== undefined) {
          user.preferences.notifications.email = notifications.email;
        }
        if (notifications.push !== undefined) {
          user.preferences.notifications.push = notifications.push;
        }
      }

      await user.save();

      res.json({
        message: "Preferences updated successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  }
);

// Change password
router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = req.user;

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

// Delete account
router.delete("/account", auth, async (req, res) => {
  try {
    const user = req.user;
    user.isActive = false;
    await user.save();

    res.json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

module.exports = router;
