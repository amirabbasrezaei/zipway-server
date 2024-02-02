import { z } from "zod";
import { RouterArgsController } from "./type";
import { TRPCError } from "@trpc/server";
import { Ride } from "prisma/prisma-client";
import {
  getCommission,
  getCommissionPayloadSchema,
} from "../helper/ride.helper";

//// createNewRide

const DestinattionCoordinateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const requestRideControllerArgsSchema = z.object({
  originCoordinate: DestinattionCoordinateSchema,
  destinationCoordinates: DestinattionCoordinateSchema.array(),
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
}: RouterArgsController<RequestNewRideControllerArgs>): Promise<RequestNewRideControllerPayload> {
  const { prisma, user } = ctx;

  const findUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });
  if (!findUser) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "کاربر وجود ندارد",
    });
  }

  try {
    // const findEmptyRide = await prisma.ride.findFirst({
    //   where: {
    //     Status: "NOT_INITIATED",
    //     passenger: { every: { id: user.userId } },
    //   },
    // });
    // if (findEmptyRide) {
    //   await prisma.ride.update({
    //     where: { id: findEmptyRide.id },
    //     data: {
    //       createdDate: new Date(Date.now()),
    //     },
    //   });
    //   return {
    //     result: "OK",
    //     data: { rideId: findEmptyRide.id, showPrices: true },
    //   };
    // }
    const createdRide = await prisma.ride.create({
      data: {
        destinationDescription: input.destinationDescription,
        originDescription: input.originDescription,
        originCoordinate: [
          input.originCoordinate.longitude,
          input.originCoordinate.latitude,
        ],
        destinationCoordiante: {
          createMany: {
            data: input.destinationCoordinates.map((coordinate) => ({
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            })),
          },
        },
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
  tripId: z.string().optional(),
  type: z.string(),
  price: z.number(),
});
const TapsiProviderSchema = z.object({
  tripId: z.string().optional(),
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
      tripId: z.string().optional(),
      driverInfo: DriverTypeSchema.optional(),
      price: z.number(),
      categoryType: z.string().optional(),
      numberOfPassengers: z.number().optional(),
    })
    .optional(),
});

export const updateRidePayloadSchema = z.object({
  rideId: z.string(),
  result: z.enum(["OK", "FAILED"]),
  commission: getCommissionPayloadSchema.optional(),
  message: z.string().optional(),
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
}: RouterArgsController<UpdateRideControllerArgs>): Promise<UpdateRideControllerPayload> {
  const { prisma, user } = ctx;

  const findRide = await prisma.ride.findFirst({
    where: {
      id: input.rideId,
      AND: {
        passenger: {
          every: {
            id: user.userId,
          },
        },
      },
    },
  });
  if (!findRide) {
    throw new TRPCError({
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
        await prisma.$transaction([
          prisma.snappRide.deleteMany({
            where: {
              rideId: findRide.id,
            },
          }),
          prisma.snappRide.createMany({
            data: input.snappPrices.map((service) => ({
              serviceType: service.type,
              price: service.price,
              rideId: findRide.id,
            })),
          }),
        ]);
        return {
          result: "OK",
          rideId: findRide.id,
          commission: await getCommission({ prisma, rideId: findRide.id }),
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در افزودن قیمت سفر ها",
        });
      }
    }
    if (input.tapsiPrices?.length) {
      console.log(input.tapsiPrices[0].tripId);
      try {
        await prisma.$transaction([
          prisma.tapsiRide.deleteMany({
            where: {
              rideId: findRide.id,
            },
          }),
          prisma.tapsiRide.createMany({
            data: input.tapsiPrices.map((service) => ({
              serviceType: service.type,
              price: service.price,
              categoryType: service.categoryType,
              // id: `${service.tripId}_${service.categoryType}_${service.type}`,
              rideId: findRide.id,
              token: service.tripToken,
            })),
          }),
        ]);

        return {
          result: "OK",
          rideId: findRide.id,
          commission: await getCommission({ prisma, rideId: findRide.id }),
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
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
            id: `${service.tripId}_${service.type}`,
            rideId: input.rideId,
            maximRideId: service.tripId,
          })),
        });
        return {
          result: "OK",
          rideId: findRide.id,
          commission: await getCommission({ prisma, rideId: findRide.id }),
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "خطا در افزودن قیمت سفر ها",
        });
      }
    }
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "require at least one of services price",
    });
  }
  if (input.status == "FINDING_DRIVER") {
    const user_credit = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { credit: true },
    });
    if (user_credit && user_credit?.credit < Number(process.env.COMMISSION)) {
      return {
        result: "FAILED",
        rideId: findRide.id,
        message: "اعتبار کافی نیست",
      };
    }
    try {
      await prisma.ride.update({
        where: {
          id: findRide.id,
        },
        data: {
          Status: input.status,
          chosenServiceProvider: input.trip?.provider,
          numberOfPassengers: input.trip?.numberOfPassengers,
        },
      });
      if (input.trip?.provider == "SNAPP") {
        const chosenService = await prisma.snappRide.findFirst({
          where: {
            serviceType: input.trip.type,

            AND: {
              rideId: findRide.id,
            },
          },
          select: {
            id: true,
          },
        });

        await prisma.snappRide.update({
          where: {
            id: chosenService?.id,
          },
          data: {
            isChosen: true,
          },
        });

        return {
          result: "OK",
          rideId: findRide.id,
        };
      }
      if (input.trip?.provider == "TAPSI") {
        console.log(input.trip.type, input.trip.categoryType);

        const chosenService = await prisma.tapsiRide.findFirst({
          where: {
            serviceType: input.trip.type,
            categoryType: input.trip.categoryType,
            AND: {
              rideId: findRide.id,
            },
          },
          select: {
            id: true,
          },
        });

        await prisma.tapsiRide.update({
          where: {
            id: chosenService?.id,
          },
          data: {
            isChosen: true,
          },
        });
        return {
          result: "OK",
          rideId: findRide.id,
        };
      }
      if (input.trip?.provider == "MAXIM") {
        await prisma.maximRide.update({
          where: {
            id: `${input.trip.tripId}_${input.trip.type}`,
          },
          data: {
            isChosen: true,
          },
        });

        return {
          result: "OK",
          rideId: findRide.id,
        };
      }
    } catch (error) {
      console.log(error);
      throw new TRPCError({
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
      return {
        result: "OK",
        rideId: findRide.id,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while update ride status",
      });
    }
  }

  if (input.status == "ACCEPTED" && input?.trip) {
    try {
      await prisma.user.update({
        where: {
          id: user.userId,
        },
        data: {
          credit: {
            decrement: Number(process.env.COMMISSION),
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw new TRPCError({
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
      return {
        result: "OK",
        rideId: findRide.id,
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while updating trip info",
      });
    }
  }

  if (input.status == "CANCELLED") {
    try {
      await prisma.ride.update({
        where: {
          id: findRide.id,
        },
        data: {
          Status: "CANCELLED",
        },
      });

      return {
        result: "OK",
        rideId: findRide.id,
      };
      
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error while set status cancelled",
      });
    }

    
  }

  return {
    result: "OK",
    rideId: findRide.id,
  };
}

//// *** ////

//// get User Rides ////
export async function userRidesController({
  ctx,
}: RouterArgsController): Promise<Ride[]> {
  const { prisma, user } = ctx;
  return await prisma.ride.findMany({
    where: {
      passenger: {
        every: {
          id: user.userId,
        },
      },
    },
    include: {
      snappPrices: {},
    },
  });
}

//// *** ////
