import {
  createUserController,
  createUserSchema,
  loginController,
  loginUserSchema,
  users,
} from "../controllers/user.controller";
import { router, publicProcedure, userProtectedProcedure } from "../trpc";

export const userRouter = router({
  createUser: publicProcedure
    .input(createUserSchema)
    .mutation(createUserController),
  loginUser: publicProcedure.input(loginUserSchema).mutation(loginController),
  users: userProtectedProcedure.query(users),
});
