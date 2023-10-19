import { generateNonce, SiweMessage } from "siwe";
import { getToken } from "../../../backend-services/auth";
import clientPromise from "../../../db/database";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    return response.status(200).json({ body: "OK" });
  }
  const client = await clientPromise;
  const db = client.db("PayDB");
  const newNonce = generateNonce();
  var newvalues = { $set: { nonce: newNonce } };
  if (request.method === "POST") {
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

    const fields = await SIWEObject.verify({
      signature: signature,
      nonce: nonce,
    });

    db.collection("Users").updateOne(query, newvalues, (err, res) => {
      if (err) throw err;
    });
    const token = getToken(fields);
    return response.status(200).json({ data: fields, token: token });
  } else return response.status(403).json({ message: "Forbidden Request" });
}
