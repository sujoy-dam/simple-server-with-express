import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";

const loginUserDB = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])
        
        console.log("connected login Db", result)
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0]
    const match= await bcrypt.compare(password, user.password)
    if(!match){
        return false;
    }
    // console.log(result)
    const userInfo = {
        name:user.name,
        email:user.email,
        role: user.role
    }
    const token = jwt.sign(userInfo, config.jwt_secret as string,{expiresIn:"7d"} )
    console.log(token)
    return {token, user}

}


export const authService = {
    loginUserDB
}