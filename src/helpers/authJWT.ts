import jwt from "jsonwebtoken";

export function generateToken(email: string, role: 'user' | 'admin' = 'user') {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ email, role }, secretKey, { expiresIn: "1h" });
}
