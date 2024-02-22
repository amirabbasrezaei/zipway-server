import { z } from "zod";
import { Context } from "../context";
import axios from "axios";
import {
  CoordinateToAddressRequestPayload,
} from "../requests/neshanAPIs";
import { TRPCError } from "@trpc/server";
import { AddresToCoordinate, coordinateToAddressBaladRequest } from "../requests/baladAPIs";

type AppRouterArgsController<T = null> = T extends null
  ? {
      ctx: Context;
    }
  : {
      ctx: Context;
      input: T;
    };

export const zipwayConfigSchema = z.object({
  deviceId: z.string(),
  deviceModel: z.string(),
  appVersion: z.string(),
  deviceManufacturer: z.string(),
});
export type ZipwayConfig = z.infer<typeof zipwayConfigSchema>;

const BannerType = z.object({
  message: z.string(),
  canClose: z.boolean(),
  image: z
    .object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
      link: z.string().optional(),
    })
    .optional(),
  bottomImage: z
    .object({
      url: z.string(),
      height: z.number(),
      width: z.number(),
      link: z.string().optional(),
    })
    .optional(),
});

export const ZipwayConfigPayloadSchema = z.object({
  mapStyles: z.any(),
  banner: BannerType.optional(),
  userInfo: z.object({
    name: z.string(),
    credit: z.number(),
    phoneNumber: z.string(),
  }),
  appInfo: z.object({
    rideWaiting: z.object({
      image: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
        borderRadius: z.number(),
      }),
      rideWaitingText: z.string(),
    }),
    privacyPolicyText: z.string(),
    createPaymentText: z.string(),
    minCreatePayment: z.number(),
    maxCreatePayment: z.number(),
    logoutAppText: z.string(),
    notEnoughCredit: z.object({
      requestServiceButton: z.string(),
    }),
  }),
});

export type ZipwayConfigPayload = z.infer<typeof ZipwayConfigPayloadSchema>;

export async function zipwayConfigController({
  ctx,
  input,
}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload> {
  const { user, prisma } = ctx;
  const response = await axios.get(
    process.env.SNAPP_TILE_MAP_JSON_URL as string
  );
  const findUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });
  console.log("findUser", findUser);

  // const banner = {
  //   message: "لطفا برنامه را آپدیت کنید",
  //   canClose: false,
  //   image: {
  //     url: "https://static.thenounproject.com/attribution/4496977-600.png",
  //     width: 120,
  //     height: 120,
  //   },
  //   bottomImage: null
  // };
  if (!findUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user doesn't exist",
    });
  }

  if (Number(input.appVersion.split(".").join("")) < 210) {
    return {
      mapStyles: response.data,
      userInfo: {
        name: findUser.name,
        credit: findUser.credit / 10,
        phoneNumber: findUser.phoneNumber,
      },
      appInfo: {
        createPaymentText:
          "حداقل مبلغ مورد نیاز برای افزایش اعتبار حساب ۲۰۰۰۰ تومان می باشد.",
        logoutAppText: "؟آیا برای خروج از حساب کاربری خود مطمئنید",
        maxCreatePayment: 50000000,
        minCreatePayment: 10000,
        privacyPolicyText: "",
        rideWaiting: {
          image: {
            url: `https://zipway.storage.iran.liara.space/giphy.gif`,
            height: 250,
            width: 350,
            borderRadius: 15,
          },
          rideWaitingText: "در حال یافتن تاکسی برای شما هستیم",
        },
        notEnoughCredit: {
          requestServiceButton: "اعتبار شما برای درخواست سرویس کافی نیست",
        },
      },
      banner: {
        message: "لطفا منو آپدیت کن. کلی ویژگی باحال توی راهه :)",
        canClose: false,
        image: {
          url: "https://zipway.storage.iran.liara.space/Group%2075zipway_updatev2.1.0.png",
          height: 410,
          width: 410,
        },
        //   ,
        // bottomImage: {
        //     url: "",
        //     height: 100,
        //     width: 100,
        //   }
        //   ,
      },
    };
  }

  return {
    mapStyles: response.data,
    userInfo: {
      name: findUser.name,
      credit: findUser.credit / 10,
      phoneNumber: findUser.phoneNumber,
    },
    appInfo: {
      createPaymentText:
        "حداقل مبلغ مورد نیاز برای افزایش اعتبار حساب ۲۰۰۰۰ تومان می باشد.",
      logoutAppText: "؟آیا برای خروج از حساب کاربری خود مطمئنید",
      maxCreatePayment: 50000000,
      minCreatePayment: 1000,
      privacyPolicyText: "",
      rideWaiting: {
        image: {
          url: `https://zipway.storage.iran.liara.space/giphy.gif`,
          height: 250,
          width: 350,
          borderRadius: 15,
        },
        rideWaitingText: "در حال یافتن تاکسی برای شما هستیم",
      },
      notEnoughCredit: {
        requestServiceButton: "اعتبار شما برای درخواست سرویس کافی نیست",
      },
    },
  };
}

export const coordinateToAddressSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type CoordinateToAddress = z.infer<typeof coordinateToAddressSchema>;

export async function coordinateToAddressController({
  input,
}: AppRouterArgsController<CoordinateToAddress>): Promise<CoordinateToAddressRequestPayload> {
  


  const response = await coordinateToAddressBaladRequest({
    latitude: input.latitude,
    longitude: input.longitude,
  });
  return response;
}
const searchedItems = z.object({
  location: z.object({ x: z.number(), y: z.number() }),
  title: z.string(),
  region: z.string(),
});

export const placeBaseSearchPayloadSchema = z.object({
  items: z.array(searchedItems),
});
export const placeBaseSearchSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  searchTerm: z.string(),
  polygon: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
  zoom: z.number().optional(),
});
export type PlaceBaseSearchArgs = z.infer<typeof placeBaseSearchSchema>;
export type placeBaseSearchPayload = z.infer<
  typeof placeBaseSearchPayloadSchema
>;

export async function placeBaseSearchController({
  input,
}: AppRouterArgsController<PlaceBaseSearchArgs>): Promise<placeBaseSearchPayload> {
  /// # NESHAN SERVICE
  // const response = await placeBaseSearchRequest({
  //   latitude: input.latitude,
  //   longitude: input.longitude,
  //   searchTerm: input.searchTerm,
  // });
  try {
    const baladResponse = await AddresToCoordinate({
      latitude: input.latitude,
      longitude: input.longitude,
      searchTerm: input.searchTerm,
    });
  
    const convertResponse: any = {};
  
    convertResponse.items = baladResponse?.results?.map((location: any) => location.geometry && ( {
      'location': {
        x:  location.geometry.type == 'MultiPoint' ? location.geometry.coordinates[0][0] : location.geometry.coordinates[0][0][0][0],
        y: location.geometry.type == 'MultiPoint' ? location.geometry.coordinates[0][1]: location.geometry.coordinates[0][0][0][1],
      },
      'title': location.maintext,
      'region': location.subtext1,
    })).filter((x: any) => x != null);
  
    
  
    return convertResponse;
    
  } catch (error) {
    console.log(error)
  }

  return{items:[]}
}

type AppLogsPayload = {
  isSuccess: boolean;
};

export const appLogsControllerSchema = z.object({
  error: z.any().optional(),
  section: z.string(),
  message: z.any().optional(),
});

export type AppLogsController = z.infer<typeof appLogsControllerSchema>;

export async function appLogsController({
  input,
}: AppRouterArgsController<AppLogsController>): Promise<AppLogsPayload> {
  if (input?.error) {
    console.log(input);
    return { isSuccess: true };
  }
  return { isSuccess: false };
}
