import type { FastifyReply, FastifyRequest } from "fastify";
import { __prod__ } from "../../utils/constants.js";
import { createSession } from "./session.js";
import { refreshTokens } from "./tokens.js";

export async function loginUser(
    userId: number,
    request: FastifyRequest,
    reply: FastifyReply
) {
    const connectionInformation = {
        ip: request.ip,
        userAgent: request.headers["user-agent"] || ""
    };
    // create session
    const sessionToken = await createSession(userId, connectionInformation);
    // create JWT
    // set cookies
    await refreshTokens(sessionToken, userId, reply);
}
