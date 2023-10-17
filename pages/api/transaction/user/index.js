import clientPromise from "../../../../db/database";
import {
  getToken,
  getAuthToken,
  verifyToken,
} from "../../../../backend-services/auth";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });

  const client = await clientPromise;
  const db = client.db("PayDB");


  if (request.method === "GET") {
    const token = getAuthToken(request);
    const validity = verifyToken(token);

    if (!validity.authorized)
      return response.status(401).json({ message: validity.message });
    console.log(validity);
    const {address}=validity.payload;

    db.collection("Transactions").find({buyer:address}).toArray((err,res)=>{
      if(err) throw err
      console.log("TX",res)
      return response.status(200).json({transactions:res})
    })
  }  else {
    response.status(400).json({ message: "Incorrect Method" });
  }
}
