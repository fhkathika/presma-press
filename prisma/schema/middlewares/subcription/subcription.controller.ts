import { Response,Request, NextFunction } from "express";
import { catchAsync } from "../../../../src/utils/catchAsync";
import { subcriptionServices } from "./subcription.service";
import { sendResponse } from "../../../../src/utils/sendResponse";
import httpStatus from "http-status"
import config from "../../../../src/config";
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

const handleWebhook=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  
    const event =req.body as Buffer;
    const signature=req.headers['stripe-signature']!;

    await subcriptionServices.handleWebhook(event,signature as string)
    sendResponse(res,{
        success:true,
statusCode:200,
message:'webhook triggered successfully',
data:{}
    })

})

export const subcriptionController={
    createCheckOutSession,
    handleWebhook
}