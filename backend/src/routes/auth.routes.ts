import { Router } from "express"
import { z } from "zod"
import { prisma } from "../prisma"
import { comparePassword } from "../lib/password"
import { signAuthToken } from "../lib/jwt"
import bcrypt from "bcrypt"
import {
  generateOtpCode,
  hashOtpCode,
  getOtpExpiryDate,
  compareOtpCode,
} from "../lib/otp"
import { sendOtpEmail } from "../lib/email"

const router = Router()

// ================= SCHEMAS =================
const nameSchema = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .regex(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .refine((email) => email.endsWith("@csub.edu"))

const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)

const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
})

const logInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

const forgotPasswordStartSchema = z.object({
  email: emailSchema,
})

const forgotPasswordConfirmSchema = z.object({
  email: emailSchema,
  code: z.string().trim().length(6),
  newPassword: passwordSchema,
})

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const parsed = logInSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const isValid = await comparePassword(password, user.passwordHash)

    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// ================= SIGNUP START =================
router.post("/signup/start", async (req, res) => {
  try {
    const parsed = signUpSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const { firstName, lastName, email, password } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    const otp = generateOtpCode()
    const otpHash = await hashOtpCode(otp)
    const expiresAt = getOtpExpiryDate()
    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.pendingSignup.upsert({
      where: { email },
      update: {
        firstName,
        lastName,
        passwordHash,
        role: "student",
        otpHash,
        expiresAt,
      },
      create: {
        email,
        firstName,
        lastName,
        passwordHash,
        role: "student",
        otpHash,
        expiresAt,
      },
    })

    await sendOtpEmail(email, otp)

    return res.json({
      success: true,
      message: "Verification code sent",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// ================= SIGNUP VERIFY =================
router.post("/signup/verify", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase()
    const code = String(req.body?.code ?? "").trim()

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code required" })
    }

    const pending = await prisma.pendingSignup.findUnique({ where: { email } })

    if (!pending) {
      return res.status(404).json({ error: "No pending signup found" })
    }

    if (pending.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: "Code expired" })
    }

    const isMatch = await compareOtpCode(code, pending.otpHash)

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid code" })
    }

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: pending.email,
          firstName: pending.firstName,
          lastName: pending.lastName,
          passwordHash: pending.passwordHash,
        },
      })

      await tx.pendingSignup.delete({ where: { email: pending.email } })

      return user
    })

    const token = signAuthToken({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    })

    return res.json({
      success: true,
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        role: createdUser.role,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// ================= SIGNUP RESEND =================
router.post("/signup/resend-code", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase()

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const pending = await prisma.pendingSignup.findUnique({ where: { email } })

    if (!pending) {
      return res.status(404).json({ error: "No pending signup found" })
    }

    const otp = generateOtpCode()
    const otpHash = await hashOtpCode(otp)
    const expiresAt = getOtpExpiryDate()

    await prisma.pendingSignup.update({
      where: { email },
      data: { otpHash, expiresAt },
    })

    await sendOtpEmail(email, otp)

    return res.json({
      success: true,
      message: "Code resent",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// ================= FORGOT PASSWORD START =================
router.post("/forgot-password/start", async (req, res) => {
  try {
    const parsed = forgotPasswordStartSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ error: "No account found for this email" })
    }

    const otp = generateOtpCode()
    const resetOtpHash = await hashOtpCode(otp)
    const resetOtpExpiresAt = getOtpExpiryDate()

    await prisma.user.update({
      where: { email },
      data: {
        resetOtpHash,
        resetOtpExpiresAt,
      },
    })

    await sendOtpEmail(email, otp)

    return res.json({
      success: true,
      message: "Reset code sent",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// ================= FORGOT PASSWORD CONFIRM =================
router.post("/forgot-password/confirm", async (req, res) => {
  try {
    const parsed = forgotPasswordConfirmSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" })
    }

    const { email, code, newPassword } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(404).json({ error: "No account found for this email" })
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "No reset request found" })
    }

    if (user.resetOtpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: "Reset code expired" })
    }

    const isMatch = await compareOtpCode(code, user.resetOtpHash)

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid reset code" })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: {
        passwordHash,
        resetOtpHash: null,
        resetOtpExpiresAt: null,
      },
    })

    return res.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router