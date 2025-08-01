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
  console.log("skip", skip);
  try {
    const where: any = {
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
          avatar: true,
          createdAt: true,
          isDeleted: true,
        },
        skip,
        take: parseInt(limit as string),
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
    const id = parseInt(req.body.id) || parseInt(req.params.id);
    const avatar = req.body.avatar;
    console.log("id", id);
    const userTobeUpdate = await prisma?.user.findUnique({
      where: {
        id: id,
      },
    });
    console.log(
      "user who is doing",
      user.username,
      "id: ",
      user?.id,
      " user who is receving the change",
      userTobeUpdate?.username,
      "id: ",
      userTobeUpdate?.id
    );
    console.log("avatar", avatar);
    if (!userTobeUpdate) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    if (req.user?.role === "SUB_ADMIN" && userTobeUpdate?.role !== "USER") {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }

    if (req.user?.role === "USER" && req.user?.id !== userTobeUpdate.id) {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }
    const userData = {
      ...(username && { username }),
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(isDeleted !== undefined &&
        req.user?.role !== "USER" && { isDeleted }),
      ...(role && req.user?.role === "ADMIN" && { role: role.toUpp }),
    };
    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma?.user.update({
      where: {
        id: userTobeUpdate.id,
      },
      data: userData,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
        updateAt: true,
        isDeleted: true,
      },
    });
    console.log("user after updation", updatedUser);

    const auditLog = await prisma?.auditLog.create({
      data: {
        action: "Updated_User",
        performedBy: user.id,
        ipAddress: req.ip,
        target: userTobeUpdate.email,
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

export const deactivateUser = async (req: newReq, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const isDeleted = req.body.isDeleted;
    if (!id) {
      res.status(400).json({ message: "userid required" });
      return;
    }

    console.log("id", id);

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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
        isDeleted: isDeleted,
      },
    });

    const userId = req.user?.id as number;
    const audit = await prisma.auditLog.create({
      data: {
        action: "Deactivate_user",
        performedBy: userId,
        target: existingUser?.email,
        ipAddress: req.ip,
      },
    });

    res
      .status(200)
      .json({ existingUser, audit, message: "successfull deactivated user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `internal server error ${error}` });
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

    await prisma.user.delete({
      where: {
        id,
      },
    });
    const userId = req.user?.id as number;
    const audit = await prisma.auditLog.create({
      data: {
        action: "Deactivate_user",
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
      return;
    }

    console.log("inside create user", username, role);

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
      res.status(500).json({ message: "User creation failed" });
      return;
    }
    console.log("created user");
    const id = req.user?.id as number;

    const audit = await prisma.auditLog.create({
      data: {
        action: "Create_User",
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
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
        avatar: true,
        createdAt: true,
        updateAt: true,
      },
    });

    if (!existingUser) {
      res.status(404).json({ message: "no user found with this email" });
      return;
    }
    if (req.user?.role === "user" && existingUser.id != req.user.id) {
      res.status(403).json({ message: "insuccifient permission" });
      return;
    }
    if (
      req.user?.role === "SUB_ADMIN" &&
      existingUser.role !== "USER" &&
      !(req.user?.id === existingUser?.id)
    ) {
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

export const getAllAudits = async (req: newReq, res: Response) => {
  try {
    const role = req.user?.role;
    if (role === "USER") {
      res.status(403).json({ message: "insufficient permission" });
      return;
    }

    const audits = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });
    res.status(202).json({ audits, message: "succesfully fetch all audits" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `internal server error in fetching audits ${error}` });
  }
};
