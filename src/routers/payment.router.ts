import {
  createPaymentController,
  createPaymentSchema,
  inquiryPaymentController,
  inquiryPaymentSchema,
} from "../controllers/payment.controller";
import { router, userProtectedProcedure } from "../trpc";

export const paymentRouter = router({
  createPayment: userProtectedProcedure
    .input(createPaymentSchema)
    .mutation(createPaymentController),
  inquiryPayment: userProtectedProcedure
    .input(inquiryPaymentSchema)
    .mutation(inquiryPaymentController),
});
