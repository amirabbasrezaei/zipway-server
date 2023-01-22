import axios from "axios";

const BASE_URL = "https://api.neshan.org";
const NESHAN_API_KEY = "service.026843c0037a47f1a34bea06cab8e350";

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

export async function placeBaseSearchRequest({
  latitude,
  longitude,
  searchTerm,
}: PlaceBaseSearchRequestArgs): Promise<PlaceBaseSearchRequestPayload> {
  const response = await axios.get(
    `${BASE_URL}/v1/search?term=${searchTerm}&lat=${latitude}&lng=${longitude}`,
    { headers: { "Api-Key": NESHAN_API_KEY } }
  );
  return response.data;
}

export async function coordinateToAddressRequest({
  latitude,
  longitude,
}: CoordinateToAddressRequestArgs): Promise<CoordinateToAddressRequestPayload> {
  const response = await axios.get(
    `${BASE_URL}/v5/reverse?lat=${JSON.stringify(
      latitude
    )}&lng=${JSON.stringify(longitude)}`,
    { headers: { "Api-Key": NESHAN_API_KEY } }
  );

  
  return response.data;
}
