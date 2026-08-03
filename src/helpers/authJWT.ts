import jwt from "jsonwebtoken";

export function generateToken(email: string) {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign({ email }, secretKey, { expiresIn: "1h" });
}
