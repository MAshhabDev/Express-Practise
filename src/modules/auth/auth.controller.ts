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

const singleLogInUser = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const result = await authService.singleLogInUserFromDB(email as string);
    res.status(200).json({
      message: "Authentic Single User Data",
      data: result.rows[0], //To get all data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
};

export const authController = { logInUser, singleLogInUser };
