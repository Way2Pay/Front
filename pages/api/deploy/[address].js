import clientPromise from "../../../db/database";
import { ObjectId } from "mongodb";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });
  else {
    const client = await clientPromise;
    const db = client.db("PayDB");
    const token = getAuthToken(request);
    const validity = verifyToken(token);
    if (!validity.authorized)
      return response.status(401).json({ message: validity.message });
    const { _id: userId, address = address } = validity.payload;

    const { deployementAddress } = request.query;
    if (request.method === "GET") {
      var abc = await db
        .collection("Deployements")
        .findOne({owner:address,contract:deployementAddress}, (err, res) => {
          if (err) throw err;
          console.log("DATA", res);
          return response.status(200).json({ data: res });
        });
    }
  }
}
