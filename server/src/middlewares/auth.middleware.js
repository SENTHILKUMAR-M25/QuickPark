import { verifyAccessToken } from "../utils/jwt.js";
import { getCurrentUser, hasRole } from "../lib/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_STATUS, ROLES } from "../config/constants.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new ApiError(401, "Authentication required.");

    const payload = verifyAccessToken(token);
    const account = await getCurrentUser(payload.sub, payload.role);

    if (!account || account.accountStatus !== ACCOUNT_STATUS.ACTIVE) {
      throw new ApiError(401, "Account no longer exists.");
    }

    req.auth = {
      authId: account.id,
      id: account.id, // universal identity (Auth.id)
      role: account.role,
      account,
    };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(new ApiError(401, "Invalid or expired token."));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.auth) return next(new ApiError(401, "Authentication required."));
    if (!hasRole(req.auth.role, roles)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    next();
  };
}

export default authenticate;
