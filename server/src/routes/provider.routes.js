import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadProviderDocs, uploadParkingImages } from "../services/file.service.js";
import * as ctrl from "../controllers/provider.controller.js";
import {
  updateProviderProfileSchema,
  bankDetailsSchema,
  createParkingSchema,
  updateParkingSchema,
  parkingStatusSchema,
  updateBookingStatusSchema,
} from "../validators/provider.validator.js";
import { ROLES } from "../config/constants.js";

const router = Router();

const multipart = (req, res, next) =>
  uploadParkingImages(req, res, (err) => (err ? next(err) : next()));

router.use(authenticate, authorize(ROLES.PROVIDER, ROLES.ADMIN));

router.get("/profile", ctrl.getProfile);
router.put("/profile", validate(updateProviderProfileSchema), ctrl.updateProfile);
router.put(
  "/documents",
  (req, res, next) => uploadProviderDocs(req, res, (err) => (err ? next(err) : next())),
  ctrl.updateDocuments
);
router.put("/bank", validate(bankDetailsSchema), ctrl.updateBank);
router.get("/dashboard", ctrl.getDashboard);
router.get("/wallet", ctrl.getWallet);

router.get("/parking", ctrl.listParking);
router.get("/parking/:id", ctrl.getParking);
router.post("/parking", multipart, validate(createParkingSchema), ctrl.createParking);
router.put("/parking/:id", multipart, validate(updateParkingSchema), ctrl.updateParking);
router.patch("/parking/:id/status", validate(parkingStatusSchema), ctrl.setParkingStatus);
router.get("/parking/:id/analytics", ctrl.getParkingAnalytics);
router.delete("/parking/:id", ctrl.deleteParking);

router.get("/bookings", ctrl.listBookings);
router.patch("/bookings/:id/status", validate(updateBookingStatusSchema), ctrl.updateBookingStatus);

export default router;
