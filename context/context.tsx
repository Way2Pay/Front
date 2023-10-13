import { getPoolFeeForUniV3 } from "@connext/chain-abstraction";
import { utils } from "ethers";

// asset address
const POLYGON_WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
const POLYGON_USDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
// Domain details
const POLYGON_DOMAIN_ID = "1886350457";
const POLYGON_RPC_URL = "https://polygon.llamarpc.com";

const poolFee = await getPoolFeeForUniV3(
  POLYGON_DOMAIN_ID,
  POLYGON_RPC_URL,
  POLYGON_WETH,
  POLYGON_USDC
);

const forwardCallData = utils.defaultAbiCoder.encode(
  ["address", "string"],
  [POLYGON_WETH, "hello world"]
);


export const getXCallCallData = async (
  POLYGON_DOMAIN_ID,
  swapper: Swapper,
  forwardCallData: string,
  params: DestinationCallDataParams,
)