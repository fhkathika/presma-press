import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
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
export default app;