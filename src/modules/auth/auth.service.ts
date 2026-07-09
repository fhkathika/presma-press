import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtills } from "../../utils/jwt";
import { NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
const loginUser=async (payload:ILoginUser)=>{
const {email,password}=payload;
const user=await prisma.user.findUniqueOrThrow({
    where:{email}
})
if(user.activeStatus==="BLOCKED"){
  throw new Error("Your account has been blocked.Please contact into support")
}
const isPasswordMatched=await bcrypt.compare(password,user.password)
if(!isPasswordMatched){
    throw new Error("Password not matched")
}
const jwtPayload={
id:user.id,
email:user.email,
role:user.role,
name:user.name

}
// const accessToken=jwt.sign(jwtPayload,config.jwt_access_secret,{
//     expiresIn:config.jwt_access_expires_in
// } as SignOptions
// )
const accessToken=jwtUtills.createToken(
jwtPayload,
config.jwt_access_secret,
config.jwt_access_expires_in  as SignOptions

)

// const refreshToken=jwt.sign(jwtPayload,config.jwt_refresh_secret,{
//     expiresIn:config.jwt_refresh_expires_in
// }  as SignOptions
// )
const refreshToken=jwtUtills.createToken(
jwtPayload,
config.jwt_refresh_secret,
config.jwt_refresh_expires_in  as SignOptions

)


return {accessToken,refreshToken}
}
const refreshToken=async(refreshToken:string)=>{
const verifiedRefreshToke=jwtUtills.verifyToken(refreshToken,config.jwt_refresh_secret)

if(!verifiedRefreshToke.success){
    throw new Error(verifiedRefreshToke.error)
}
const {id}=verifiedRefreshToke.data as JwtPayload;
const user=await prisma.user.findFirstOrThrow({
    where:{
        id
    }
})
if(user.activeStatus==="BLOCKED"){
    throw new Error("USER IS BLOKED")
}

const jwtPayload={
    id,
    name:user.name,
    email:user.email,
    role:user.role
}
const accessToken=jwtUtills.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
);
return {accessToken}
}
export const authService={
    loginUser,
    refreshToken
}