import { generateNonce, SiweMessage } from "siwe";
import clientPromise from "../../../db/database";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    return response.status(200).json({ body: "OK" });
  }
  const client = await clientPromise;
  const db = client.db("PayDB");
  switch (request.method) {
    case "POST":
      const { message, address, signature } = request.body;
      console.log(message, address, signature);
      let SIWEObject = new SiweMessage(message);
      var query = { address: address };

      console.log("Address", address);
      let nonce;
      let tx = await db
        .collection("Users")
        .find(query)
        .toArray((err, res) => {
          if (err) throw err;
          else {
            console.log("Result", res);
            nonce = res.nonce;
          }
        });

      const { data: result, success } = await SIWEObject.verify({
        signature: signature,
        nonce: nonce,
      });
      console.log("data", result);
      console.log("success", success);
      response.status(200).json(result);
      break;
    case "GET":
      response.status(200).json({
        body: request.body,
        query: request.query,
      });
  }
}
