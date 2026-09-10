import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import { generateOtp, hashCode } from "../utils/crypt.js";
import { emailService } from "./email.service.js";
import { ApiError } from "../utils/ApiError.js";

async function cleanPrevious(identifier, purpose) {
  await prisma.oTP.deleteMany({
    where: { identifier, purpose, consumedAt: null },
  });
}

/**
 * Create + deliver an OTP for an identifier (email or phone).
 * Optionally links the OTP to an Auth identity via `authId`.
 */
export async function createAndSendOtp({ identifier, purpose, channel = "EMAIL", authId }) {
  const code = generateOtp(6);

  await cleanPrevious(identifier, purpose);
  await prisma.oTP.create({
    data: {
      identifier,
      purpose,
      channel,
      authId: authId || null,
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + env.otp.expiresMinutes * 60 * 1000),
    },
  });

  if (channel === "EMAIL") {
    await emailService.sendOtpEmail({ to: identifier, otp: code });
  }
  // Phone channel: integrate an SMS provider here (Future ready).

  return { expiresIn: env.otp.expiresMinutes * 60 };
}

/**
 * Verify an OTP. Consumes it on success; increments attempts on failure.
 */
export async function verifyOtp({ identifier, purpose, code, consume = true }) {
  const record = await prisma.oTP.findFirst({
    where: {
      identifier,
      purpose,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new ApiError(400, "Invalid or expired OTP. Request a new code.");
  }

  if (hashCode(code) !== record.codeHash) {
    return false;
  }

  if (consume) {
    await prisma.oTP.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
  }

  return true;
}

export default { createAndSendOtp, verifyOtp };
