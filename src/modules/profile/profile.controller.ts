import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const result = await profileService.createProfileFromDB(req.body);
    res.status(201).json({
      message: "New Profile Created",
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


export const profileController={createProfile}