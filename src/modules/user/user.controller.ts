import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  // console.log("req", name, email)
  // return
  try {
    const result = await userService.createUserDB(name, email)
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Data inserted successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUserDB()
    // console.log("all users", result)
    res.status(200).json({
      success: true,
      message: "Users retrive successfully",
      data: result.rows
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await userService.getSingleUserDB(id as string)
    // console.log(result)
    if (result.rows.length < 1) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Single data get Successfully",
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

}
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email } = req.body;
    // console.log("update data", name, id)
    // return
    const result = await userService.updateUserDB(name, email, id as string)

    // console.log("update data", result)
    if (result.rows.length < 1) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "Users Updated Successfully",
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await userService.deleteUserDB(id as string)
    // console.log(result)
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found"
      })
    }
    else {
      res.status(200).json({
        success: true,
        message: "User delete Successfully",
        data: null
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

}
export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser
}