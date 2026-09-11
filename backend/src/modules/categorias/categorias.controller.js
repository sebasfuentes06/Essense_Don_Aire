import { Router } from "express";
import { asyncHandler } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./categorias.service.js";

const router = Router();

// Todo el módulo exige sesión iniciada.
router.use(authenticate);

router.get("/", requirePermission("categories.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("categories.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(Number(req.params.id)));
}));

router.post("/", requirePermission("categories.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}));
}));

router.put("/:id", requirePermission("categories.edit"), asyncHandler(async (req, res) => {
  res.json(await service.update(Number(req.params.id), req.body ?? {}));
}));

router.patch("/:id/estado", requirePermission("categories.edit"), asyncHandler(async (req, res) => {
  res.json(await service.setEstado(Number(req.params.id), req.body?.estado));
}));

router.delete("/:id", requirePermission("categories.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(Number(req.params.id)));
}));

export { router as categoriasRouter };
