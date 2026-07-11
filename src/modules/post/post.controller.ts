import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
const createPost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id=req.user?.id
    const payload=req.body;
    const result =await postService.createPost(payload,id as string)
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"POst created successfully",
        data:result
    })
})
const getAllPost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const result=await postService.getAllPost();
console.log("result",result)
sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"Post Retrived Successfully",
    data:result
})
})
const getPostStatus=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{


})
const getMyPosts=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const authorId=req.user?.id
const result=await postService.getMyPosts(authorId as string);
sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"my Post Retrived Successfully",
    data:result
})
})
const getMyPostsById=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const postId=req.params.postId;
if(!postId){
    throw new Error("Post id Required in params")
}
const result=await postService.getMyPostsById(postId as string)
sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"post retrived successfully",
    data:result
})
})
const deletePost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const authorId=req.user?.id
const isAdmin=req.user?.role==="ADMIN"
const postId=req.params.postId;

await postService.deletePost(postId as string,authorId as string,isAdmin)
sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"post deleted successfully",
    data:null
})
})
const updatePost=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
const authorId=req.user?.id
const isAdmin=req.user?.role==="ADMIN"
const postId=req.params.postId;
const payload=req.body;
const result=await postService.updatePost(postId as string,payload,authorId as string,isAdmin)
sendResponse(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:"post updated successfully",
    data:result
})

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