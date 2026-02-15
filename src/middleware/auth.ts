import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

const auth = (...role: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log({ authToken: token })
            if (!token) {
                return res.status(500).json({
                    success: false,
                    message: "You are unauthorized"
                })
            }
            const decoded = jwt.verify(token as string, config.jwt_secret as string) as JwtPayload
            console.log({ "docoded": decoded })
            req.user = decoded 

            if (role.length && role.includes(decoded.role)) {
                return res.status(500).json({
                    error: "Unauthorized"
                })
            }

            next()
        } catch (error: any) {
            res.status(500).json({
                success: false,
                messaeg: error.message
            })
        }
    }
}
export default auth;