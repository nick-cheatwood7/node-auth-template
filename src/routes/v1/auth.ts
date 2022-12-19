import type { FastifyInstance, RegisterOptions } from "fastify";
import { authorizeUser } from "../../modules/accounts/authorize.js";
import { registerUser } from "../../modules/accounts/register.js";

export default function (
    fastify: FastifyInstance,
    _opt: RegisterOptions,
    done: Function
) {
    fastify.post("/register", {}, async (request, reply) => {
        try {
            const { email, password } = request.body as any;
            const userId = await registerUser(email, password);
            console.log("user created", userId);
            reply.code(200).send({ data: "User created successfully!" });
        } catch (e) {
            console.error(e);
            reply.code(400);
        }
    });
    fastify.post("/login", {}, async (request, reply) => {
        try {
            const { email, password } = request.body as any;
            const userId = await authorizeUser(email, password);
            console.log("user logged in successfully", userId);
            reply.code(200).send({ data: "User logged in successfully!" });
        } catch (e) {
            console.error(e);
            reply.code(400);
        }
    });
    done();
}
