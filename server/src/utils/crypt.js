import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

/** Hash one-time codes / tokens (OTP, verify links, reset links) so we never store plaintext. */
export function hashCode(value) {
  return crypto.createHmac("sha256", env.crypto.secret).update(String(value)).digest("hex");
}

export function generateOtp(length = 6) {
  const digits = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, "0");
  return digits;
}

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

export function safeCompare(a, b) {
  const ca = String(a);
  const cb = String(b);
  if (ca.length !== cb.length) return false;
  return crypto.timingSafeEqual(Buffer.from(ca), Buffer.from(cb));
}

export default { hashPassword, verifyPassword, hashCode, generateOtp, generateToken, safeCompare };