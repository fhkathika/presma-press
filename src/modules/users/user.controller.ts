import express, { Application, NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";

import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken"
import config from "../../config";
import { jwtUtills } from "../../utils/jwt";
// const registerUser=async(req:Request,res:Response)=>{

// try{
//     const payload=req.body;
// const user=await userService.registerUserIntoDb(payload)
// res.status(httpStatus.CREATED).json({
//     success:true,
//     statusCode:httpStatus.CREATED,
//     message:"User regitered successfully",
//     data:{
//         user
//     }

// })
// }
// catch(error){
// res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//     success:false,
//     statusCode:httpStatus.INTERNAL_SERVER_ERROR,
//     message:"Failed to register",
//     error:(error as Error).message
// })
// }




//     }

const registerUser=catchAsync(async (req:Request,res:Response,next:NextFunction) =>{
    const payload=req.body;
const user=await userService.registerUserIntoDb(payload)

sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
        message:"User regitered successfully",
    data:{
        user
    }
})
})
const getMyProfile=catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
const {accessToken}=req.cookies;
console.log(req.user,"user request")
// const verifiedToken=jwtUtills.verifyToken(accessToken,config.jwt_access_secret)
// if(typeof verifiedToken==="string"){
//     throw new Error(verifiedToken)
// }
 const profile=await userService.getMyProfileFromDB(req.user?.id as string)
sendResponse(res,{
success:true,
statusCode:httpStatus.OK,
message:"User Profile fetched successfully",
data:{profile}

,})
})

    export const  userController={
        registerUser,
        getMyProfile
    }