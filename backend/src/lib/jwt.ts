import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"

type JwtPayload = {
  userId: string
  email: string
  role: "student" | "admin"
}

export function signAuthToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}