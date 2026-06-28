import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors"

import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";

const registerUser=async(req:Request,res:Response)=>{
const {name,email,password,profilePhoto}=req.body;
const isUserExist=await prisma.user.findUnique({
    where:{email}
})
if(isUserExist){
    throw new Error("User with this email already exist")

}
const hashedPassword=await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))
const createdUser=await prisma.user.create({
    data:{
        name,
        email,
        password:hashedPassword,
    }
})
await prisma.profile.create({
    data:{
        userId:createdUser.id,
        profilePhoto
    }
})

const user=await prisma.user.findUnique({
    where:{
        id:createdUser.id,
        email:createdUser.email|| email
    },
    omit:{
        password:true
    },
    include:{
        profile:true
    }
})
res.status(httpStatus.CREATED).json({
    success:true,
    statusCode:httpStatus.CREATED,
    message:"User regitared successfully",
    data:{
        user
    }

})


    }

    export const  userController={
        registerUser
    }