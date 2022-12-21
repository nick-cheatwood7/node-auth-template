import { client } from "../../../utils/db.js";

export const user = client.db("test").collection("user");
