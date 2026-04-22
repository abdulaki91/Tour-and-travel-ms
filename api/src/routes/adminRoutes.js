import express from "express";
import { AdminController } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import { validate, validateParams } from "../middlewares/validation.js";
import Joi from "joi";

const router = express.Router();

const userIdValidation = Joi.object({
  userId: Joi.number().integer().positive().required(),
});

const companyIdValidation = Joi.object({
  companyId: Joi.number().integer().positive().required(),
});

const userStatusValidation = Joi.object({
  is_active: Joi.boolean().required(),
});

const companyVerificationValidation = Joi.object({
  is_verified: Joi.boolean().required(),
});

// All admin routes require ADMIN role
router.use(authenticate);
router.use(authorize("ADMIN"));

// Dashboard and Stats
router.get("/dashboard", AdminController.getDashboard);
router.get("/stats", AdminController.getDashboard); // Add stats endpoint that uses same controller

// User management
router.get("/users", AdminController.getAllUsers);
router.patch(
  "/users/:userId/status",
  validateParams(userIdValidation),
  validate(userStatusValidation),
  AdminController.updateUserStatus,
);
router.delete(
  "/users/:userId",
  validateParams(userIdValidation),
  AdminController.deleteUser,
);

// Company management
router.get("/companies", AdminController.getAllCompanies);
router.patch(
  "/companies/:companyId/verify",
  validateParams(companyIdValidation),
  validate(companyVerificationValidation),
  AdminController.verifyCompany,
);

export default router;
