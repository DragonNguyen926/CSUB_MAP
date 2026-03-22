import bcrypt from "bcrypt"

const OTP_LENGTH = 6
const OTP_EXPIRES_MINUTES = 10
const BCRYPT_ROUNDS = 10

// Tạo mã 6 số
export function generateOtpCode(): string {
  const min = 10 ** (OTP_LENGTH - 1)
  const max = 10 ** OTP_LENGTH - 1
  return String(Math.floor(Math.random() * (max - min + 1)) + min)
}

// Hash OTP trước khi lưu DB
export async function hashOtpCode(code: string): Promise<string> {
  return bcrypt.hash(code, BCRYPT_ROUNDS)
}

// So sánh OTP user nhập với DB
export async function compareOtpCode(
  plainCode: string,
  hashedCode: string
): Promise<boolean> {
  return bcrypt.compare(plainCode, hashedCode)
}

// Thời gian hết hạn (10 phút)
export function getOtpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000)
}