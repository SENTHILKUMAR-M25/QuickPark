import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) =>
  res.status(200).json({ success: true, status: "ok", uptime: process.uptime() })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/provider", providerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api", apiLimiter);

app.use(notFound);
app.use(errorHandler);

export default app;