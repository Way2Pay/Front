import clientPromise from "../../../db/database";

export default async function handler(request, response){
    if (request.method === 'OPTIONS') {
        return response.status(200).json(({ body: "OK" }))
      }
      const client = await clientPromise;
      const db = client.db("PayDB");
      switch (request.method) {
        case "POST":
          
          const {address, chainId, contractAddr} = request.body;
          console.log(address, chainId, contractAddr);
          var myquery = { address:address};
          var newvalues = { $set: { chains: [{id: chainId, contractAddr: contractAddr}] } };

          var abc = db
            .collection("Users")
            .find(myquery)
            .toArray((err, res) => {
            if (err) throw err;

            if (!res.length) {
                db.collection("Users").insertOne(
                { _id: address, address: address, chains:[{id: chainId, contractAddr: contractAddr}] },
                (err, res) => {
                    if (err) throw err;
                }
                );
            } else {
                db.collection("Users").updateOne(myquery, newvalues, (err, res) => {
                if (err) throw err;
                });
            }
            });
            console.log("abc", abc);

            response.status(200).json({chains:[{id:chainId, contractAddr:contractAddr}] });
          break;
        case "GET":
          response.status(200).json({
            body: request.body,
            query: request.query,
      });
      }
}