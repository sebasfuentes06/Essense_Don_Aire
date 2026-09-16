import { Router } from "express";
import { asyncHandler } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./usuarios.service.js";

const router = Router();

router.use(authenticate);

// Antes de "/:id", si no Express leería "roles" como un id.
router.get("/roles", requirePermission("users.view"), asyncHandler(async (_req, res) => {
  res.json(await service.listaRoles());
}));

router.get("/", requirePermission("users.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("users.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(Number(req.params.id)));
}));

router.post("/", requirePermission("users.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}));
}));

router.put("/:id", requirePermission("users.edit"), asyncHandler(async (req, res) => {
  res.json(await service.update(Number(req.params.id), req.body ?? {}, req.user.id));
}));

router.patch("/:id/estado", requirePermission("users.edit"), asyncHandler(async (req, res) => {
  res.json(await service.setEstado(Number(req.params.id), req.body?.estado, req.user.id));
}));

router.patch("/:id/password", requirePermission("users.edit"), asyncHandler(async (req, res) => {
  res.json(await service.resetPassword(Number(req.params.id), req.body?.contrasena));
}));

router.delete("/:id", requirePermission("users.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(Number(req.params.id), req.user.id));
}));

export { router as usuariosRouter };
