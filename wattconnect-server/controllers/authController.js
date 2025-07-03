const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      isExistingCustomer,
      consumerNumber,
      usageType,
      category,
    } = req.body;

    console.log("📝 Signup attempt for:", username);

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (isExistingCustomer) {
      if (!/^\d{12}$/.test(consumerNumber)) {
        return res.status(400).json({ message: "Valid 12-digit consumer number is required" });
      }
      if (!usageType || !["domestic", "commercial"].includes(usageType)) {
        return res.status(400).json({ message: "Usage type must be 'domestic' or 'commercial'" });
      }
      if (!category || category.trim() === "") {
        return res.status(400).json({ message: "Category is required for existing customers" });
      }
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name.trim(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === "admin" ? "admin" : "customer",
      isExistingCustomer,
      consumerNumber: isExistingCustomer ? consumerNumber : undefined,
      usageType: isExistingCustomer ? usageType : undefined,
      category: isExistingCustomer ? category : undefined,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isExistingCustomer: user.isExistingCustomer,
        consumerNumber: user.consumerNumber || null,
        usageType: user.usageType || null,
        category: user.category || null,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔐 Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isExistingCustomer: user.isExistingCustomer,
        consumerNumber: user.consumerNumber || null,
        usageType: user.usageType || null,
        category: user.category || null,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "username email role consumerNumber usageType category isExistingCustomer"
    );

    console.log("🔎 getMe response user:", user);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isExistingCustomer: user.isExistingCustomer,
      consumerNumber: user.consumerNumber || null,
      usageType: user.usageType || null,
      category: user.category || null,
    });
  } catch (err) {
    console.error("❌ Error in getMe controller:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { email } = req.body;

    if (req.user.username !== username) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { email } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: "Server error during profile update" });
  }
};
