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
  const { _id: userId, address = address } = validity.payload;

  if (request.method === "GET") {
    db.collection("Deployements")
      .find({ owner: address })
      .toArray((err, res) => {
        if (err) throw err;
        console.log("TX", res);
        return response.status(200).json({ deployements: res });
      });
  } else if (request.method === "POST") {
    const { chainId, coinAddress,contractAddress } = JSON.parse(request.body);
    console.log(request.body)
   await db.collection("Users")
      .find({ _id: userId })
      .toArray(async (err, res) => {
        if (err) throw err;
        await db.collection("Deployements").insertOne({ owner:address,chainId:chainId,coin:coinAddress,contract:contractAddress },async(err,res)=>{
            if(err)throw err

            const id=res.insertedId
            await db.collection("Users").updateOne(
                { _id: userId },
                { $push: { deployements: id } },
                (err, res) => {
                  if (err) throw err;
                  return response.status(200).json({message:"Deployement Added"});
                }
              );
        })
      });
  } else {
    response.status(400).json({ message: "Incorrect Method" });
  }
}
