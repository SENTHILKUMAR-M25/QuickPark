import { ROLES } from "../config/constants.js";

/**
 * Serialize an Auth record (+ its 1:1 profile) into the unified API shape:
 *   { id, role, fullName, email, phone, isEmailVerified, isPhoneVerified,
 *     profileImage, profile }
 *
 * Sensitive provider documents (governmentId, businessLicense, bankAccountNumber)
 * are NEVER included by default. Only an owner-scoped call may opt in via
 * `includeSensitive`, and the account number is masked otherwise.
 */
export function serializeAccount(auth, { includeSensitive = false } = {}) {
  const base = {
    id: auth.id,
    role: auth.role,
    fullName: auth.fullName,
    email: auth.email,
    phone: auth.phone,
    isEmailVerified: auth.isEmailVerified,
    isPhoneVerified: auth.isPhoneVerified,
    profileImage: auth.profileImage || null,
    profile: null,
  };

  if (auth.role === ROLES.PROVIDER && auth.provider) {
    const p = auth.provider;
    const profile = {
      id: p.id,
      providerType: p.providerType,
      businessName: p.businessName,
      businessRegistrationNumber: p.businessRegistrationNumber,
      gstNumber: p.gstNumber,
      verificationStatus: p.verificationStatus,
      walletBalance: p.walletBalance != null ? p.walletBalance.toString() : "0",
      rating: p.rating != null ? p.rating.toString() : null,
      totalBookings: p.totalBookings,
      totalRevenue: p.totalRevenue != null ? p.totalRevenue.toString() : "0",
      bankAccountName: p.bankAccountName,
      ifscCode: p.ifscCode,
      upiId: p.upiId,
      address: p.address,
      location: p.location,
    };

    if (includeSensitive) {
      profile.governmentId = p.governmentId;
      profile.businessLicense = p.businessLicense;
      profile.bankAccountNumber = p.bankAccountNumber;
    } else {
      if (p.bankAccountNumber) profile.bankAccountNumberMasked = `••••${p.bankAccountNumber.slice(-4)}`;
      profile.hasGovernmentId = Boolean(p.governmentId);
      profile.hasBusinessLicense = Boolean(p.businessLicense);
    }

    base.profile = profile;
  } else if (auth.role === ROLES.USER && auth.user) {
    base.profile = {
      id: auth.user.id,
      gender: auth.user.gender,
      dateOfBirth: auth.user.dateOfBirth,
      address: auth.user.address,
      emergencyContact: auth.user.emergencyContact,
      preferredLanguage: auth.user.preferredLanguage,
      notificationSettings: auth.user.notificationSettings,
    };
  } else if (auth.role === ROLES.ADMIN) {
    base.profile = { id: auth.id };
  }

  return base;
}

export default serializeAccount;
