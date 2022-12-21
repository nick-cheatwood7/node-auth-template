import { randomBytes } from "crypto";
import { prisma } from "../../utils/prisma.js";

export async function createSession(
    userId: number,
    connection: { ip: string; userAgent: string }
) {
    try {
        // generate session token
        const sessionToken = randomBytes(42).toString("hex");
        // retrieve connection info
        const { ip, userAgent } = connection;
        // insert into db
        await prisma.session.create({
            data: {
                sessionToken,
                userId,
                valid: true,
                ip,
                userAgent
            }
        });
        // return session token
        return sessionToken;
    } catch (e) {
        throw new Error("Session creation failed");
    }
}
