import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import * as ctrl from "../controllers/admin.controller.js";
import { ROLES } from "../config/constants.js";

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get("/overview", ctrl.getOverview);
router.get("/users", ctrl.listUsers);
router.get("/providers", ctrl.listProviders);
router.get("/parking-spaces", ctrl.listParkingSpaces);
router.get("/bookings", ctrl.listBookings);
router.patch("/users/:id/status", ctrl.updateAccountStatus);
router.patch("/providers/:id/verification", ctrl.updateProviderVerification);

export default router;
