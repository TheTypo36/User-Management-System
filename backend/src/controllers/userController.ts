import { Request, Response } from "express";
import { newReq } from "../middleware/auth";
import prisma from "../db/client";
import bcrypt from "bcrypt";
export interface userInterface {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  updatedAt: string;
  createdAt: boolean;
}

export const getAllUser = async (req: newReq, res: Response) => {
  const {
    limit = 10,
    page = 1,
    role = "",
    sortBy = "createdAt",
    search = "",
    sortOrder = "desc",
  } = req.query;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  try {
    const where: any = {
      deletedAt: null,
      ...(search && {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role: role }),
    };

    // Role-based filtering
    if (req.user?.role === "SUB_ADMIN") {
      where.role = "USER"; // Sub-admins can only see users
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
        skip,
        take: limit as number,
        orderBy: { [sortBy as string]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};
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
  } catch (error) {
    console.log(error);
    res.json({ message: `interval server error ${error}` });
  }
};

export const updateProfile = async (req: newReq, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.json({ message: "user not defined" });
      return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const role = req.body.role;
    const isDeleted = req.body.isDeleted;
    const id = parseInt(req.body.id);

    const userTobeUpadate = await prisma?.user.findUnique({
      where: {
        id: id,
      },
    });

    if (req.user?.role === "SUB_ADMIN" || userTobeUpadate?.role !== "USER") {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }

    if (req.user?.role === "USER" && req.user?.id !== userTobeUpadate.id) {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }
    const userData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(isDeleted !== undefined &&
        req.user?.role !== "USER" && { isDeleted }),
      ...(role && req.user?.role === "ADMIN" && { role: role.toUpp }),
    };

    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma?.user.update({
      where: {
        id: userTobeUpadate.id,
      },
      data: userData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updateAt: true,
        isDeleted: true,
      },
    });

    const auditLog = await prisma?.auditLog.create({
      data: {
        action: "Updated_User",
        performedBy: user.id,
        ipAddress: req.ip,
        target: userTobeUpadate.email,
      },
    });

    res.status(202).json({
      updatedUser,
      auditLog,
      message: "user updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `internal server ${error}` });
  }
};

export const deleteUser = async (req: newReq, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      res.status(400).json({ message: "userid required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updateAt: true,
        isDeleted: true,
        avatar: true,
      },
    });

    if (req.user?.role === "SUB_ADMIN" && existingUser?.role !== "USER") {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userId = req.user?.id as number;
    const audit = await prisma.auditLog.create({
      data: {
        action: "DETETED_USER",
        performedBy: userId,
        target: existingUser?.email,
        ipAddress: req.ip,
      },
    });

    res
      .status(200)
      .json({ existingUser, audit, message: "successfull deleted user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};

export const createUser = async (req: newReq, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (req.user?.role === "SUB_ADMIN" && role !== "USER") {
      res.status(403).json({ message: "sufficient permission not present" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "user already present with same email" });
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
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updateAt: true,
        isDeleted: true,
      },
    });
    if (!user) {
      return;
    }
    const id = req.user?.id as number;

    const audit = await prisma.auditLog.create({
      data: {
        action: "USER_CREATED",
        performedBy: id,
        ipAddress: req.ip,
        target: user.email,
      },
    });

    res.status(202).json({ user, audit, message: "successfull created user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};

export const getProfileById = async (req: newReq, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      res.status(404).json({ message: "id required" });
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updateAt: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "no user found with this email" });
      return;
    }

    if (req.user?.role === "SUB_ADMIN" && existingUser.role !== "USER") {
      res.status(403).json({ message: "insuccifient permission" });
      return;
    }

    res
      .status(202)
      .json({ existingUser, message: "successfull fetch the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};
