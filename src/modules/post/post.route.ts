import { Router } from "express";
import { auth } from "../../../prisma/schema/middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router=Router();
router.post(
    "/",
    auth(Role.USER,Role.ADMIN,Role.AUTHER),
    postController.createPost
)
router.get(
    "/",
    postController.getAllPost
)
router.get(
    "/stats",auth(Role.ADMIN),
    postController.getPostStatus
)
router.get(
    "/my-posts",auth(Role.USER,Role.ADMIN,Role.AUTHER),
    postController.getMyPosts
)
router.get(
    "/:postId",
    postController.getMyPostsById
)
router.patch(
    "/:postId",auth(Role.USER,Role.ADMIN,Role.AUTHER),
    postController.updatePost
)
router.delete(
    "/:postId",auth(Role.USER,Role.ADMIN,Role.AUTHER),
    postController.deletePost
)

export const postRoutes=router;

