// routes/adminRoutes.js
import express from "express";
import { changeAdminPassword, loginAdmin, logoutAdmin, registerAdmin } from "../controllers/authController.js";
import { changePasswordLimiter } from "../middleware/changePasswordLimiter.js";
import {
  connectGoogleDrive,
  googleDriveCallback,
} from "../controllers/googleDriveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();




router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/change-password", changePasswordLimiter, changeAdminPassword);

router.post("/logout", logoutAdmin)

router.get("/google-drive/connect", protect, connectGoogleDrive);
router.get("/google-drive/callback", googleDriveCallback);

export default router;
