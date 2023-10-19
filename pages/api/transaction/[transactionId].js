import clientPromise from "../../../db/database";
import { getAuthToken, verifyToken } from "../../../backend-services/auth";
import { ObjectId } from "mongodb";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });
  const client = await clientPromise;
  const db = client.db("PayDB");
  const { transactionId } = request.query;
  var id = ObjectId(transactionId);
  console.log(id, typeof id);
  if (request.method === "GET") {
    const timestamp=Math.floor(Date.now()/1000);
    var abc = await db
      .collection("Transactions")
      .findOne({ _id: id }, async(err, res) => {
        if (err) throw err;

        if(res.timestamp&&timestamp-res.createdAt>500)
        {
          await db.collection("Transactions").updateOne({_id:id},{$set:{status:"Expired"}},(err,res)=>{
            if(err) throw err
            return response.status(301).json({message:"Transaction has expired"})
          })
        }
        console.log("DATA", res);
        return response.status(200).json({ data: res });
      });
  }
}
