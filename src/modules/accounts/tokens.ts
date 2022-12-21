import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { JWTSignature, __prod__ } from "../../utils/constants.js";

export async function createTokens(sessionToken: string, userId: number) {
    try {
        // create refresh token -- sessionToken
        const refreshToken = jwt.sign(
            {
                sessionToken
            },
            JWTSignature
        );
        // create access token -- sessionToken, userId
        const accessToken = jwt.sign(
            {
                sessionToken,
                userId
            },
            JWTSignature
        );
        // return tokens
        return {
            refreshToken,
            accessToken
        };
    } catch (e) {
        console.error(e);
        throw new Error("Unable to generate JWT tokens");
    }
}

export function getRefreshToken(request: FastifyRequest) {
    return request?.cookies?.["refreshToken"];
}

export async function refreshTokens(
    sessionToken: string,
    userId: number,
    reply: FastifyReply
) {
    const { accessToken, refreshToken } = await createTokens(
        sessionToken,
        userId
    );
    // set cookies
    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);
    reply
        .code(200)
        .setCookie("accessToken", accessToken, {
            path: "/",
            // domain: "localhost",
            sameSite: "strict",
            httpOnly: true,
            secure: __prod__
        })
        .setCookie("refreshToken", refreshToken, {
            path: "/",
            // domain: "localhost",
            sameSite: "strict",
            httpOnly: true,
            secure: __prod__,
            expires: new Date(refreshExpires)
        })
        .send();
}
