import {
  createPaymentController,
  createPaymentSchema,
} from "../controllers/payment.controller";
import { router, publicProcedure } from "../trpc";

export const paymentRouter = router({
  createPayment: publicProcedure
    .input(createPaymentSchema)
    .mutation(createPaymentController),
});
