import type { FastifyInstance, RouteShorthandOptions } from "fastify";
import authRouter from "./auth.js";
import userRouter from "./users.js";

export function router(
    fastify: FastifyInstance,
    _opts: RouteShorthandOptions,
    done: Function
) {
    fastify.register(authRouter, { prefix: "/auth" });
    fastify.register(userRouter, { prefix: "/users" });
    done();
}
