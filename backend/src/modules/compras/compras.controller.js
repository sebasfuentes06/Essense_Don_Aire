import { Router } from "express";
import { asyncHandler, HttpError } from "../../middleware/errors.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import * as service from "./compras.service.js";

const router = Router();

router.use(authenticate);

/** El id de la URL, ya validado, para que un /compras/abc no termine en 500. */
function idDeLaRuta(req, parametro = "id", que = "compra") {
  const id = Number(req.params[parametro]);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, `"${req.params[parametro]}" no es un id de ${que} válido.`);
  }
  return id;
}

/*
 * Cómo se reparten los cuatro permisos del módulo:
 *
 *   purchases.view    leer
 *   purchases.create  registrar una compra y registrar un abono (ambos AGREGAN)
 *   purchases.edit    cancelar y anular un abono (ambos DESHACEN)
 *   purchases.delete  borrar del todo una compra ya cancelada
 *
 * No hay PUT: una compra registrada no se edita. Ya movió stock y es el
 * soporte de lo que se le debe al proveedor; si quedó mal se cancela y se
 * hace otra. Por eso purchases.edit quedó para las acciones que deshacen.
 */

// Las rutas de texto van ANTES de "/:id": si no, Express leería "opciones"
// como el id de una compra.
router.get("/opciones", requirePermission("purchases.view"), asyncHandler(async (_req, res) => {
  res.json(await service.opciones());
}));

router.get(
  "/proveedores/:idProveedor/productos",
  requirePermission("purchases.view"),
  asyncHandler(async (req, res) => {
    res.json(await service.productosDeProveedor(idDeLaRuta(req, "idProveedor", "proveedor")));
  })
);

router.get("/", requirePermission("purchases.view"), asyncHandler(async (req, res) => {
  res.json(await service.list(req.query));
}));

router.get("/:id", requirePermission("purchases.view"), asyncHandler(async (req, res) => {
  res.json(await service.getById(idDeLaRuta(req)));
}));

// Se le pasa quién hace la petición: `compras.id_usuario` guarda quién
// registró la entrada de mercancía, y eso no puede venir del formulario.
router.post("/", requirePermission("purchases.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.create(req.body ?? {}, req.user.id));
}));

router.post("/:id/pagos", requirePermission("purchases.create"), asyncHandler(async (req, res) => {
  res.status(201).json(await service.registrarPago(idDeLaRuta(req), req.body ?? {}));
}));

router.delete("/:id/pagos/:idPago", requirePermission("purchases.edit"), asyncHandler(async (req, res) => {
  res.json(await service.anularPago(idDeLaRuta(req), idDeLaRuta(req, "idPago", "abono")));
}));

router.patch("/:id/cancelar", requirePermission("purchases.edit"), asyncHandler(async (req, res) => {
  res.json(await service.cancelar(idDeLaRuta(req)));
}));

router.delete("/:id", requirePermission("purchases.delete"), asyncHandler(async (req, res) => {
  res.json(await service.remove(idDeLaRuta(req)));
}));

export { router as comprasRouter };
