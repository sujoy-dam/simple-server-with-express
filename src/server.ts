import express, { Request, response, Response } from "express"
import config from "./config";
import initDB, { pool } from "./config/db";
import {userRoutes } from "./modules/user/user.routes";

const app = express()
const port = config.port;
// parser 
app.use(express.json())

// initializing DB 
initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Level Developers!')
})

// users CRUD
app.use("/users", userRoutes);


// todos crud 
app.post("/todos", async (req, res) => {
  console.log(req.body)
  const { user_id, title } = req.body;
  try {
const result = await pool.query(`
  INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *
  `,[user_id, title])
  res.status(200).json({
    success:true,
    message:"Todos create Successfully", 
    data:result.rows[0]
  })
  } catch (error: any) {
    res.status(500).json({
      successs: false,
      message: error.message
    })
  }
})

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM todos
      `)
    // console.log("all users", result)
    res.status(200).json({
      success: true,
      message: "Todos retrive successfully",
      data: result.rows
    })

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// get single data
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
  SELECT * FROM todos WHERE id=$1
  `, [id])
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

})

// update data 
app.put("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title } = req.body;
    // console.log("update data", name, id)
    // return
    const result = await pool.query(`
      UPDATE todos SET title=$1 WHERE id=$3 RETURNING *
      `, [title])

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
        message: "todos Updated Successfully",
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// delete data 
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
  DELETE FROM todos WHERE id=$1
  `, [id])
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
        message: "Todos delete Successfully",
        data: result.rows
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }

})




// not found route 
app.use((req,res, next)=>{
  res.status(404).json({
    success:false,
    message:"Route not found",
    path:req.path,
  })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
