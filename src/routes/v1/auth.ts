import type { FastifyInstance, RegisterOptions } from "fastify";
import { authorizeUser } from "../../modules/accounts/authorize.js";
import { loginUser } from "../../modules/accounts/loginUser.js";
import { logoutUser } from "../../modules/accounts/logoutUser.js";
import { registerUser } from "../../modules/accounts/register.js";
import { __prod__ } from "../../utils/constants.js";

export default function (
    fastify: FastifyInstance,
    _opt: RegisterOptions,
    done: Function
) {
    fastify.post("/register", {}, async (request, reply) => {
        try {
            const { email, password } = request.body as any;
            const userId = await registerUser(email, password);
            if (userId) {
                await loginUser(userId, request, reply);
                return reply
                    .code(200)
                    .send({ data: "User created successfully!" });
            }
            return reply.code(400).send({ data: "Unable to create User" });
        } catch (e) {
            console.error(e);
            return reply.code(400);
        }
    });
    fastify.post("/login", {}, async (request, reply) => {
        try {
            const { email, password } = request.body as any;
            const { isAuthorized, userId } = await authorizeUser(
                email,
                password
            );
            if (!isAuthorized || !userId) {
                return reply.code(400).send({ data: "invalid credentias" });
            }
            // Generate auth tokens, set cookies
            return await loginUser(userId, request, reply);
        } catch (e) {
            console.error(e);
            return reply.code(400);
        }
    });
    fastify.delete("/logout", {}, async (req, reply) => {
        try {
            return await logoutUser(req, reply);
        } catch (e) {
            console.error(e);
            return reply.code(500);
        }
    });
    done();
}
