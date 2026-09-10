import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadSingle } from "../services/file.service.js";
import * as ctrl from "../controllers/user.controller.js";
import { updateProfileSchema, vehicleSchema, createBookingSchema } from "../validators/user.validator.js";
import { ROLES } from "../config/constants.js";

const router = Router();

router.use(authenticate, authorize(ROLES.USER, ROLES.ADMIN));

router.get("/profile", ctrl.getProfile);
router.put("/profile", validate(updateProfileSchema), ctrl.updateProfile);
router.put(
  "/profile-image",
  (req, res, next) => uploadSingle.profile(req, res, (err) => (err ? next(err) : next())),
  ctrl.updateProfileImage
);
router.delete("/account", ctrl.deleteAccount);
router.get("/dashboard", ctrl.getDashboard);
router.post("/vehicles", validate(vehicleSchema), ctrl.addVehicle);
router.get("/vehicles", ctrl.listVehicles);
router.delete("/vehicles/:id", ctrl.deleteVehicle);
router.get("/parking", ctrl.listParking);
router.get("/parking/:id", ctrl.getParking);
router.post("/parking/:id/favorite", ctrl.addFavorite);
router.delete("/parking/:id/favorite", ctrl.removeFavorite);
router.get("/favorites", ctrl.listFavorites);
router.get("/bookings", ctrl.listBookings);
router.post("/bookings", validate(createBookingSchema), ctrl.createBooking);
router.patch("/bookings/:id/cancel", ctrl.cancelBooking);
router.get("/wallet", ctrl.getWallet);

export default router;