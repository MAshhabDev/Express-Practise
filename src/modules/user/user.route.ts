import { Router, type Request, type Response } from "express";
import { Pool } from "pg";
import { pool } from "../../db";
import { userController } from "./user.controller";

// Declare Mini server
const router = Router();

router.post("/", userController.createUser);

// Get all the post

router.get("/", userController.getUser);

export const userRoute = router;
