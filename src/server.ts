import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 5000;

// This is a middleware for json data to show the data as json not undefined
app.use(express.json());
// // This is a middleware for text data to show the data as json not undefined

app.use(express.text());
// // This is a middleware for nested data to show the data as json not undefined

app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
});

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

app.post("/", async (req: Request, res: Response) => {
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
    data: result.rows[0],      //To get all data
  });
 } catch (error:any) {
    res.status(500).json({
    message: error.message,
    error:error,
 })
}
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
