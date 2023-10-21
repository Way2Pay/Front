import {chainIdToSubgraph} from "../utils/utils"
import axios from "axios"


export const getTxId =async (txHash:string,chainId:number)=>{
  console.log("chainId",chainId, chainIdToSubgraph[chainId])
    let query = `query OriginTransfer {
      originTransfers(
        where: {
          transactionHash: "0x658bd6a648967d8dc255800d07a64167796640389daa1980e55d44eee52348d3"
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