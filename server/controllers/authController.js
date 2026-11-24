import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";





export const registerAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ userName });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      userName,
      password: hashedPassword,
    });

    await admin.save();

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      user: { userName }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const admin = await Admin.findOne({ userName });
    if (!admin) return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,   // prevents JS access to cookie (security)
      secure: process.env.NODE_ENV === "production", // send only on HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { userName }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { userName, currentPassword, newPassword, confirmPassword } = req.body || {};
    if (typeof userName !== "string" || !userName ||
        typeof currentPassword !== "string" || !currentPassword ||
        typeof newPassword !== "string" || !newPassword ||
        typeof confirmPassword !== "string" || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (Buffer.byteLength(newPassword, "utf8") > 72 || Buffer.byteLength(confirmPassword, "utf8") > 72) {
      return res.status(400).json({ message: "Passwords must be 72 UTF-8 bytes or fewer." });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match." });
    }

    const admin = await Admin.findOne({ userName });
    if (!admin || !(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid username or current password." });
    }

    const verifiedHash = admin.password;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await Admin.updateOne(
      { _id: admin._id, password: verifiedHash },
      { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount !== 1) {
      return res.status(409).json({ message: "Password changed by another request. Please try again." });
    }

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch {
    return res.status(500).json({ message: "Unable to update password. Please try again." });
  }
};



export const logoutAdmin = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
