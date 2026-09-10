import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authService } from "../services/auth.service";
import { extractErrorMessage } from "../services/api";

const AuthContext = createContext(null);

const SESSION_KEY = "qp_session";
const TOKEN_KEY = "qp_access_token";

/**
 * The current authenticated account (normalized).
 * @typedef {{ id: string, name: string, email: string, role: "USER"|"PROVIDER"|"ADMIN",
 *            profileImage?: string|null, profile?: object|null }} AuthUser
 */

function readSession() {
  try {
    const raw = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return raw && raw.user ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Normalize a raw account blob (unified backend shape or legacy) into the
 * Auth user shape. `profile` holds the role-specific 1:1 profile.
 */
function normalizeUser(rawUser, role) {
  if (!rawUser) return null;
  const u = rawUser.user || rawUser;
  const profile = u.profile && typeof u.profile === "object" ? u.profile : {};
  return {
    id: u.id,
    name:
      u.fullName ||
      profile.businessName ||
      u.businessName ||
      u.name ||
      "Quick Park Member",
    email: u.email || "",
    role: (u.role || role || "USER").toUpperCase(),
    profileImage: u.profileImage || u.avatar || u.profilePhoto || profile.profilePhoto || null,
    profile,
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = readSession();
    return saved ? normalizeUser(saved, saved.role) : null;
  });
  const [loading, setLoading] = useState(true);
  const bootstrapped = useRef(false);

  const persist = useCallback((user, token) => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
    else localStorage.removeItem(SESSION_KEY);
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
    setSession(user);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  }, []);

  /** Persist a completed auth exchange: `{ accessToken, user }`. */
  const applyAuth = useCallback(
    (authData, roleHint) => {
      const { accessToken, user } = authData || {};
      if (!user) return null;
      const normalized = normalizeUser(user, roleHint);
      persist(normalized, accessToken);
      return normalized;
    },
    [persist]
  );

  /** Core bootstrap: access token -> refresh token -> /auth/me -> logout. */
  const bootstrap = useCallback(async () => {
    const hadSession = readSession();
    const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));

    // Nothing stored at all -> guest, short-circuit.
    if (!hadSession && !hadToken) {
      // Still try /auth/me once (a valid refresh cookie may exist).
      try {
        const { data } = await authService.me();
        const user = normalizeUser(data?.data, null);
        if (user) persist(user, null);
      } catch {
        /* guest */
      }
      setLoading(false);
      return;
    }

    // A token or session exists: hard-verify against the API. The axios
    // interceptor transparently refreshes an expired access token. If that
    // also fails, it 401s and we log out.
    try {
      const { data } = await authService.me();
      persist(normalizeUser(data?.data, null), null);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403 || !localStorage.getItem(TOKEN_KEY)) {
        clear();
      }
    }
    setLoading(false);
  }, [persist, clear]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (payload, role) => {
      const { data } = await authService.login({ ...payload, role });
      const normalized = applyAuth(data.data, role);
      return { ...data.data, user: normalized };
    },
    [applyAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* best effort */
    }
    clear();
  }, [clear]);

  const value = useMemo(
    () => ({
      session,
      user: session,
      role: session?.role || null,
      isAuthenticated: Boolean(session),
      isUser: session?.role === "USER",
      isProvider: session?.role === "PROVIDER",
      isAdmin: session?.role === "ADMIN",
      loading,
      login,
      logout,
      applyAuth,
      updateUser: (user) => persist(normalizeUser(user, session?.role), undefined),
    }),
    [session, loading, login, logout, applyAuth, persist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { extractErrorMessage };
