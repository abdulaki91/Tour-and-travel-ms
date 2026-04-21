import express from "express";
import { PaymentController } from "../controllers/paymentController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middlewares/validation.js";
import {
  createPaymentValidation,
  processPaymentValidation,
  paymentQueryValidation,
} from "../validations/paymentValidation.js";
import Joi from "joi";

const router = express.Router();

const idValidation = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const bookingIdValidation = Joi.object({
  bookingId: Joi.number().integer().positive().required(),
});

// User routes
router.post(
  "/booking/:bookingId",
  authenticate,
  authorize("USER"),
  validateParams(bookingIdValidation),
  validate(createPaymentValidation),
  PaymentController.createPayment,
);

router.post(
  "/:id/process",
  authenticate,
  authorize("USER"),
  validateParams(idValidation),
  validate(processPaymentValidation),
  PaymentController.processPayment,
);

router.get(
  "/my",
  authenticate,
  authorize("USER"),
  validateQuery(paymentQueryValidation),
  PaymentController.getMyPayments,
);

router.get(
  "/:id",
  authenticate,
  authorize("USER"),
  validateParams(idValidation),
  PaymentController.getPaymentById,
);

router.get(
  "/booking/:bookingId",
  authenticate,
  authorize("USER"),
  validateParams(bookingIdValidation),
  PaymentController.getBookingPayments,
);

export default router;
