import { Response,Request, NextFunction } from "express";
import { catchAsync } from "../../../../src/utils/catchAsync";
import { subcriptionServices } from "./subcription.service";
import { sendResponse } from "../../../../src/utils/sendResponse";
import httpStatus from "http-status"
const createCheckOutSession=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
const userId=req.user?.id;
const result=await subcriptionServices.createCheckOutSession(userId as string)
sendResponse(res,{
    success:true,
statusCode:httpStatus.OK,
message:"Checkout completed successfully",
data:result
})
    }
)

export const subcriptionController={
    createCheckOutSession
}