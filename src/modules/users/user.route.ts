import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpStatus from "http-status";
import { userController } from "./user.controller";
import { jwtUtills } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
const router=Router()
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
router.post("/register",userController.registerUser)

const auth=(...requiredRoles:Role[])=>{
  return catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.asscessToken 
    // || req.headers.authorization?.startsWith("Bearer")?
    // req.headers.authorization?.split(" ")[1]:req.headers.authorization;

    if(!token){
      throw new Error("You are not logged in .lpease log in to access resource");
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
router.get("/me",
  auth(Role.ADMIN,Role.USER,Role.AUTHER),
//   (req:Request,res:Response,next:NextFunction)=>{
// console.log(req.cookies)  
// const {accessToken}=req.cookies;

// const verifiedToken=jwtUtills.verifyToken(accessToken,config.jwt_access_secret)

// if(!verifiedToken.success){
//   throw new Error(verifiedToken.error)
// }
// const {email,name,id,role}=verifiedToken.data as JwtPayload
// // const requiredRoles=["ADMIN","USER","AUTHOR"]
// const requiredRoles=[Role.ADMIN,Role.AUTHER,Role.USER]
// if(!requiredRoles.includes(role)){
//   return res.status(403).json({
// success:true,
// statusCode:httpStatus.FORBIDDEN,
// message:"Forbidden . you dont have permission to access this resource"
// } )
// }
// req.user={
//     email,
//     name,
//     id,
//     role
// };
// next()
// },

userController.getMyProfile)

    export const userRoutes=router