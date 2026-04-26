import express from "express";
import { CompanyController } from "../controllers/companyController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Company profile routes
router.get(
  "/profile",
  authenticate,
  authorize("COMPANY"),
  CompanyController.getProfile,
);

router.put(
  "/profile",
  authenticate,
  authorize("COMPANY"),
  CompanyController.updateProfile,
);

export default router;
