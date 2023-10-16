import jwt from "jsonwebtoken";

export const getToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_KEY,{expiresIn:30*30});
  return token;
};

export const verifyToken = (payload) => {
  try {
    const data = jwt.verify(payload, process.env.JWT_KEY);
    return { authorized: true, payload: data.data };
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return { authorized: false, message: err.message };
    }
    // otherwise, return a bad request error
    return { authorized: false, message: "bad request" };
  }
};

export const getAuthToken = function (request) {
  const header = request.headers["authorization"];
  if (!header) {
    console.log("missing auth header");
    return false;
  }
  const token = header.substring(7);
  console.log("token: ", token);
  return token;
};
