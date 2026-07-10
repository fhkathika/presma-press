import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createPost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
})
const getAllPost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getPostStatus=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getMyPosts=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const getMyPostsById=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const deletePost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
const updatePost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})
export const postController={
    createPost,
    getPostStatus,
    getMyPosts,
    getMyPostsById,
    updatePost,
    deletePost,
    getAllPost
   
}