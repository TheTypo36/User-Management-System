import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  } catch (error) {}
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
