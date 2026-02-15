import { Request, Response } from "express"
import { authService } from "./auth.service"

const userLogin = async (req: Request, res: Response) => {
    // console.log(req.body)
    try {
        const { email, password } = req.body;
        const result = await authService.loginUserDB(email, password)
        if (!result) {
            return res.status(200).json({
                success: false,
                message: "Login unsuccessfull",
                data: result
            })
        }
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const authController = {
    userLogin
}