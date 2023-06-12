//// calculate commission ////

import { RouterArgsController } from "../controllers/type";
import { z } from "zod";
const serviceCommissionSchema = z.record(
  z.string(),
  z.object({
    amount: z.number(),
    price: z.number(),
  })
);

// const snappServiceCommissionx = z.object()
export const getCommissionPayloadSchema = z.object({
  snapp: serviceCommissionSchema,
  tapsi: serviceCommissionSchema,
  maxim: serviceCommissionSchema,
});

export const getCommissionArgsSchema = z.object({
  rideId: z.string(),
});

type GetCommissionArgs = z.infer<typeof getCommissionArgsSchema>;
type GetCommissionPayload = z.infer<typeof getCommissionPayloadSchema>;
type ServiceCommissionType = z.infer<typeof serviceCommissionSchema>;
type ValueOf<T> = T[keyof T];

type serviceProviderType = {
  [key in keyof GetCommissionPayload]: z.infer<typeof serviceCommissionSchema>;
};

type serviceTypeInterface = {
  [key in keyof ServiceCommissionType]: ValueOf<ServiceCommissionType>;
};

export async function getCommission({
  rideId,
  prisma,
}: {
  rideId: string;
  prisma: RouterArgsController<GetCommissionArgs>["ctx"]["prisma"];
}): Promise<GetCommissionPayload> {
  const services = await prisma.ride.findMany({
    where: { id: rideId },
    select: {
      maximPrices: {
        select: {
          serviceType: true,
          price: true,
        },
      },
      snappPrices: {
        select: {
          serviceType: true,
          price: true,
        },
      },
      tapsiPrices: {
        select: {
          serviceType: true,
          price: true,
          categoryType: true,
        },
      },
    },
  });

  const providers: serviceProviderType = { snapp: {}, maxim: {}, tapsi: {} };
  Object.entries(services[0]).forEach(
    ([serviceProviderKey, serviceProvider]) => {
      const services: serviceTypeInterface = {};

      if (serviceProviderKey == "snappPrices") {
        serviceProvider.forEach((service) => {
          Object.assign(services, {
            [service.serviceType]: {
              price: service.price,
              amount: Number(process.env.COMMISSION) / 10,
            },
          });
        });

        providers["snapp"] = services;
      }
      if (serviceProviderKey == "tapsiPrices") {
        serviceProvider.forEach((service: any) => {
          console.log(service);
          Object.assign(services, {
            [service.categoryType + service.serviceType]: {
              price: service.price,
              amount: Number(process.env.COMMISSION) / 10,
            },
          });
        });
        
        
        providers["tapsi"] = services;
      }
      if (serviceProviderKey == "maximPrices") {
        serviceProvider.forEach((service) => {
          Object.assign(services, {
            [service.serviceType]: {
              price: service.price,
              amount: Number(process.env.COMMISSION) / 10,
            },
          });
        });

        providers["maxim"] = services;
      }
    }
  );
  

  return {
    maxim: providers.maxim,
    snapp: providers.snapp,
    tapsi: providers.tapsi,
  };
}
//// *** ////
