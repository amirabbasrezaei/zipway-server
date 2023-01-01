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

export const zipwayConfigSchema = z.object({});
export type ZipwayConfig = z.infer<typeof zipwayConfigSchema>;

type ZipwayConfigPayload = {
  mapStyles: any;
};

export async function zipwayConfigController({}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload> {
  const response = await axios.get(
    "https://tile.maps.snapp.ir/styles/snapp-style/style.json"
  );
  return { mapStyles: response.data };
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
