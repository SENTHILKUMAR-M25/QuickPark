import { env } from "../config/env.js";
import { sendEmail } from "../config/mailer.js";
import { logger } from "../utils/logger.js";

const WELCOME_USER = (name) =>
  `<p>Hi <strong>${name}</strong>,</p><p>Welcome to Quick Park! Your account has been created. Please verify your email to start booking parking spaces.</p>`;

const WELCOME_PROVIDER = (name) =>
  `<p>Hi <strong>${name}</strong>,</p><p>Thank you for becoming a parking partner. Our team will review your documents shortly.</p>`;

const VERIFY_EMAIL = (name) =>
  `<p>Hi <strong>${name}</strong>,</p><p>Tap the button below to verify your email and activate your account.</p>`;

const OTP_BLOCK = (otp) =>
  `<div style="margin:20px 0;text-align:center;"><span style="display:inline-block;background:#eef2ff;border:1px solid #c7d2fe;color:#1d4fd8;padding:14px 32px;border-radius:12px;font-size:26px;font-weight:700;letter-spacing:6px;font-family:monospace;">${otp}</span></div>`;

function buildHtml({ title, body, ctaUrl, ctaLabel }) {
  return `
    <div style="background:#f6f7f9;padding:40px 16px;font-family:Inter,Helvetica,Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #eef0f3;">
        <div style="background:linear-gradient(135deg,#2563eb,#0b1220);padding:28px 32px;">
          <span style="color:#fff;font-size:20px;font-weight:700;">Quick<span style="color:#34d399;">Park</span></span>
        </div>
        <div style="padding:32px;color:#111827;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">${title}</h2>
          <div style="font-size:15px;line-height:1.65;color:#374151;">${body}</div>
          ${
            ctaUrl
              ? `<div style="margin:28px 0 0;text-align:center;"><a href="${ctaUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:13px 28px;border-radius:12px;font-weight:600;">${ctaLabel}</a></div>`
              : ""
          }
          <p style="font-size:12px;color:#94a3b8;margin-top:24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="background:#f6f7f9;padding:20px 32px;color:#94a3b8;font-size:12px;">
          &copy; ${new Date().getFullYear()} QuickPark &middot; Smart Parking Marketplace
        </div>
      </div>
    </div>`;
}

async function send({ to, subject, title, body, ctaUrl, ctaLabel }) {
  const text = body ? body.replace(/<[^>]+>/g, " ") : "";
  const html = buildHtml({ title, body, ctaUrl, ctaLabel });
  try {
    await sendEmail({ to, subject, html, text });
  } catch (e) {
    logger.error("Email send failed", to, e.message);
    throw e;
  }
}

const VERIFY_LINK = (token, email) =>
  `${env.clientUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

export const emailService = {
  async sendWelcomeUser({ to, name }) {
    await send({
      to,
      subject: "Welcome to QuickPark",
      title: "Welcome aboard",
      body: WELCOME_USER(name),
      ctaUrl: `${env.clientUrl}/login`,
      ctaLabel: "Sign in",
    });
  },

  async sendWelcomeProvider({ to, name }) {
    await send({
      to,
      subject: "Welcome to the QuickPark partner network",
      title: "You're a partner now",
      body: WELCOME_PROVIDER(name),
      ctaUrl: `${env.clientUrl}/provider/login`,
      ctaLabel: "Go to dashboard",
    });
  },

  async sendVerificationEmail({ to, name, token }) {
    await send({
      to,
      subject: "Verify your email",
      title: "Verify your email address",
      body: VERIFY_EMAIL(name),
      ctaUrl: VERIFY_LINK(token, to),
      ctaLabel: "Verify email",
    });
  },

  async sendPasswordResetOtp({ to, otp }) {
    await send({
      to,
      subject: "Reset your password",
      title: "Your OTP code",
      body: `<p>Use the code below to reset your password:</p>${OTP_BLOCK(otp)}`,
    });
  },

  async sendOtpEmail({ to, otp }) {
    await send({
      to,
      subject: "Your verification code",
      title: "Your One-Time Passcode",
      body: `<p>Use the code below to complete your action:</p>${OTP_BLOCK(otp)}`,
    });
  },
};

export default emailService;