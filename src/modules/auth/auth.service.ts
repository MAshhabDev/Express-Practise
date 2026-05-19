import type { Request, Response } from "express";
import { pool } from "../../db";
import bcrypt from "bcryptjs";

import jwt, { type JwtPayload } from "jsonwebtoken";
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
    role: user.role,
    email: user.email,
  };

  //   Crate the access token
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  // create the refreshToken

  const refreshToken = jwt.sign(jwtPayload, config.access_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};

const singleLogInUserFromDB = async (email: string) => {
  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
  if (user.rows.length === 0) {
    throw new Error("Invalid Credential");
  }

  delete user.rows[0].password;
  return user;
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decode = jwt.verify(
    token as string,
    config.access_secret as string,
  ) as JwtPayload;

  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    decode.email,
  ]);
  // to check that if user exist or not on the database
  if (userData.rows.length === 0) {
    throw new Error("User Not Found");
  }

  const user = userData.rows[0];
  // console.log(user);
  // To check if user active is true or not
  if (!user?.is_active) {
    throw new Error("Forbidden");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    is_active: user.is_active,
    role: user.role,
    email: user.email,
  };

  //   Crate the token
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  return { accessToken };
};

export const authService = { logInFromDB, singleLogInUserFromDB,generateRefreshToken };
