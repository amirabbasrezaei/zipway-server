import { z } from "zod";
import { Context } from "../context";
import axios from "axios";

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
  mapStyles: string;
};

export async function zipwayConfigController({}: AppRouterArgsController<ZipwayConfig>): Promise<ZipwayConfigPayload> {
  const response = await axios.get(
    "https://tile.maps.snapp.ir/styles/snapp-style/style.json"
  );

  return { mapStyles: response.data };
}
