import clientPromise from "../../../db/database";

export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });
  else {
    const client = await clientPromise;
    const db = client.db("PayDB");
    const { address, amount, buyer } = request.body;
    console.log("YES");
    let myquery = { address: address };
    var id;
    var abc = await db
      .collection("Users")
      .find(myquery)
      .toArray(async(err, res) => {
        if (err) throw err;

        if (!res.length) {
          return response.status(404).json({ message: "User Not Found" });
        } else {
          const user = res[0];
          await db.collection("Transactions").insertOne(
            { address: address, amount: amount, buyer: buyer },
            async(err, res) => {
              if (err) throw err;
              console.log("HERE",res.insertedId);
              id = res.insertedId;
              await db.collection("Users").updateOne(myquery,{$push:{transactions:id}},(err,res)=>{
                if(err) throw err;
                console.log(id);
                return response.status(200).json({ id: id });
              });
            }
          );
        }
      });
  }
}
