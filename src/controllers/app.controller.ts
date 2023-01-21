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
  phoneNumber: z.string(),
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
};

export async function zipwayConfigController({
  input,
}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload> {
  const response = await axios.get(
    "https://tile.maps.snapp.ir/styles/snapp-style/style.json"
  );

  console.log(input);

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

  return { mapStyles: response.data, banner: null };
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
  error: z.any(),
  section: z.string(),
  message: z.any()
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
