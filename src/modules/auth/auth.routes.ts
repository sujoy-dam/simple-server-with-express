import { Router } from "express";
import {authController} from "./auth.controller"
import auth from "../../middleware/auth";

const router = Router();

router.post("/login", authController.userLogin)

export const authRoutes = router;