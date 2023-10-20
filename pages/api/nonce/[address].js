import clientPromise from "../../../db/database";
import { generateNonce } from "siwe";
export default async function handler(request, response) {
  const client = await clientPromise;
  const { address } = request.query;
  console.log(address);
  const nonce = generateNonce();
  const db = client.db("PayDB");
  db.collection("Users")
    .find({ address: address })
    .toArray((err, res) => {
      if (err) throw err;

      if (!res.length) {
        db.collection("Users").insertOne(
          { address: address, nonce: nonce },
          (err, res) => {
            if (err) throw err;
            console.log("Inserted", res.insertedId);
            return response.status(200).json({ nonce: newNonce });
          }
        );
      } else {
        console.log("HERE", res[0]);
        return response.status(200).json({ nonce: res[0].nonce });
      }
    });
}
