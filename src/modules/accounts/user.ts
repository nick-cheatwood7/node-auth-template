import jwt from "jsonwebtoken";
import type { FastifyRequest } from "fastify";
import { JWTSignature } from "../../utils/constants.js";
import { prisma } from "../../utils/prisma.js";

export async function getUserFromCookies(request: FastifyRequest) {
    try {
        // get the access and refresh tokens
        if (!request?.cookies?.["accessToken"]) {
            throw new Error("Invalid access token");
        }
        const { accessToken } = request.cookies;
        // decode access token
        const decodedAccessToken = jwt.verify(accessToken, JWTSignature) as any;
        if (!request?.cookies?.["refreshToken"]) {
            throw new Error("Invalid refresh token");
        }
        const { refreshToken } = request.cookies;
        const decodedRefreshToken = jwt.verify(
            refreshToken,
            JWTSignature
        ) as any;
        // check session is valid
        const session = await prisma.session.findFirst({
            where: {
                sessionToken: decodedRefreshToken?.["sessionToken"]
            }
        });
        if (!session || !session.valid) {
            throw new Error("Invalid session token");
        }
        // return current user
        const user = await prisma.user.findFirst({
            where: {
                id: decodedAccessToken?.["userId"]
            }
        });
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}
