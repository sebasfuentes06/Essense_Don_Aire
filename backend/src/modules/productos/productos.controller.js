import { Router } from "express";
import { asyncHandler } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./productos.service.js";

const router = Router();

router.use(authenticate);

// Va ANTES de "/:id": si no, Express tomaría "opciones" como un id.
router.get("/opciones", requirePermission("products.view"), asyncHandler(async (_req, res) => {
  res.json(await service.opciones());
}));

router.get("/", requirePermission("products.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("products.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(Number(req.params.id)));
}));

router.post("/", requirePermission("products.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}));
}));

router.put("/:id", requirePermission("products.edit"), asyncHandler(async (req, res) => {
  res.json(await service.update(Number(req.params.id), req.body ?? {}));
}));

router.patch("/:id/estado", requirePermission("products.edit"), asyncHandler(async (req, res) => {
  res.json(await service.setEstado(Number(req.params.id), req.body?.estado));
}));

router.patch("/:id/stock", requirePermission("products.edit"), asyncHandler(async (req, res) => {
  res.json(await service.ajustarStock(Number(req.params.id), req.body?.cantidad));
}));

router.delete("/:id", requirePermission("products.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(Number(req.params.id)));
}));

export { router as productosRouter };
