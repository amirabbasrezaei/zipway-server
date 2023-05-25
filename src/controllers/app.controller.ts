import { z } from "zod";
import { Context } from "../context";
import axios from "axios";
import {
  CoordinateToAddressRequestPayload,
  PlaceBaseSearchRequestPayload,
  coordinateToAddressRequest,
  placeBaseSearchRequest,
} from "../requests/neshanAPIs";

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

type BannerType = {
  message: string;
  canClose: boolean;
  image: {
    url: string;
    height: number;
    width: number;
  } | null;
  bottomImage: {
    url: string;
    height: number;
    width: number;
  } | null;
};

type ZipwayConfigPayload = {
  mapStyles: any | null;
  banner: BannerType | null;
  userInfo?: {
    name: string;
    credit: number;
    phoneNumber: string
  } ;
} | null;

export async function zipwayConfigController({
  ctx,
}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload> {
  const { user, prisma } = ctx;
  const response = await axios.get(
    "https://tile.maps.snapp.ir/styles/snapp-style/style.json"
  );
  const findUser  = await prisma.user.findUnique({
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
    return null;
  }
  return { mapStyles: response.data, banner: null,userInfo: {
    name: findUser.name,
    credit: findUser.credit,
    phoneNumber: findUser.phoneNumber
  } };

}

export const coordinateToAddressSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type CoordinateToAddress = z.infer<typeof coordinateToAddressSchema>;

export async function coordinateToAddressController({
  input,
}: AppRouterArgsController<CoordinateToAddress>): Promise<CoordinateToAddressRequestPayload> {
  const response = await coordinateToAddressRequest({
    latitude: input.latitude,
    longitude: input.longitude,
  });

  return response;
}

export const placeBaseSearchSchema = z.object({
  latitude: z.string(),
  longitude: z.string(),
  searchTerm: z.string(),
});
export type PlaceBaseSearch = z.infer<typeof placeBaseSearchSchema>;

export async function placeBaseSearchController({
  input,
}: AppRouterArgsController<PlaceBaseSearch>): Promise<PlaceBaseSearchRequestPayload> {
  const response = await placeBaseSearchRequest({
    latitude: input.latitude,
    longitude: input.longitude,
    searchTerm: input.searchTerm,
  });

  return response;
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
