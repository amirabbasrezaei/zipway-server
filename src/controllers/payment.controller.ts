import { z } from "zod";
import { Context } from "../context";
import axios from "axios";
import { TRPCError } from "@trpc/server";

const BASE_URL = `https://api.idpay.ir/v1.1`;

type UserRouterArgsController<T = null> = T extends null
  ? { 
      ctx: Context;
    }
  : {
      ctx: Context;
      input: T;
    };

export const createPaymentSchema = z.object({
  amount: z.number(),
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
  const { user, prisma } = ctx;

  const findUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });
  if (!findUser) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "کاربر وجود ندارد",
    });
  }

  const body = {
    order_id: 106,
    callback: "https://zipway.ir/payment",
    phone: findUser.phoneNumber,
    mail: "zipwaysupp@gmail.com",
    name: findUser.name,
    desc: "",
    amount: input.amount,
  };
  try {
    const payment = await ctx.prisma.payment.create({
      data: {
        userId: user.userId,
        value: input.amount,
      },
    });
    const { data } = await axios.post(`${BASE_URL}/payment`, body, {
      headers: {
        "X-API-KEY": "b99a4efa-4da2-4a08-9d01-ed0c5ba5a33a",
        "X-SANDBOX": true,
      },
    });
    if (data) {
      const updatedPayment = await ctx.prisma.payment.update({
        data: {
          servicePaymentId: data.id,
        },
        where: {
          id: payment.id,
        },
      });
      console.log(updatedPayment);
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
