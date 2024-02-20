import {
  createPaymentController,
  createPaymentSchema,
  inquiryPaymentController,
  inquiryPaymentSchema,
} from "../controllers/payment(v1)/payment.controller";

import {
  createPaymentControllerZibal,
  createPaymentSchemaZibal,
  inquiryPaymentControllerZibal,
  inquiryPaymentSchemaZibal,
  
} from "../controllers/payment(v1)/payment.zibal.controller";


import { router, userProtectedProcedure } from "../trpc";

export const paymentRouter = router({
  createPayment: (process.env.PAYMENT_PROVIDER as string == "IDPAY") ? userProtectedProcedure
    .input(createPaymentSchema)
    .mutation(createPaymentController) : userProtectedProcedure
    .input(createPaymentSchemaZibal)
    .mutation(createPaymentControllerZibal) ,
  inquiryPayment: (process.env.PAYMENT_PROVIDER as string == "IDPAY") ? userProtectedProcedure
    .input(inquiryPaymentSchema)
    .mutation(inquiryPaymentController) : userProtectedProcedure
    .input(inquiryPaymentSchemaZibal)
    .mutation(inquiryPaymentControllerZibal),
});
