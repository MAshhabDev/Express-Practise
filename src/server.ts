import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = 5000;

// This is a middleware for json data to read the json body and show the data as json not undefined
app.use(express.json());
// // This is a middleware for text data to show the data as text not undefined

app.use(express.text());
// // This is a middleware for nested/form data to show the data as json not undefined

app.use(express.urlencoded({ extended: true }));

// Connect the PostGreSQL
const pool = new Pool({
  connectionString: config.connection,
});

// Create Db table user in the db
const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL , 
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()



            )
            
            `);
  } catch (error) {}
};
initDB();
app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");

  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

// Create A post
app.post("/api/users", async (req: Request, res: Response) => {
  //   console.log(req.body);
  try {
    const { name, email, age, password } = req.body;

    //For insert data into table
    const result = await pool.query(
      `
    INSERT INTO users (name, email,age,password) VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, age, password],
    );
    res.status(201).json({
      message: "New Data Created",
      data: result.rows[0], //To get all data
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

// Get all the post

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: "Users Rettrived Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
});

// Get all users by id

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
  
  SELECT * FROM users WHERE id=$1`,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users did not find",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Users Per Id Rettrived Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, age, password } = req.body;

    const result = await pool.query(
      `UPDATE users SET 
      name= COALESCE ($1,name), 
      age=COALESCE ($2,age), 
      password=COALESCE ($3,password)
      WHERE id=$4 RETURNING *`,
      [name, age, password, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users did not find",
        data: [],
      });
    }
    res.status(201).json({
      success: true,
      message: "Users Per Id Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users did not find",
        data: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Per Id Deleted Successfully",
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
