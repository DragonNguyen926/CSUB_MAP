import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOtpEmail(email: string, code: string) {
  try {
    await transporter.sendMail({
      from: `"RampU" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your verification code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>CSUB Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    })
  } catch (err) {
    console.error("Email send error:", err)
    throw new Error("Failed to send email")
  }
}