import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post("/", authController.logInUser);

export const authRoute = route;
