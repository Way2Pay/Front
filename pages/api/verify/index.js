import { generateNonce, SiweMessage } from "siwe";
import clientPromise from "../../../db/database";
export default async function handler(request, response) {
 
  response.status(200).json({
    body: request.body,
    query: request.query,
  });
}
