export interface PlaceBaseSearchRequestArgs {
    searchTerm: string;
    latitude: string;
    longitude: string;
}
export interface CoordinateToAddressRequestArgs {
    latitude: number;
    longitude: number;
}
interface PlaceBaseSearchItems {
    title: string | null;
    address: string | null;
    neighbourhood: string | null;
    region: string | null;
    type: string | null;
    category: string | null;
    location: {
        x: number;
        y: number;
        z: number;
    };
}
export interface PlaceBaseSearchRequestPayload {
    count: number;
    items: PlaceBaseSearchItems[];
}
export interface CoordinateToAddressRequestPayload {
    status: string | null;
    formatted_address: string | null;
    route_name: string | null;
    route_type: string | null;
    neighbourhood: string | null;
    city: string | null;
    state: string | null;
    place: string | null;
    municipality_zone: string | null;
    in_traffic_zone: boolean;
    in_odd_even_zone: boolean;
    village: string | null;
    county: string | null;
    district: string | null;
}
export declare function placeBaseSearchRequest({ latitude, longitude, searchTerm, }: PlaceBaseSearchRequestArgs): Promise<PlaceBaseSearchRequestPayload>;
export declare function coordinateToAddressRequest({ latitude, longitude, }: CoordinateToAddressRequestArgs): Promise<CoordinateToAddressRequestPayload>;
export {};
