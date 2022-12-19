import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import { registerUser } from "./modules/accounts/register.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function main() {
    try {
        app.register(fastifyStatic, {
            root: path.join(__dirname, "../public")
        });

        app.post("/api/register", {}, async (req, reply) => {
            const { email, password } = req.body as any;
            const userId = await registerUser(email, password);
            console.log("user created", userId);
            reply.code(200).send({
                data: "OK!"
            });
        });

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
