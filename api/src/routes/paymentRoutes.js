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

const refundValidation = Joi.object({
  amount: Joi.number().positive().required(),
  reason: Joi.string().required(),
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

// Verify payment status
router.get(
  "/:id/verify",
  authenticate,
  authorize("USER"),
  validateParams(idValidation),
  PaymentController.verifyPayment,
);

// Process refund (admin only)
router.post(
  "/:id/refund",
  authenticate,
  authorize("ADMIN"),
  validateParams(idValidation),
  validate(refundValidation),
  PaymentController.processRefund,
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

// Webhook endpoints (no authentication required)
router.post("/telebirr/webhook", PaymentController.handleTelebirrWebhook);
router.post("/chapa/webhook", PaymentController.handleChapaWebhook);

export default router;
