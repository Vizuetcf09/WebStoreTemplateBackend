import { Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import userModels from "../models/userModels.js";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../types/userTypes.js";
import { generateToken } from "../helpers/authJWT.js";
import { userRegisterSchema, userLoginSchema } from "../schemas/userSchema.js";
import emailService from "../services/emailService.js";

class UserController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
    this.resendVerification = this.resendVerification.bind(this);
  }

  // Register a new user controller
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = userRegisterSchema.parse(req.body);

      const existingUser = await userModels.getOne({ email });
      if (existingUser) {
        return res.status(409).json({
          field: "email",
          message: "Este correo electrónico ya está registrado"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

      const role: UserRole = adminEmails.includes(email) ? 'admin' : 'user';

      // Generar token de verificación de 24 horas
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const newUser: IUser = {
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: false,
        verificationToken,
        verificationTokenExpires
      };

      const savedUser = await userModels.create(newUser);

      // Enviar correo de verificación mediante Resend
      const emailSent = await emailService.sendVerificationEmail(savedUser.email, savedUser.name, verificationToken);

      if (!emailSent) {
        console.error(`❌ [UserController]: No se pudo enviar el correo de verificación a ${savedUser.email}`);
        return res.status(503).json({
          message: "La cuenta fue creada, pero no pudimos enviar el correo de verificación. Solicita un nuevo enlace e inténtalo de nuevo."
        });
      }

      return res.status(201).json({
        message: "Usuario registrado con éxito. Hemos enviado un enlace a tu correo para verificar tu cuenta.",
        userId: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isVerified: false,
        requiresVerification: true
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstMessage = error.issues[0]?.message || "Error de validación";
        return res.status(400).json({
          field: error.issues[0]?.path[0] || "general",
          message: firstMessage,
          details: error.issues
        });
      }

      if (error?.code === 11000 || error?.name === 'MongoServerError') {
        return res.status(409).json({
          field: "email",
          message: "Este correo electrónico ya está registrado"
        });
      }

      console.error("❌ [UserController Register Error]:", error);
      return res.status(500).json({
        message: "Error interno del servidor al registrar el usuario",
        error: error?.message || error
      });
    }
  }

  // Verify email controller
  async verifyEmail(req: Request, res: Response) {
    try {
      const token = (req.query.token as string) || (req.body?.token as string);

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "El token de verificación es obligatorio."
        });
      }

      const user = await userModels.getOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "El enlace de verificación no es válido o ha expirado."
        });
      }

      await userModels.update(user._id, {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      });

      return res.status(200).json({
        success: true,
        message: "¡Correo electrónico verificado con éxito! Ya puedes iniciar sesión."
      });
    } catch (error: any) {
      console.error("❌ [UserController VerifyEmail Error]:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al verificar el correo electrónico",
        error: error?.message || error
      });
    }
  }

  // Resend verification email controller
  async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          field: "email",
          message: "El correo electrónico es obligatorio."
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const user = await userModels.getOne({ email: normalizedEmail });

      if (!user) {
        return res.status(404).json({
          field: "email",
          message: "No existe una cuenta registrada con este correo."
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          field: "email",
          message: "Esta cuenta ya se encuentra verificada. Puedes iniciar sesión."
        });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await userModels.update(user._id, {
        verificationToken,
        verificationTokenExpires
      });

      const emailSent = await emailService.sendVerificationEmail(user.email, user.name, verificationToken);

      if (!emailSent) {
        return res.status(503).json({
          message: "No pudimos enviar el correo de verificación. Inténtalo de nuevo más tarde."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Se ha enviado un nuevo enlace de verificación a tu correo."
      });
    } catch (error: any) {
      console.error("❌ [UserController ResendVerification Error]:", error);
      return res.status(500).json({
        message: "Error interno al reenviar el correo de verificación",
        error: error?.message || error
      });
    }
  }

  // Login a user controller
  async login(req: Request, res: Response) {
    try {
      const { email, password } = userLoginSchema.parse(req.body);

      const existingUser = await userModels.getOne({ email });
      if (!existingUser) {
        return res.status(401).json({
          field: "email",
          message: "Credenciales incorrectas (correo o contraseña no válidos)"
        });
      }

      const userMatch = await bcrypt.compare(password, existingUser.password);
      if (!userMatch) {
        return res.status(401).json({
          field: "password",
          message: "Credenciales incorrectas (correo o contraseña no válidos)"
        });
      }

      // Validar si la cuenta está verificada
      if (existingUser.isVerified === false) {
        return res.status(403).json({
          field: "email",
          requiresVerification: true,
          email: existingUser.email,
          message: "Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o solicita un nuevo enlace."
        });
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
        message: "Inicio de sesión exitoso",
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role,
        isAdmin: role === 'admin',
        token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const firstMessage = error.issues[0]?.message || "Error de validación";
        return res.status(400).json({
          field: error.issues[0]?.path[0] || "general",
          message: firstMessage,
          details: error.issues
        });
      }

      console.error("❌ [UserController Login Error]:", error);
      return res.status(500).json({
        message: "Error interno del servidor al iniciar sesión",
        error: error?.message || error
      });
    }
  }
}

export default new UserController();
