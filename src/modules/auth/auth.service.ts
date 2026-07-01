import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtills } from "../../utils/jwt";
const loginUser=async (payload:ILoginUser)=>{
const {email,password}=payload;
const user=await prisma.user.findUniqueOrThrow({
    where:{email}
})
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
export const authService={
    loginUser
}