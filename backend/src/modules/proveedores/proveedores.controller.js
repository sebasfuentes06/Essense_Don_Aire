import { Router } from "express";
import { asyncHandler, HttpError } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./proveedores.service.js";

const router = Router();

// Todo el módulo exige sesión iniciada.
router.use(authenticate);

/**
 * El id de la URL, ya convertido a número.
 *
 * Sin esto, un /api/proveedores/abc le mandaba la palabra "abc" a PostgreSQL
 * como si fuera un entero y el error salía convertido en un 500: un problema
 * del servidor, cuando en realidad la petición venía mal. Se revisa antes de
 * tocar la base.
 */
function idDeLaRuta(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, `"${req.params.id}" no es un id de proveedor válido.`);
  }
  return id;
}

/**
 * Ciudades en uso. Va ANTES de "/:id": si no, Express leería "ciudades"
 * como el id de un proveedor y respondería un 404 confuso.
 */
router.get("/ciudades", requirePermission("suppliers.view"), asyncHandler(async (_req, res) => {
  res.json(await service.ciudades());
}));

router.get("/", requirePermission("suppliers.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("suppliers.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(idDeLaRuta(req)));
}));

router.post("/", requirePermission("suppliers.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}));
}));

router.put("/:id", requirePermission("suppliers.edit"), asyncHandler(async (req, res) => {
  res.json(await service.update(idDeLaRuta(req), req.body ?? {}));
}));

/**
 * El interruptor de la tabla tiene su propio permiso, `suppliers.toggle`.
 * Así se le puede dar a un supervisor la potestad de sacar de circulación a
 * un proveedor problemático sin darle también la de editarle los datos.
 */
router.patch("/:id/estado", requirePermission("suppliers.toggle"), asyncHandler(async (req, res) => {
  res.json(await service.setEstado(idDeLaRuta(req), req.body?.estado));
}));

router.delete("/:id", requirePermission("suppliers.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(idDeLaRuta(req)));
}));

export { router as proveedoresRouter };
