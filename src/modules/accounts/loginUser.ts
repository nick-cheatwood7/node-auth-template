import type { FastifyReply, FastifyRequest } from "fastify";
import { __prod__ } from "../../utils/constants.js";
import { createSession } from "./session.js";
import { createTokens } from "./tokens.js";

export async function loginUser(
    userId: string,
    request: FastifyRequest,
    reply: FastifyReply
) {
    const connectionInformation = {
        ip: request.ip,
        userAgent: request.headers["user-agent"] || ""
    };
    // create session
    const sessionToken = await createSession(userId, connectionInformation);
    console.log("sessionToken", sessionToken);
    // create JWT
    const { accessToken, refreshToken } = await createTokens(
        sessionToken,
        userId
    );
    // set cookies
    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);
    console.log(refreshExpires);
    reply
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
        });
}
