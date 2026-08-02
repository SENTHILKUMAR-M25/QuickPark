const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const current = () => new Date().toISOString();

function serialize(value) {
  if (value instanceof Error) {
    return value.stack || `${value.name}: ${value.message}`;
  }
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value ?? "");
}

export function log(level, ...args) {
  if (LEVELS[level] < LEVELS[getLevel()]) return;
  const msg = args.map(serialize).join(" ");
  const line = `[${current()}] [${level.toUpperCase()}] ${msg}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function getLevel() {
  return (process.env.LOG_LEVEL || "info").toLowerCase();
}

export const logger = {
  debug: (...a) => log("debug", ...a),
  info: (...a) => log("info", ...a),
  warn: (...a) => log("warn", ...a),
  error: (...a) => log("error", ...a),
};

export default logger;