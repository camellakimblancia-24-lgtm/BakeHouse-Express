import type { Request, Response } from 'express'
import { AuthService } from './auth.service.js'
import { createUserSchema, loginSchema, updateUserSchema, userIdParamSchema } from './auth.schema.js'

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthService.login(validatedData);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      ...result,
    });
  } catch (err: unknown) {
    return res.status(401).json({ success: false, message: (err as Error).message});
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await AuthService.createUser(validatedData);

    return res.status(201).json({
      success: true,
      message: `User ${user.email} created successfully.`,
      user,
    });
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await AuthService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const user = await AuthService.getUserById(id);

    return res.status(200).json({ success: true, data: user });
  } catch (err: unknown) {
    return res.status(404).json({ success: false, message: (err as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const validatedData = updateUserSchema.parse(req.body);
    const updatedUser = await AuthService.updateUser(id, validatedData);

    return res.status(200).json({
      success: true,
      message: `User ${updatedUser.email} updated successfully.`,
      data: updatedUser,
    });
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = userIdParamSchema.parse(req.params);
    const result = await AuthService.deleteUser(id);

    return res.status(200).json({ success: true, ...result });
  } catch (err: unknown) {
    return res.status(400).json({ success: false, message: (err as Error).message });
  }
};

