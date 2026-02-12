import express, { Request, response, Response } from "express"
import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from "path";
const app = express()
const port = 5000;
// parser 
app.use(express.json())



dotenv.config({ path: path.join(process.cwd(), ".env") })

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`
})





const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    complete BOOLEAN DEFAULT false,
    due_dat DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `)
}
initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Level Developers!')
})

// users CRUD

// post 
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  // console.log("req", name, email)
  // return
  try {
    const result = await pool.query(`
  INSERT INTO users(name, email) VALUES($1, $2) RETURNING *
  `, [name, email])
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
})
// get all data
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
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
})
// get single data
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
  SELECT * FROM users WHERE id=$1
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
app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email } = req.body;
    // console.log("update data", name, id)
    // return
    const result = await pool.query(`
      UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *
      `, [name, email, id])

    console.log("update data", result)
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
})

// delete data 
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
  DELETE FROM users WHERE id=$1
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

})


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
