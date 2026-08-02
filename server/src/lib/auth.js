import prisma from "../prisma/client.js";
import { ROLES } from "../config/constants.js";

export async function getCurrentUser(id, role) {
  if (role === ROLES.PROVIDER) {
    return prisma.provider.findUnique({ where: { id } });
  }
  return prisma.user.findUnique({ where: { id } });
}

export function hasRole(actual, allowed) {
  return allowed.includes(actual) || actual === ROLES.ADMIN;
}

/** Soft-delete filter helper for auth checks */
export const NOT_DELETED = { deletedAt: null };