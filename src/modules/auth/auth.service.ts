import type { Request, Response } from "express";
import { pool } from "../../db";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import config from "../../config";

const logInFromDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credential");
  }

  const user = userData.rows[0];

  //   For compare the password
  const matchPass = await bcrypt.compare(password, user.password);
  //   console.log(matchPass); to check te pass is it ok or not

  if (!matchPass) {
    throw new Error("Invalid Credential");
  }

  //   Generate Token

  // Payload
  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    role:user.role,
    email: user.email,
  };

  //   Crate the token
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

const singleLogInUserFromDB = async (email: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (user.rows.length === 0) {
    throw new Error("Invalid Credential");
  }

  delete user.rows[0].password;
  return user;
};

export const authService = { logInFromDB, singleLogInUserFromDB };
