import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";
import { logger } from "./utils/logger.js";

async function start() {
  try {
    await prisma.$connect();
    logger.info("Database connected.");

    const server = app.listen(env.port, env.host, () => {
      logger.info(`Server running at http://${env.host}:${env.port}`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error("Failed to start server.", err);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  }
}

start();