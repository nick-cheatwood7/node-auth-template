import type { FastifyInstance, RegisterOptions } from "fastify";
import { getUserFromCookies } from "../../modules/accounts/user.js";

export default function (
    fastify: FastifyInstance,
    _opt: RegisterOptions,
    done: Function
) {
    fastify.get("/:id", {}, (_req, reply) => {
        reply.code(200).send({ data: "OK!" });
    });
    fastify.get("/me", {}, async (req, reply) => {
        const user = await getUserFromCookies(req);
        if (!user?.id) {
            return reply.send({
                data: "User not found"
            });
        }
        return reply.send({
            data: user
        });
    });
    done();
}
