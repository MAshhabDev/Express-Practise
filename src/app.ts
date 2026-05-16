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


export default app;
