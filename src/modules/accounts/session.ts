import { randomBytes } from "crypto";

export async function createSession(
    userId: string,
    connection: { ip: string; userAgent: string }
) {
    try {
        // generate session token
        const sessionToken = randomBytes(42).toString("hex");
        // retrieve connection info
        const { ip, userAgent } = connection;
        // insert into db
        const { session } = await import("../db/session/session.js");
        await session.insertOne({
            sessionToken,
            userId,
            valid: true,
            userAgent,
            ip,
            updatedAt: new Date(),
            createdAt: new Date()
        });
        // return session token
        return sessionToken;
    } catch (e) {
        throw new Error("Session creation failed");
    }
}
