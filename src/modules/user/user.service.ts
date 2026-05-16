import { pool } from "../../db";
import type { IUser } from "./user.interface";

const createUserIntoDB = async (payload: IUser) => {
  //For insert data into table
  const { name, email, age, password } = payload;

  const result = await pool.query(
    `
    INSERT INTO users (name, email,age,password) VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, age, password],
  );
  return result;
};

const getUserFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users`);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
  
  SELECT * FROM users WHERE id=$1`,
    [id],
  );

  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, age, password } = payload;

  const result = await pool.query(
    `UPDATE users SET 
      name= COALESCE ($1,name), 
      age=COALESCE ($2,age), 
      password=COALESCE ($3,password)
      WHERE id=$4 RETURNING *`,
    [name, age, password, id],
  );
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};
export const userService = {
  createUserIntoDB,
  getUserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
