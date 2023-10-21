import {chainIdToSubgraph} from "../utils/utils"
import axios from "axios"


export const getTxId =async (txHash:string,chainId:number)=>{
  console.log("chainId",chainId, chainIdToSubgraph[chainId])
    let query = `query OriginTransfer {
      originTransfers(
        where: {
          transactionHash: "${txHash}"
        }
      ) {
          transferId
      }
    }`
      const data = await axios.post(chainIdToSubgraph[chainId],{
      query:query
      })
      return data.data.data.originTransfers[0].transferId;
}