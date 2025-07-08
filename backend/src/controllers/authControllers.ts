import { Request, Response } from "express";
import prisma from "../db/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    console.log(
      "email ",
      email,
      " username ",
      username,
      " password ",
      password,
      " role ",
      role
    );
    if (!email || !password || !username) {
      res.status(404).json({
        message:
          "password, username and email are required fields for creating a user",
      });
      return;
    }

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
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      res.status(404).json({ message: "password and email is missing" });
      return;
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "user doesn't existed!!" });
      return;
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
      res.status(400).json({ message: "password is wrong" });
      return;
    }
    console.log("jwt secret", process.env.JWT_SECRET);
    const id = existingUser.id;
    const username = existingUser.username;
    const token = jwt.sign(
      { id, username } as JwtPayload,
      process.env.JWT_SCERET as string
    );

    res.status(200).json({ token, message: "user successully signed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `internal server error in user creation ${error}` });
    console.error(error);
  }
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
