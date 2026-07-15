import { Request, Response } from "express"

export const notFound=(req:Request,res:Response)=>{
res.status(404).json({
    mesage:"route not found",
    path:req.originalUrl,
    date:Date()
})
    }