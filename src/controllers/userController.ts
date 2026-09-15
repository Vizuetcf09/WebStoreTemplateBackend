import { Request, Response } from "express";
import userModels from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../types/userTypes.js";
import { generateToken } from "../helpers/authJWT.js";

class UserController {

  constructor() { }

  // REGISTER controler

  // Register a new user controler
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await userModels.getOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
      const normalizedEmail = String(email).trim().toLowerCase();

      const role: UserRole = adminEmails.includes(normalizedEmail) ? 'admin' : 'user';
      const newUser: IUser = {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role
      };

      const savedUser = await userModels.create(newUser);
      return res.status(201).json({
        message: "User registered successfully",
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  // LOGIN controler

  // Login a user controler
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await userModels.getOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: "Email does not exist" });
      }

      const userMatch = await bcrypt.compare(password, existingUser.password);

      if (!userMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
      const role = existingUser.role === 'admin' || adminEmails.includes(existingUser.email.toLowerCase())
        ? 'admin'
        : 'user';
      const token = generateToken(existingUser.email, role);

      return res.status(200).json({
        message: "Login successful",
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role,
        isAdmin: role === 'admin',
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default new UserController();