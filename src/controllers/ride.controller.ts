import { z } from "zod";
import { RouterArgsController } from "./type";
import { TRPCError } from "@trpc/server";

//// createNewRide

export const requestRideControllerArgsSchema = z.object({
  originCoordinate: z.number().array(),
  destinationCoordinates: z.number().array(),
  destinationDescription: z.string(),
  originDescription: z.string(),
});

export const requestNewRidePayloadSchema = z.object({
  data: z
    .object({
      rideId: z.string(),
      showPrices: z.boolean(),
    })
    .optional(),
  result: z.enum(["OK", "FAILED"]),
});

export type RequestNewRideControllerArgs = z.infer<
  typeof requestRideControllerArgsSchema
>;
export type RequestNewRideControllerPayload = z.infer<
  typeof requestNewRidePayloadSchema
>;
export async function requestNewRideController({
  input,
  ctx,
}: RouterArgsController<RequestNewRideControllerArgs>): Promise<
  RequestNewRideControllerPayload | TRPCError
> {
  const { prisma } = ctx;

  const findUser = await prisma.user.findUnique({
    where: {
      id: "sfhbdgncb",
    },
  });
  if (!findUser) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "کاربر وجود ندارد",
    });
  }
  try {
    const createdRide = await prisma.ride.create({
      data: {
        destinationDescription: input.destinationDescription,
        originDescription: input.originDescription,
        originCoordinate: input.originCoordinate,
        destinationCoordinates: input.destinationCoordinates,
        passenger: {
          connect: {
            id: findUser.id,
          },
        },
      },
    });
    return { result: "OK", data: { rideId: createdRide.id, showPrices: true } };
  } catch (error) {
    console.log(error);
    return { result: "FAILED" };
  }
}

//// *** ////

//// update ride ////
const RideStatusSchema = z.enum([
  "FINDING_DRIVER",
  "ACCEPTED",
  "CANCELLED",
  "NOT_FOUND",
  "NOT_INITIATED",
]);

const rideProviderSchema = z.enum(["SNAPP", "TAPSI", "MAXIM"]);

const ServiceProviderSchema = z.object({
  tripId: z.string(),
  type: z.string(),
  price: z.number(),
});
const TapsiProviderSchema = z.object({
  tripId: z.string(),
  type: z.string(),
  price: z.number(),
  tripToken: z.string(),
  categoryType: z.string(),
});

const DriverTypeSchema = z.object({
  plate: z.object({
    character: z.string(),
    iran_id: z.number(),
    part_a: z.number(),
    part_b: z.number(),
  }),
  cellphone: z.string(),
  driver_name: z.string(),
  image_url: z.string(),
  plate_number_url: z.string(),
  vehicle_color: z.string(),
  vehicle_model: z.string(),
  driver_location_info: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});
export const updateRideControllerArgsSchema = z.object({
  status: RideStatusSchema,
  snappPrices: ServiceProviderSchema.array().optional(),
  tapsiPrices: TapsiProviderSchema.array().optional(),
  maximPrices: ServiceProviderSchema.array().optional(),
  rideId: z.string(),
  trip: z
    .object({
      provider: rideProviderSchema,
      type: z.string(),
      accepted: z.boolean(),
      tripId: z.string(),
      driverInfo: DriverTypeSchema,
      price: z.number(),
      categoryType: z.string().optional(),
      numberOfPassengers: z.number(),
    })
    .optional(),
});

export const updateRidePayloadSchema = z.object({
  rideId: z.string(),
  result: z.enum(["OK", "FAILED"]),
});

export type UpdateRideControllerArgs = z.infer<
  typeof updateRideControllerArgsSchema
>;
export type UpdateRideControllerPayload = z.infer<
  typeof updateRidePayloadSchema
>;

export async function updateRideController({
  input,
  ctx,
}: RouterArgsController<UpdateRideControllerArgs>): Promise<
  UpdateRideControllerPayload | TRPCError
> {
  const { prisma } = ctx;

  const findRide = await prisma.ride.findFirst({
    where: {
      id: input.rideId,
      AND: {
        passenger: {
          every: {
            id: "sfhbdgncb",
          },
        },
      },
    },
  });
  if (!findRide) {
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "سفری یافت نشد",
    });
  }

  if (input.status == "NOT_INITIATED") {
    await prisma.ride.update({
      where: {
        id: findRide.id,
      },
      data: {
        Status: input.status,
      },
    });
    if (input.snappPrices?.length) {
      try {
        await prisma.snappRide.createMany({
          data: input.snappPrices.map((service) => ({
            serviceType: service.type,
            price: service.price,
            id: service.tripId,
            rideId: input.rideId,
          })),
        });
      } catch (error) {
        console.log(error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در افزودن قیمت سفر ها",
        });
      }
    }
    if (input.tapsiPrices?.length) {
      try {
        await prisma.tapsiRide.createMany({
          data: input.tapsiPrices.map((service) => ({
            serviceType: service.type,
            price: service.price,
            categoryType: service.categoryType,
            id: service.tripId,
            rideId: input.rideId,
            token: service.tripToken,
          })),
        });
      } catch (error) {
        console.log(error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در افزودن قیمت سفر ها",
        });
      }
    }
    if (input.maximPrices?.length) {
      try {
        await prisma.maximRide.createMany({
          data: input.maximPrices.map((service) => ({
            serviceType: service.type,
            price: service.price,
            id: service.tripId,
            rideId: input.rideId,
          })),
        });
      } catch (error) {
        console.log(error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در افزودن قیمت سفر ها",
        });
      }
    }
  }
  if (input.status == "FINDING_DRIVER") {
    try {
      await prisma.ride.update({
        where: {
          id: findRide.id,
        },
        data: {
          Status: input.status,
        },
      });
    } catch (error) {
      console.log(error);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while update ride status",
      });
    }
  }
  if (input.status == "NOT_FOUND") {
    try {
      await prisma.ride.update({
        where: {
          id: findRide.id,
        },
        data: {
          Status: input.status,
        },
      });
    } catch (error) {
      console.log(error);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while update ride status",
      });
    }
  }

  if (input.status == "ACCEPTED" && input?.trip) {
    try {
      await prisma.user.update({
        where: {
          id: "sfhbdgncb",
        },
        data: {
          credit: {
            decrement: Number(process.env.COMMISSION),
          },
        },
      });
    } catch (error) {
      console.log(error);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while applying commission",
      });
    }

    try {
      await prisma.ride.update({
        where: {
          id: findRide.id,
        },
        data: {
          Status: input.status,
          chosenServiceProvider: input.trip.provider,
          finalPrice: input.trip.price,
          numberOfPassengers: input.trip.numberOfPassengers,
          commission: Number(process.env.COMMISSION),
        },
      });
    } catch (error) {
      console.log(error);
      return new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while updating trip info",
      });
    }
  }

  return { result: "OK", rideId: input.rideId };
}

//// *** ////

//// get User Rides ////
export async function userRidesController({ ctx }: RouterArgsController) {
  const { prisma } = ctx;
  return await prisma.ride.findMany({
    where: {
      passenger: {
        every: {
          id: "sfhbdgncb",
        },
      },
    },
    include: {
      snappPrices: {},
    },
  });
}

//// *** ////
