import {
  SismoConnect,
  SismoConnectVerifiedResult,
  AuthType,
} from "@sismo-core/sismo-connect-server";
import clientPromise from "../../../db/database";
const config = {
  // you will need to register an appId in the Factory
  appId: "0x8ae737c8145f11c60b23ee69fab93711",
};
const sismoConnect = SismoConnect({ config });

async function verifyResponse(sismoConnectResponse) {
  // verifies the proofs contained in the sismoConnectResponse
  const result = await sismoConnect.verify(sismoConnectResponse, {
    // proofs in the sismoConnectResponse should be valid
    // with respect to a Vault and Twitter account ownership
    auths: [{ authType: 0 }, { authType: 3 }],
    // proofs in the sismoConnectResponse should be valid
    // with respect to a specific group membership
    // here the group with id 0x42c768bb8ae79e4c5c05d3b51a4ec74a
    signature:{message: "Way2Pay Member"},
    claims: [
      { groupId: "0x52199513be6e1725c232017d0fce5f4f", claimType: 2, value: 1 },
    ],
  });
  console.log("RESULT", result);
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") return response.status(200).body({ OK });
  else if (request.method === "POST") {
    const {data,userAddress} = await JSON.parse(request.body);
    console.log("Data",data)
    try{
    await verifyResponse(data);
    }catch(err){
        return response.status(401).json({message:"Bad Request"})
    }
    const client = clientPromise();
    const db = client.db("PayDB")
    await db.collection("Users").updateOne({address:userAddress},{$set:{membership:true}},(err,res)=>{
      if(err)throw err
      return response.status(200).json({message:"Membership Verified"})
    })
  }
}
