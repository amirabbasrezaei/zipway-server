import { z } from "zod";
import { Context } from "../context";
import { CoordinateToAddressRequestPayload, PlaceBaseSearchRequestPayload } from "../requests/neshanAPIs";
type AppRouterArgsController<T = null> = T extends null ? {
    ctx: Context;
} : {
    ctx: Context;
    input: T;
};
export declare const zipwayConfigSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export type ZipwayConfig = z.infer<typeof zipwayConfigSchema>;
type ZipwayConfigPayload = {
    mapStyles: any;
};
export declare function zipwayConfigController({}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload>;
export declare const coordinateToAddressSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    latitude: number;
    longitude: number;
}, {
    latitude: number;
    longitude: number;
}>;
export type CoordinateToAddress = z.infer<typeof coordinateToAddressSchema>;
export declare function coordinateToAddressController({ input, }: AppRouterArgsController<CoordinateToAddress>): Promise<CoordinateToAddressRequestPayload>;
export declare const placeBaseSearchSchema: z.ZodObject<{
    latitude: z.ZodString;
    longitude: z.ZodString;
    searchTerm: z.ZodString;
}, "strip", z.ZodTypeAny, {
    latitude: string;
    longitude: string;
    searchTerm: string;
}, {
    latitude: string;
    longitude: string;
    searchTerm: string;
}>;
export type PlaceBaseSearch = z.infer<typeof placeBaseSearchSchema>;
export declare function placeBaseSearchController({ input, }: AppRouterArgsController<PlaceBaseSearch>): Promise<PlaceBaseSearchRequestPayload>;
export {};
