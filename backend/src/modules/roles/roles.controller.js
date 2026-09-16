import { Router } from "express";
import { asyncHandler } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./roles.service.js";

const router = Router();

router.use(authenticate);

/**
 * Catálogo de permisos. Va ANTES de "/:id": si no, Express tomaría
 * "permisos" como el id de un rol.
 *
 * Pide roles.view y no un permiso propio: quien puede ver los roles necesita
 * ver de qué permisos dispone, y crear un permiso solo para el catálogo sería
 * una entrada más que administrar sin que aporte nada.
 */
router.get("/permisos", requirePermission("roles.view"), asyncHandler(async (_req, res) => {
  res.json(await service.catalogoPermisos());
}));

router.get("/", requirePermission("roles.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("roles.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(Number(req.params.id)));
}));

router.post("/", requirePermission("roles.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}));
}));

// Se le pasa el rol de quien hace la petición: varios resguardos dependen de
// si está tocando su propio rol.
router.put("/:id", requirePermission("roles.edit"), asyncHandler(async (req, res) => {
  res.json(await service.update(Number(req.params.id), req.body ?? {}, req.user));
}));

router.patch("/:id/estado", requirePermission("roles.edit"), asyncHandler(async (req, res) => {
  res.json(await service.setEstado(Number(req.params.id), req.body?.estado));
}));

router.delete("/:id", requirePermission("roles.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(Number(req.params.id), req.user));
}));

export { router as rolesRouter };
