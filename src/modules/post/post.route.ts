import { Router } from "express";
import { auth } from "../../../prisma/schema/middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();
router.post(
    "/",
    auth(Role.USER,Role.ADMIN,Role.AUTHER),
    postController.createPost
)

