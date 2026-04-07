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
        message: "User registered successfully", // TODO: message indicating user registered successfully not found - resolver
        userId: savedUser._id
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

      const user = await userModels.getAll();

      const foundUser = user.find((user) => user.email === email && user.password === password);
      if (foundUser) {
        res.status(200).json(foundUser);
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

}

export default new UserController();