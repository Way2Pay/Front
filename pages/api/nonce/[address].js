import clientPromise from "../../../db/database";
import { generateNonce } from "siwe";
export default async function handler(request, response) {
  const client = await clientPromise;
  const { address } = request.query;
  const nonce = await generateNonce();
  const db = client.db("PayDB");
  if (request.method === "GET") {
    await db
      .collection("Users")
      .findOne({ address: address }, async (err, res) => {
        if (err) throw err;
        if (!res) {
          await db
            .collection("Users")
            .insertOne(
              { address: address, nonce: nonce },
              (err, res) => {
                if (err) throw err;
                console.log("Inserted", res.insertedId);
                 response.status(200).json({ nonce: nonce });
              }
            );
        } else {
           response.status(200).json({ nonce: res.nonce });
        }
      });
      return response;
  } else {
    return response.status(401).json({ message: "Unauthorized method" });
  }
}
