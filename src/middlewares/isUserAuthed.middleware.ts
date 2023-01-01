// import { TRPCError } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { getUser } from "../utils/getUser";
// import { getUser } from "../utils/getUser";

interface IsUserAuthed {
  next: any;
  ctx: Context;
}

export const isUserAuthed = async ({ ctx, next }: IsUserAuthed) => {
  const { req, res } = ctx;
  
  const {accessToken} = await getUser(req, res);
  if(!accessToken){
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'you are not authorize to request'
    })
  }

  return next({
    ctx,
  });
};
