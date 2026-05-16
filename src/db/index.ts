import { Pool } from "pg";
import config from "../config";

// Connect the PostGreSQL
export const pool = new Pool({
  connectionString: config.connection,
});

// Create Db table user in the db
export const initDB = async () => {
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