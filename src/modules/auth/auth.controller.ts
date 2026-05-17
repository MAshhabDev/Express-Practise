import type { Request, Response } from "express";
import { authRoute } from "./auth.route";
import { authService } from "./auth.service";

const logInUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.logInFromDB(req.body);

    res.status(201).json({
      message: "New Profile Created",
      data: result, //To get all data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
};

export const authController = { logInUser };
