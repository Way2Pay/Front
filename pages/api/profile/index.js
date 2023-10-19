import clientPromise from "../../../db/database";
import {
  getToken,
  getAuthToken,
  verifyToken,
} from "../../../backend-services/auth";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });

  const client = await clientPromise;
  const db = client.db("PayDB");
  const token = getAuthToken(request);
  const validity = verifyToken(token);

  if (!validity.authorized)
    return response.status(401).json({ message: validity.message });
  console.log(validity);
  const {address} = validity.payload
  if (request.method === "GET") {
    db.collection("Users").find({address:address},(err,res)=>{
        if(err)throw err;
        return response.status(200).json({data:res})
    })
  } else if (request.method === "POST") {
    const {nickname, desc}=JSON.parse(request.body)
    db.collection("Users").updateOne({address:address},{$set :{nickname:nickname,desc:desc}},(err,res)=>{
        if(err)throw err;
        return response.status(200).json({message:"Updated profile"})
    })
  } else return response.status(403).json({ message: "Forbidden Method" });
}
