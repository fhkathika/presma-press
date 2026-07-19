import { Router } from "express";
import { subcriptionController } from "./subcription.controller";
import { auth } from "../auth";
import { Role } from "../../../../generated/prisma/enums";

const router=Router()

router.post("/checkout",
    auth(Role.USER,Role.AUTHER,Role.ADMIN),
    subcriptionController.createCheckOutSession)
    router.post("/webhook",subcriptionController.handleWebhook)
export const subcriptionRoute=router