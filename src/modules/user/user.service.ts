import { pool } from "../../db";
import type { IUser } from "./user.interface";

import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
  //For insert data into table
  const { name, email, age, password } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (name, email,age,password) VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [name, email, age, hashPassword],
  );
  delete result.rows[0].password;

  return result;
};

const getUserFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users`);

  delete result.rows[0].password;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
  
  SELECT * FROM users WHERE id=$1`,
    [id],
  );
  delete result.rows[0].password;

  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, age, password } = payload;

  let hashPassword = password;

  // Only when user update the password then it will go in this function
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  const result = await pool.query(
    `UPDATE users SET 
      name= COALESCE ($1,name), 
      age=COALESCE ($2,age), 
      password=COALESCE ($3,password)
      WHERE id=$4 RETURNING *`,
    [name, age, hashPassword, id],
  );
  delete result.rows[0].password; //For delete the password row to show the user

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
