import { z } from "zod";
import { Context } from "../context";
import axios from "axios";
import { TRPCError } from "@trpc/server";

const BASE_URL = `https://api.idpay.ir/v1.1`;

const HEADERS = {
  headers: {
    "X-API-KEY": "b99a4efa-4da2-4a08-9d01-ed0c5ba5a33a",
    // "X-SANDBOX": true,
  },
};

type PaymentRouterArgsController<T = null> = T extends null
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
}: PaymentRouterArgsController<CreatePayment>): Promise<CreatePaymentPayload> {
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

  try {
    const payment = await ctx.prisma.payment.create({
      data: {
        userId: user.userId,
        value: input.amount,
      },
    });
    const body = {
      order_id: payment.id,
      callback: "https://zipway.ir/payment",
      phone: findUser.phoneNumber,
      mail: "zipwaysupp@gmail.com",
      name: findUser.name,
      desc: "",
      amount: input.amount,
    };
    const { data } = await axios.post(`${BASE_URL}/payment`, body, HEADERS);
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

export const inquiryPaymentSchema = z.object({
  servicePaymentId: z.string(),
  order_id: z.string(),
  track_id: z.string(),
});

export enum PaymentStatus {
  PAYED,
  NOTPAYED,
}

type InquiryPaymentPayload =
  | { paymentStatus: PaymentStatus | null; message: string | null }
  | TRPCError;

export type InquiryPayment = z.infer<typeof inquiryPaymentSchema>;
export async function inquiryPaymentController({
  input,
  ctx,
}: PaymentRouterArgsController<InquiryPayment>): Promise<InquiryPaymentPayload> {
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

  const inquiryBody = {
    id: input.servicePaymentId,
    order_id: input.order_id,
  };

  try {
    const inquiryResponse = await axios.post(
      `${BASE_URL}/payment/inquiry`,
      inquiryBody,
      HEADERS
    );
    if ([101, 100].filter((e) => inquiryResponse.data.status === e).length) {
      const verifyPaymentBody = {
        id: input.servicePaymentId,
        order_id: input.order_id,
      };
      try {
        const verifyPaymentResponse = await axios.post(
          `${BASE_URL}/payment/verify`,
          verifyPaymentBody,
          HEADERS
        );
        if (verifyPaymentResponse?.data?.verify?.date) {
          await prisma.payment.update({
            where: {
              id: input.order_id,
              servicePaymentId: input.servicePaymentId,
              trackId: input.track_id,
            },
            data: {
              isPayed: true,
              payment_success_date: new Date(Date.now()),
            },
          });
          await prisma.user.update({
            where: {
              id: user.userId,
            },
            data: {
              credit: {
                increment: inquiryResponse.data.amount,
              },
            },
          });
          return {
            paymentStatus: PaymentStatus.PAYED,
            message: "پرداخت موفقیت آمیز بود و کیف پول شما شارژ شد.",
          };
        }
        return {
          paymentStatus: PaymentStatus.PAYED,
          message: "پرداخت انجام شده ولی تائید تراکنش بت خطا مواجه شد",
        };
      } catch (error) {
        console.log(error);
      }

      return { paymentStatus: PaymentStatus.PAYED, message: null };
    }
    return {
      paymentStatus: PaymentStatus.NOTPAYED,
      message: "تراکنش ناموفق بوده است.",
    };
  } catch (error) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause: "paymentService inquiry problem",
    });
  }
}
