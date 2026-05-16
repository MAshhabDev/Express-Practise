import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { pool } from "./db";
const app: Application = express();

// This is a middleware for json data to read the json body and show the data as json not undefined
app.use(express.json());
// // This is a middleware for text data to show the data as text not undefined

app.use(express.text());
// // This is a middleware for nested/form data to show the data as json not undefined

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoute);

app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");

  res.status(200).json({
    message: "Express Server",
    author: "Next Level",
  });
});

// Create A post



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

export default app;
