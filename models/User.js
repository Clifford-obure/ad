const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is required only if not using social login
        return !this.socialLogin;
      },
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    // Social authentication fields
    socialLogin: {
      provider: {
        type: String,
        enum: ["google", "facebook", "linkedin", "twitter"],
      },
      socialId: {
        type: String,
        sparse: true, // Allows multiple null values
      },
      socialEmail: {
        type: String,
        lowercase: true,
        trim: true,
      },
      socialProfile: {
        type: mongoose.Schema.Types.Mixed, // Store additional profile data
      },
    },
    avatar: {
      type: String,
      trim: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "active",
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    preferences: {
      timezone: {
        type: String,
        default: "UTC",
      },
      currency: {
        type: String,
        default: "USD",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for social login
userSchema.index(
  { "socialLogin.provider": 1, "socialLogin.socialId": 1 },
  { unique: true, sparse: true }
);

// Hash password before saving (only if password is provided)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to find or create user by social login
userSchema.statics.findOrCreateBySocial = async function (socialData) {
  const {
    provider,
    socialId,
    email,
    firstName,
    lastName,
    avatar,
    socialProfile,
  } = socialData;

  // First try to find by social ID
  let user = await this.findOne({
    "socialLogin.provider": provider,
    "socialLogin.socialId": socialId,
  });

  if (user) {
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    return user;
  }

  // If not found by social ID, try to find by email
  if (email) {
    user = await this.findOne({ email });
    if (user) {
      // Link social account to existing user
      user.socialLogin = {
        provider,
        socialId,
        socialEmail: email,
        socialProfile,
      };
      if (avatar) user.avatar = avatar;
      user.lastLogin = new Date();
      await user.save();
      return user;
    }
  }

  // Create new user
  user = new this({
    email,
    firstName,
    lastName,
    avatar,
    socialLogin: {
      provider,
      socialId,
      socialEmail: email,
      socialProfile,
    },
    lastLogin: new Date(),
  });

  await user.save();
  return user;
};

module.exports = mongoose.model("User", userSchema);
