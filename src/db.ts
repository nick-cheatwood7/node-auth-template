import mongo from "mongodb";

const { MongoClient } = mongo;
const url = process.env["MONGO_URI"]!;

export const client = new MongoClient(url);

export async function connectDb() {
    try {
        await client.connect();
        // Confirm connection
        await client.db("admin").command({ ping: 1 });
        console.log("🔑 Connected to DB!");
    } catch (e) {
        console.error(e);
        // Close connection if there was an error
        await client.close();
    }
}
