import { Context } from "../context";

type RouterArgsController<T = null> = T extends null
  ? {
      ctx: Context;
    }
  : {
      ctx: Context;
      input: T;
    };
