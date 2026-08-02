import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

const SAFE_SELECT = {
  id: true, fullName: true, email: true, phone: true, avatar: true,
  gender: true, dob: true, addressLine: true, city: true, state: true,
  country: true, postalCode: true, isEmailVerified: true, isPhoneVerified: true,
  createdAt: true, updatedAt: true,
};

export async function getProfile(userId) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      ...SAFE_SELECT,
      vehicles: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) throw new ApiError(404, "User not found.");
  return user;
}

const EDITABLE_FIELDS = ["fullName", "gender", "addressLine", "city", "state", "country", "postalCode", "dob"];

export async function updateProfile(userId, data) {
  const clean = {};
  for (const key of EDITABLE_FIELDS) {
    if (data[key] !== undefined) clean[key] = data[key];
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: clean,
    select: SAFE_SELECT,
  });
  return user;
}

export async function updateProfileImage(userId, secureUrl) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatar: secureUrl },
    select: SAFE_SELECT,
  });
}

export async function addVehicle(userId, { regNumber, make, model, color, type }) {
  await prisma.vehicle.create({ data: { userId, regNumber, make, model, color, type } });
  return listVehicles(userId);
}

export async function listVehicles(userId) {
  return prisma.vehicle.findMany({
    where: { userId, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function deleteAccount(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });
  return true;
}

export const userService = {
  getProfile, updateProfile, updateProfileImage, addVehicle, listVehicles, deleteAccount,
};

export default userService;