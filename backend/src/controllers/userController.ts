import { Request, Response } from "express";
import prisma from "../db/client";
import bcrypt from "bcrypt";
export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        role,
      },
    });

    if (!user) {
      res.status(300).json({
        message: "error in creating user",
      });
      return;
    }

    res.status(200).json({ user, message: "user successfull created!!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `internal server error in user creation ${error}` });
    console.error(error);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
export const getProfile = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
