import { NextFunction, Request, Response } from "express"
import { verifyAuthToken } from "../lib/jwt"

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string
    email: string
    role: "student" | "admin"
  }
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" })
    }

    const token = authHeader.slice("Bearer ".length)
    const payload = verifyAuthToken(token)

    req.auth = payload
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}