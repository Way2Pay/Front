import jwt from "jsonwebtoken"

export const getToken = (payload)=>{
    const token = jwt.sign(payload,process.env.JWT_KEY,{expiresIn:60*60})
    return token
}

export const verifyToken = (payload)=>{
    const data = jwt.verify(payload,process.env.JWT_KEY)
}