import { Router } from "express";
import { auth } from "../../../prisma/schema/middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router=Router();
router.post(
    "/",
    auth(Role.USER,Role.ADMIN,Role.AUTHER),
    commentController.createComment
)
router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
)
router.get(
    "/commentId",
    commentController.getCommentByCommentId
)
router.patch(
    "/commentId",auth(Role.USER,Role.ADMIN,Role.AUTHER),
    commentController.updateComment
)
router.delete(
    "/:commentId",
    commentController.deleteComment
)
router.put(
    "/:commentId/moderate",auth(Role.USER,Role.ADMIN,Role.AUTHER),
    commentController.moderateComment
)
export const commentRoutes=router

