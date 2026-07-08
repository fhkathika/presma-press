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
import { auth } from "../../../prisma/schema/middlewares/auth";
const router=Router()

router.post("/register",userController.registerUser)


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

router.put("/my-profile",auth(Role.ADMIN,Role.AUTHER,Role.USER),userController.updateMyProfile)

    export const userRoutes=router