import type { FastifyInstance, RegisterOptions } from "fastify";
import { authorizeUser } from "../../modules/accounts/authorize.js";
import { loginUser } from "../../modules/accounts/loginUser.js";
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
            const { isAuthorized, userId } = await authorizeUser(
                email,
                password
            );
            if (!isAuthorized) {
                return reply.code(40).send({ data: "invalid credentias" });
            }
            // Generate auth tokens, set cookies
            await loginUser(String(userId), request, reply);
            // send response
            return reply.send({
                data: "User logged in"
            });
        } catch (e) {
            console.error(e);
            return reply.code(400);
        }
    });
    done();
}
