import express from "express";
import { PackageController } from "../controllers/packageController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  uploadPackageImages,
  handleUploadError,
} from "../middlewares/upload.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middlewares/validation.js";
import {
  createPackageValidation,
  updatePackageValidation,
  packageQueryValidation,
} from "../validations/packageValidation.js";
import Joi from "joi";

const router = express.Router();

const idValidation = Joi.object({
  id: Joi.number().integer().positive().required(),
});

// Public routes
router.get(
  "/",
  validateQuery(packageQueryValidation),
  PackageController.getPackages,
);
router.get(
  "/:id",
  validateParams(idValidation),
  PackageController.getPackageById,
);

// Company routes
router.post(
  "/",
  authenticate,
  authorize("COMPANY"),
  uploadPackageImages,
  handleUploadError,
  validate(createPackageValidation),
  PackageController.createPackage,
);

router.put(
  "/:id",
  authenticate,
  authorize("COMPANY"),
  validateParams(idValidation),
  uploadPackageImages,
  handleUploadError,
  validate(updatePackageValidation),
  PackageController.updatePackage,
);

router.delete(
  "/:id",
  authenticate,
  authorize("COMPANY"),
  validateParams(idValidation),
  PackageController.deletePackage,
);

router.get(
  "/my/packages",
  authenticate,
  authorize("COMPANY"),
  validateQuery(packageQueryValidation),
  PackageController.getMyPackages,
);

router.patch(
  "/:id/toggle-status",
  authenticate,
  authorize("COMPANY"),
  validateParams(idValidation),
  PackageController.togglePackageStatus,
);

export default router;
