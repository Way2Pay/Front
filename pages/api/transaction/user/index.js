import clientPromise from "../../../../db/database";
import {
  getToken,
  getAuthToken,
  verifyToken,
} from "../../../../backend-services/auth";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body("ok");

  const client = await clientPromise;
  const db = client.db("PayDB");


  if (request.method === "GET") {
    const token =await getAuthToken(request);
    const validity = verifyToken(token);

    if (!validity.authorized)
      return response.status(401).json({ message: validity.message });
    console.log(validity,"HER");
    const {address}=validity.payload;

    await db.collection("Transactions").find({buyer:address}).toArray(async(err,res)=>{
      if(err) throw err
      return response.status(200).json({transactions:res})
    })
  }  else {
    response.status(400).json({ message: "Incorrect Method" });
  }
}
