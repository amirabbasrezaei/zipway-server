import { Response } from "express";
import { User } from "@prisma/client";
export type AccessTokenPayload = {
    userId: string;
    role: string;
    phoneNumber: string;
};
export interface RefreshTokenPayload {
    sessionId: string;
    userId: string;
}
type SetToken = {
    res: Response;
    user: User;
};
interface SignJWTPayload {
    accessTokenPayload: AccessTokenPayload | null;
    refreshTokenPayload: RefreshTokenPayload | null;
    accessToken: string | null;
    refreshToken: string | null;
}
export declare function signJWT({ res, user }: SetToken): Promise<SignJWTPayload>;
export {};
