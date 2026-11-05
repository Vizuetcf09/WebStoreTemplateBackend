import mongoose from "mongoose";
import { z } from "zod";

// ==========================================
// 1. CONFIGURACIÓN Y VALIDACIONES DE CORREO
// ==========================================

export const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'outlook.es',
  'hotmail.com',
  'hotmail.es',
  'live.com',
  'live.com.mx',
  'msn.com',
  'yahoo.com',
  'yahoo.es',
  'yahoo.com.mx',
  'icloud.com',
  'me.com',
  'mac.com',
  'proton.me',
  'protonmail.com',
  'zoho.com'
];

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailValidation = z
  .string({ required_error: 'El correo electrónico es obligatorio' })
  .trim()
  .toLowerCase()
  .regex(EMAIL_REGEX, 'El formato del correo electrónico no es válido (ej. usuario@gmail.com)')
  .refine(
    (email) => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];

      const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((val) => val.trim().toLowerCase())
        .filter(Boolean);
      const adminDomains = adminEmails.map((e) => e.split('@')[1]).filter(Boolean);

      return ALLOWED_EMAIL_DOMAINS.includes(domain) || adminDomains.includes(domain);
    },
    {
      message: 'Solo se permiten correos de proveedores válidos (Gmail, Outlook, Hotmail, Yahoo, iCloud, etc.)'
    }
  );

// ==========================================
// 2. ESQUEMAS ZOD (REGISTRO Y LOGIN)
// ==========================================

export const userRegisterSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe superar los 50 caracteres'),
  email: emailValidation,
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no debe superar los 100 caracteres')
});

export const userLoginSchema = z.object({
  email: emailValidation,
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña es obligatoria')
});

export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;

// ==========================================
// 3. MODELO / ESQUEMA MONGOOSE
// ==========================================

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_REGEX, 'El formato del correo electrónico no es válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('users', UserSchema);
