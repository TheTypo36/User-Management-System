import { Request, Response } from "express";
import prisma from "../db/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { newReq } from "../middleware/auth";
export const register = async (req: Request, res: Response) => {
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
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updateAt: true,
        avatar: true,
        isDeleted: true,
      },
    });

    if (!user) {
      res.status(300).json({
        message: "error in creating user",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "48h",
      }
    );
    res
      .status(200)
      .json({ user, token, message: "user successfull created!!" });
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
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        password: true,
        createdAt: true,
        updateAt: true,
        isDeleted: true,
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
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      } as JwtPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: "48h",
      }
    );
    const { password: string, ...user } = existingUser;

    res.status(200).json({ user, token, message: "user successully signed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `internal server error in user creation ${error}` });
    console.error(error);
  }
};

export const logout = async (req: newReq, res: Response) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};
