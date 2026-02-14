import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import config from "../config";

const auth = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        console.log({ authToken: token })
        if (!token) {
            res.status(500).json({
                success: false,
                message: "You are unauthorized"
            })
        }
        const decoded = jwt.verify(token as string, config.jwt_secret as string)
        console.log({"docoded":decoded})

        next()
    }
}
export default auth;