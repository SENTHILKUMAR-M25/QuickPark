import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: env.mail.secure,
  auth: env.mail.user ? { user: env.mail.user, pass: env.mail.pass } : undefined,
});

export async function sendEmail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: env.mail.from,
    to,
    subject,
    html,
    text,
  });
  return info;
}

export default transporter;