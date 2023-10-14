import { generateNonce, SiweMessage } from "siwe";
import clientPromise from "../../../db/database";

export default async function handler(request, response) {
  const client = await clientPromise;
  const {address} = request.query;
  console.log(address)
  const db = client.db("PayDB");
  const nonce = generateNonce();
  const myquery = {address: address}
  console.log("YES");
  var newvalues = { $set: { nonce: nonce } };

  var abc = db.collection("Users").find(myquery).toArray((err,res)=>{
    if(err)
    throw err;
    
    if(!res.length)
    {
        db.collection("Users").insertOne({_id:address,address:address,nonce:nonce},(err,res)=>{
            if(err)throw err
           
            
        })
    }
    else{
        db.collection("Users").updateOne(myquery,newvalues,(err,res)=>{
            if (err) throw err
           
           
        })
    }
  })
  console.log("abc",abc)
  
  return response.status(200).json({ nonce: nonce });
}
