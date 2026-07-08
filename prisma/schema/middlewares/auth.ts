import { NextFunction ,Request,Response} from "express";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../../src/utils/catchAsync";
import { jwtUtills } from "../../../src/utils/jwt";
import config from "../../../src/config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../src/lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: string;
      };
    }
  }
}
export const auth=(...requiredRoles:Role[])=>{
  return catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.asscessToken ?req.cookies.asscessToken
    :req.headers.authorization?.startsWith("Bearer")?
    req.headers.authorization?.split(" ")[1]:req.headers.authorization;

    if(!token){
      throw new Error("You are not logged in .please log in to access resource");
    }
   const verifiedToken=jwtUtills.verifyToken(token,config.jwt_access_secret)

if(!verifiedToken.success){
  throw new Error(verifiedToken.error)
}
const {email,name,id,role}=verifiedToken.data as JwtPayload
if(requiredRoles.length && !requiredRoles.includes(role)){
throw new Error("Forbidden.you dont have permission to access this resource")  
}
const user =await prisma.user.findUnique({
  where:{
    id,
    email,
    name,
    role
  }
});
if(!user){
  throw new Error("user not found .Please log in again")
}

if(user.activeStatus==="BLOCKED"){
  throw new Error("Your account has been blocked.Please contact into support")
}
req.user={
  email,name,id,role
}
next()

  })
}