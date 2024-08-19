import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken"
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      userId:string,
      auth0Id:string
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  
  // Check if the Authorization header is present and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If the header is missing or does not start with "Bearer ", respond with a 401 Unauthorized status
    return res.sendStatus(401);
  }
  
  // Split the Authorization header string by space and extract the token part
  const token = authorization.split(" ")[1];

try {
  const decoded = jwt.decode(token) as jwt.JwtPayload
  const auth0Id= decoded.sub
  const user = await User.findOne({auth0Id})

  if(!user) {
    return res.sendStatus(401)
  }
  req.userId = user._id.toString()
  req.auth0Id = auth0Id as string
  next()
}


catch(error) {
  return res.sendStatus(401)
}
};
