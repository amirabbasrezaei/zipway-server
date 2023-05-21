import { z } from "zod";
import { Context } from "../context";
import axios from "axios";
import { TRPCError } from "@trpc/server";

const BASE_URL = `https://api.idpay.ir/v1.1`;

type UserRouterArgsController<T = null> = T extends null
  ? {
      ctx: Context<any>;
    }
  : {
      ctx: Context<any>;
      input: T;
    };

export const createPaymentSchema = z.object({
  amount: z.number(),
  name: z.string(),
  desc: z.string(),
});

type CreatePaymentPayload =
  | {
      pay_link?: string;
      message?: string;
    }
  | any;

export type CreatePayment = z.infer<typeof createPaymentSchema>;
export async function createPaymentController({
  input,
  ctx,
}: UserRouterArgsController<CreatePayment>): Promise<CreatePaymentPayload> {
  const { user } = ctx;
  const body = {
    order_id: 106,
    callback: "http://localhost:3000/payment",
    phone: "09038338886",
    mail: "adsad",
    ...input,
  };

  try {
    const { data } = await axios.post(`${BASE_URL}/payment`, body, {
      headers: {
        "X-API-KEY": "b99a4efa-4da2-4a08-9d01-ed0c5ba5a33a",
        "X-SANDBOX": true,
      },
    });
    if (data) {
      const payment = ctx.prisma.payment.create({
        data: {
          paymentId: data.id,
          userId: user.userId,
          value: input.amount,
        },
      });
      console.log(payment);
    }

    return { pay_link: data.link };
  } catch (error) {
    console.log(error);
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "مشکل ارتباط با سرویس پرداخت",
    });
  }
}
