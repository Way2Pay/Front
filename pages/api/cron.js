import clientPromise from "../../db/database";

const client = await clientPromise;
const db = client.db("PayDB")