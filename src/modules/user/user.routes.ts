import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
const router = express.Router()

router.post("/", userController.createUser);
router.get("/", auth("amdin"), userController.getAllUser)
router.get("/:id", userController.getSingleUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

export const userRoutes= router;