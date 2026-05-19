import { Router } from "express";
import { authController } from "./auth.controller";

const route = Router();

route.post("/login", authController.logInUser);

route.get("/:email", authController.singleLogInUser);

route.post("/access-token", authController.refreshToken);

export const authRoute = route;
