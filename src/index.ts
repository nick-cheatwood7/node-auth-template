import "./utils/env.js";
import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "@fastify/cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./utils/db.js";
import { router } from "./routes/v1/index.js";
import { COOKIE_SIGNATURE, __prod__ } from "./utils/constants.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({
    logger: !__prod__ && { transport: { target: "@fastify/one-line-logger" } }
});

async function main() {
    try {
        app.register(fastifyCookie, {
            secret: COOKIE_SIGNATURE
        });

        app.register(fastifyStatic, {
            root: path.join(__dirname, "../public")
        });

        app.register(router, { prefix: "api/v1" });

        app.get("/", {}, (_req, reply) => {
            reply.send({
                data: "hello world"
            });
        });

        app.listen({ port: 4000 }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`🚀 Server listening at ${address}`);
        });
    } catch (e) {
        console.error(e);
    }
}

connectDb().then(() => {
    main();
});
