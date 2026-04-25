import express from "express";
import { BookingController } from "../controllers/bookingController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middlewares/validation.js";
import {
  createBookingValidation,
  updateBookingValidation,
  bookingQueryValidation,
} from "../validations/bookingValidation.js";
import Joi from "joi";

const router = express.Router();

const idValidation = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const statusUpdateValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .required(),
});

// User routes
router.post(
  "/",
  authenticate,
  authorize("USER"),
  validate(createBookingValidation),
  BookingController.createBooking,
);

router.get(
  "/my",
  authenticate,
  authorize("USER"),
  validateQuery(bookingQueryValidation),
  BookingController.getMyBookings,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("USER"),
  validateParams(idValidation),
  BookingController.cancelBooking,
);

// Company routes
router.get(
  "/company",
  authenticate,
  authorize("COMPANY"),
  validateQuery(bookingQueryValidation),
  BookingController.getCompanyBookings,
);

router.get(
  "/company/stats",
  authenticate,
  authorize("COMPANY"),
  BookingController.getBookingStats,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("COMPANY"),
  validateParams(idValidation),
  validate(statusUpdateValidation),
  BookingController.updateBookingStatus,
);

router.post(
  "/:id/send-confirmation",
  authenticate,
  authorize("COMPANY"),
  validateParams(idValidation),
  BookingController.sendBookingConfirmation,
);

// Shared routes (user can view their bookings, company can view their package bookings)
router.get(
  "/:id",
  authenticate,
  authorize("USER", "COMPANY"),
  validateParams(idValidation),
  BookingController.getBookingById,
);

export default router;
