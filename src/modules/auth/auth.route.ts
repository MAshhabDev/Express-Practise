import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post("/", authController.logInUser);

route.get("/:email", authController.singleLogInUser);

export const authRoute = route;
