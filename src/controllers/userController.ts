import { Request, Response } from "express";
import userModels from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { IUser } from "../types/userTypes.js";

class UserController {

  constructor() { }

  // REGISTER controler

  // Register a new user controler
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await userModels.getOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" }); // TODO: message indicating email already exists not found - resolver
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        name,
        email,
        password: hashedPassword
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
      } return res.status(200).json({
        message: "Login successful",
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

export default new UserController();