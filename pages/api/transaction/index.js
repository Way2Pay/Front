import clientPromise from "../../../db/database";
import {
  getToken,
  getAuthToken,
  verifyToken,
} from "../../../backend-services/auth";
export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).send("OK");

  const client = await clientPromise;
  const db = client.db("PayDB");


  if (request.method === "GET") {
    const token = getAuthToken(request);
    const validity = verifyToken(token);

    if (!validity.authorized)
      return response.status(401).json({ message: validity.message });
    console.log(validity);
    const {address}=validity.payload;

    await db.collection("Transactions").find({address:address}).toArray((err,res)=>{
      if(err) throw err
      console.log("TX",res)
      return response.status(200).json({transactions:res})
    })
  } else if (request.method === "POST") {
    const timestamp = Math.floor(Date.now()/1000);
    const { address, amount, chainId, contractAddress } = request.body;
    let myquery = { address: address };
    var id;
    var abc = await db
      .collection("Users")
      .find(myquery)
      .toArray(async (err, res) => {
        if (err) throw err;

        if (!res.length) {
          return response.status(404).json({ message: "User Not Found" });
        } else {
          await db
            .collection("Transactions")
            .insertOne(
              { address: address, amount: amount, status: "initiated", createTime:timestamp,chainId:chainId, contractAddress },
              async (err, res) => {
                if (err) throw err;
                console.log("HERE", res.insertedId);
                id = res.insertedId;
                await db
                  .collection("Users")
                  .updateOne(
                    myquery,
                    { $push: { transactions: id } },
                    (err, res) => {
                      if (err) throw err;
                      console.log(id);
                      return response.status(200).json({ id: id });
                    }
                  );
              }
            );
        }
      });
  } else {
    response.status(400).json({ message: "Incorrect Method" });
  }
}
