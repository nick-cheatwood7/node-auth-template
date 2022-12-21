import jwt from "jsonwebtoken";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getRefreshToken } from "./tokens.js";
import { JWTSignature } from "../../utils/constants.js";
import { prisma } from "../../utils/prisma.js";

export async function logoutUser(request: FastifyRequest, reply: FastifyReply) {
    try {
        // get refreshToken
        const refreshToken = getRefreshToken(request);
        if (!refreshToken) {
            throw new Error("Refresh token missing");
        }
        // decode sessionToken from refreshToken
        const { sessionToken } = jwt.verify(refreshToken, JWTSignature) as any;
        // delete database record for session
        await prisma.session.delete({
            where: {
                sessionToken
            }
        });
        // remove cookies
        reply
            .code(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .send({ data: "User logged out" });
    } catch (e) {
        console.error(e);
        reply.code(400);
    }
}
