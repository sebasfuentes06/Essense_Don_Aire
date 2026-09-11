import { Router } from "express";
import { asyncHandler } from "../../middleware/errors.js";
import { authenticate } from "../../middleware/auth.js";
import * as service from "./auth.service.js";

const router = Router();

router.post("/login", asyncHandler(async (req, res) => {
  res.json(await service.login(req.body ?? {}));
}));

router.post("/register", asyncHandler(async (req, res) => {
  res.status(201).json(await service.register(req.body ?? {}));
}));

/** Devuelve la sesión actual: sirve para rehidratar el frontend al recargar. */
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export { router as authRouter };
