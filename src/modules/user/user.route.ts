import { Router, type Request, type Response } from "express";
import { Pool } from "pg";
import { pool } from "../../db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { User_Role } from "../../types";

// Declare Mini server
const router = Router();

router.post("/", userController.createUser);

// Get all the post

router.get("/", auth(User_Role.admin, User_Role.user), userController.getUser);

// Get All Post By Id

router.get("/:id", userController.getSingleUser);

// Update A User

router.put("/:id", userController.updateUser);

// Delete A user

router.delete("/:id", userController.deleteUser);

export const userRoute = router;
