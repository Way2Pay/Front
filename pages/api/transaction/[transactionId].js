import clientPromise from "../../../db/database";
import { ObjectId } from "mongodb";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });
  const client = await clientPromise;
  const db = client.db("PayDB");
  const { transactionId } = request.query;
  var id = ObjectId(transactionId);
  console.log(id, typeof id);
  if (request.method === "GET") {
    var abc = await db
      .collection("Transactions")
      .findOne({ _id: id }, (err, res) => {
        if (err) throw err;
        console.log("DATA", res);
        return response.status(200).json({ data: res });
      });
  } else if (request.method === "POST") {
    const { txHash } = request.body;
    console.log("HASH", txHash);
    var abc = await db
      .collection("Transactions")
      .findOne({ _id: id }, async (err, res) => {
        if (err) {
          throw err;
        }
        if (!res) return response.status(404).json({ message: "Not Found" });
        console.log("HERE", res);
        if (res.txHash)
          return response
            .status(403)
            .json({ message: "txHash already exists" });

        await db
          .collection("Transactions")
          .updateOne(
            { _id: id },
            { $set: { txHash: txHash } },
            async (err, res) => {
              if (err) throw err;
              await db
                .collection("Transactions")
                .findOne({ _id: id }, (err, res) => {
                  console.log("RESULT", res);
                });
              return response.status(200).json({ message: "txHash added" });
            }
          );
      });
  }
}
