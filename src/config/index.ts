import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), "env"),
});

const config ={

  connection:  process.env.CONNECTIONSTRING as string,
} 

export default config;
