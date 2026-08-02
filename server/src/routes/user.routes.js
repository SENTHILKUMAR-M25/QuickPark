import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadSingle } from "../services/file.service.js";
import * as ctrl from "../controllers/user.controller.js";
import { updateProfileSchema, vehicleSchema } from "../validators/user.validator.js";
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
router.post("/vehicles", validate(vehicleSchema), ctrl.addVehicle);

export default router;