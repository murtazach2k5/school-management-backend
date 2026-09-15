import { Router } from "express";
import { signup, login, getMe } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getMe);

// Test route — only ADMIN and SUPER_ADMIN can access
router.get("/admin-only", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getMe);

export default router;