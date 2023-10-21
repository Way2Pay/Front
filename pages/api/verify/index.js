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
    var abc;
    let nonce;
    await db.collection("Users").findOne(query, async (err, res) => {
      if (err) throw err;

      nonce = res.nonce;
      abc = res._id;
      var fields = await SIWEObject.verify({
        signature: signature,
        nonce: nonce,
      });
      await db.collection("Users").updateOne(query, newvalues, (err, res) => {
        if (err) throw err;
        console.log("CHECK THIS", abc);
        fields.data._id = abc;
        const token = getToken(fields);
        return response.status(200).json({ data: fields, token: token });
      });
    });
    return response;
  } else return response.status(403).json({ message: "Forbidden Request" });
}
