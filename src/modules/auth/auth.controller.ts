import type { Request, Response } from "express";
import { authRoute } from "./auth.route";
import { authService } from "./auth.service";

const logInUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.logInFromDB(req.body);

    const { refreshToken } = result;

    // Save the refresh token in cookies

    res.cookie("refreshToken", refreshToken, {
      secure: false, //In production it will be true
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User LogIn SuccessFully",
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

const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refreshToken,
    );
    res.status(200).json({
      success: true,
      message: "Access token retrieved successfully!",
      data: result, // এর ভেতর নতুন { accessToken } থাকবে
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = { logInUser, singleLogInUser, refreshToken };
