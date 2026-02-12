import express from "express";
import { userController } from "./user.controller";
const router = express.Router()

router.post("/", userController.createUser);
router.get("/", userController.getAllUser)
router.get("/:id", userController.getSingleUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

export const userRoutes= router;