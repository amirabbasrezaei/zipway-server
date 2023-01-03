import { Context } from "../context";
import { z } from "zod";
import Prisma from "@prisma/client";
type UserRouterArgsController<T = null> = T extends null ? {
    ctx: Context;
} : {
    ctx: Context;
    input: T;
};
export declare const createUserSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    nameAndFamily: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phoneNumber: string;
    nameAndFamily: string;
}, {
    phoneNumber: string;
    nameAndFamily: string;
}>;
export type CreateUser = z.infer<typeof createUserSchema>;
type CreateUserPayload = {
    accessToken: string | null;
    refreshToken: string | null;
};
export declare function createUserController({ ctx, input, }: UserRouterArgsController<CreateUser>): Promise<CreateUserPayload>;
export declare const SendVerifyCodeSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phoneNumber: string;
    hash: string;
}, {
    phoneNumber: string;
    hash: string;
}>;
export type SendVerifyCode = z.infer<typeof SendVerifyCodeSchema>;
type SendVerifyCodeControllerPayload = {
    status: string;
    isNewUser: boolean;
};
export declare function sendVerifyCodeController({ ctx, input, }: UserRouterArgsController<SendVerifyCode>): Promise<SendVerifyCodeControllerPayload>;
export declare const VerifyLoginCodeSchema: z.ZodObject<{
    code: z.ZodString;
    phoneNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    phoneNumber: string;
}, {
    code: string;
    phoneNumber: string;
}>;
export type VerifyLoginCode = z.infer<typeof VerifyLoginCodeSchema>;
export declare function verifyLoginCodeController({ ctx, input, }: UserRouterArgsController<VerifyLoginCode>): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
}>;
export declare function users({ ctx, }: UserRouterArgsController): Promise<Prisma.User[]>;
export {};
