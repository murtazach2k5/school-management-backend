import { Request, Response } from "express";
import { signupUser, loginUser } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    const user = await signupUser({ email, password, role });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
import { AuthRequest } from "../middlewares/auth.middleware";

export const getMe = async (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user info",
    data: req.user,
  });
};