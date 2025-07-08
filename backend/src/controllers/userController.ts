import { Response } from "express";
import { newReq } from "../middleware/auth";

export const getProfile = async (req: newReq, res: Response) => {
  try {
    const user = req.user;

    const existingUser = await prisma?.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        isDeleted: true,
        role: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "no user found" });
      return;
    }

    res
      .status(200)
      .json({ existingUser, message: "successfull fetch the user" });
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
