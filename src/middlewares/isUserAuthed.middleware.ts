import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { getUser } from "../utils/getUser";
interface IsUserAuthed {
  next: any;
  ctx: Context;
}
// interface NextArgs extends Context {
//   user: object
// }


export const isUserAuthed = async ({ ctx, next }: IsUserAuthed) => {
  const { req, res } = ctx;

  const { accessToken: user } = await getUser(req, res);
  console.log("user", user);
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "you are not authorize to request",
    });
  }

  return next({
    ctx: { ...ctx, user },
  });
};
