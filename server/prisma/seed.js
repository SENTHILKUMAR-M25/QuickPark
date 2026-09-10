import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

const email = process.env.ADMIN_EMAIL?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    "Missing admin credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first."
  );
  process.exit(1);
}

const fullName = process.env.ADMIN_NAME?.trim() || "Quick Park Admin";

async function availablePhone() {
  if (process.env.ADMIN_PHONE?.trim()) {
    const phone = process.env.ADMIN_PHONE.trim();
    const exists = await prisma.auth.findUnique({ where: { phone } });
    if (!exists) return phone;
  }
  // No (usable) ADMIN_PHONE provided — generate a 10-digit placeholder
  // starting with 9, retrying on the rare chance of a collision.
  for (let i = 0; i < 5; i += 1) {
    const candidate = `9${String(Math.floor(Math.random() * 1e9)).padStart(9, "0")}`;
    const exists = await prisma.auth.findUnique({ where: { phone: candidate } });
    if (!exists) return candidate;
  }
  throw new Error("Could not allocate a unique phone number for the admin account.");
}

async function main() {
  const existing = await prisma.auth.findUnique({ where: { email } });

  if (existing) {
    if (existing.role === "ADMIN") {
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      await prisma.auth.update({
        where: { id: existing.id },
        data: { fullName, passwordHash },
      });
      console.log(`Admin account synced with .env: ${email} (${fullName})`);
    } else {
      console.warn(
        `Email ${email} is already registered as ${existing.role}. Refusing to overwrite.`
      );
    }
    return;
  }

  const phone = await availablePhone();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.auth.create({
    data: {
      fullName,
      email,
      phone,
      passwordHash,
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      accountStatus: "ACTIVE",
    },
  });

  console.log(`Admin account created: ${email} (${fullName})`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
