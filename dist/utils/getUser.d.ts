import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload } from "./signJWT";
type GetUser = {
    accessToken: jwt.JwtPayload | string | null;
    refreshToken: string | null;
    accessTokenPayload: AccessTokenPayload | null;
    refreshTokenPayload: RefreshTokenPayload | null;
};
export declare function getUser(req: Request<any, Record<string, any>>, res: Response): Promise<GetUser>;
export {};
