import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

enum sortWays {
  desc,
  Asc,
}
export interface newReq extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    email: string;
    createdAt: Date;
    isDeleted: Boolean;
  };
}
export const authVerify = async (
  req: newReq,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(400).json({
      message: "unauthorized user",
    });
    return;
  }
  if (!process.env.JWT_SECRET) {
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decodedToken === "string") {
      return;
    }
    const user = await prisma?.user.findUnique({
      where: {
        id: decodedToken.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        isDeleted: true,
      },
    });
    if (!user) {
      res.status(400).json({ message: "error in authorization" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: `internal server error ${error}` });
  }
};

export const authorize = (roles: string[]) => {
  return (req: newReq, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ message: "Access denied. User not authenticated." });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
};
