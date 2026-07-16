import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { postRoutes } from "./modules/post/post.route";
import { notFound } from "../prisma/schema/middlewares/notFound";
import { globalErrorHandler } from "../prisma/schema/middlewares/globalErrorHandler";
import { subcriptionRoute } from "../prisma/schema/middlewares/subcription/subcription.route";

const app: Application=express();
app.use(cors({
    origin:config.app_url,
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.get("/",async(req:Request,res:Response) => {

    res.send("Hello world")
    })

    app.use("/api/users",userRoutes)
    app.use("/api/auth",authRoutes)
    app.use("/api/posts",postRoutes)
    app.use("/api/comments",commentRoutes)
  app.use("/api/subcription",subcriptionRoute)
    app.use(notFound)
    app.use(globalErrorHandler)
  
export default app;