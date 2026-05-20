import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      message: "New Data Created",
      success: true,
      data: result.rows[0], //To get all data
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      message: error.message,
      success: false,
      error: error, //To get all data
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUserFromDB();
    res.status(200).json({
      success: true,
      message: "Users Rettrived Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users did not find",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Users Per Id Rettrived Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.updateUserFromDB(req.body, id as string);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users did not find",
        data: [],
      });
    }
    res.status(201).json({
      success: true,
      message: "Users Per Id Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,

      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async () => {
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteUserFromDB(id as string);
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Users did not find",
          data: [],
        });
      }
      res.status(200).json({
        success: true,
        message: "Users Per Id Deleted Successfully",
        data: {},
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,

        message: error.message,
        error: error,
      });
    }
  };
};

export const userController = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
