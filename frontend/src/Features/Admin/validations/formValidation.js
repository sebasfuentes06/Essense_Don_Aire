const isBlank = (value) => String(value ?? "").trim() === "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{7,}$/;

const validateCategoryForm = ({ nombre, descripcion }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre de la categoría es obligatorio.";
  }

  if (!isBlank(descripcion) && descripcion.trim().length > 255) {
    errors.descripcion = "La descripción no puede exceder 255 caracteres.";
  }

  return errors;
};

const validateRoleForm = ({ nombre, permisos }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre del rol es obligatorio.";
  }

  if (!Array.isArray(permisos) || permisos.length === 0) {
    errors.permisos = "Debe seleccionar al menos un permiso.";
  }

  return errors;
};

const validateUserForm = ({ nombre, correo, contrasena, telefono, id_rol, isEditing }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre completo es obligatorio.";
  }

  if (isBlank(correo)) {
    errors.correo = "El correo electrónico es obligatorio.";
  } else if (!emailPattern.test(String(correo).trim())) {
    errors.correo = "El correo electrónico no tiene un formato válido.";
  }

  if (!isEditing && isBlank(contrasena)) {
    errors.contrasena = "La contraseña es obligatoria.";
  } else if (!isBlank(contrasena) && contrasena.trim().length < 8) {
    errors.contrasena = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!isBlank(telefono) && !phonePattern.test(String(telefono).trim())) {
    errors.telefono = "El teléfono solo puede incluir números, espacios y signos básicos.";
  }

  if (isBlank(id_rol) || Number(id_rol) <= 0) {
    errors.id_rol = "Debe seleccionar un rol.";
  }

  return errors;
};

const validateCustomerForm = ({ nombre, correo, contrasena, telefono, ciudad, isEditing }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre completo es obligatorio.";
  }

  if (isBlank(correo)) {
    errors.correo = "El correo electrónico es obligatorio.";
  } else if (!emailPattern.test(String(correo).trim())) {
    errors.correo = "El correo electrónico no tiene un formato válido.";
  }

  if (!isEditing && isBlank(contrasena)) {
    errors.contrasena = "La contraseña es obligatoria.";
  } else if (!isBlank(contrasena) && contrasena.trim().length < 8) {
    errors.contrasena = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (!isBlank(telefono) && !phonePattern.test(String(telefono).trim())) {
    errors.telefono = "El teléfono no tiene un formato válido.";
  }

  if (isBlank(ciudad)) {
    errors.ciudad = "La ciudad es obligatoria.";
  }

  return errors;
};

const validateSupplierForm = ({ nombre, contacto, email, telefono, ciudad }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre del proveedor es obligatorio.";
  }

  if (isBlank(contacto)) {
    errors.contacto = "El contacto es obligatorio.";
  }

  if (isBlank(ciudad)) {
    errors.ciudad = "La ciudad es obligatoria.";
  }

  if (!isBlank(email) && !emailPattern.test(String(email).trim())) {
    errors.email = "El correo electrónico no tiene un formato válido.";
  }

  if (!isBlank(telefono) && !phonePattern.test(String(telefono).trim())) {
    errors.telefono = "El teléfono no tiene un formato válido.";
  }

  return errors;
};

const validateProductForm = ({ nombre, sku, categoriaValue, proveedorValue, precio, stock, stockMinimo }) => {
  const errors = {};

  if (isBlank(nombre)) {
    errors.nombre = "El nombre del producto es obligatorio.";
  }

  if (isBlank(sku)) {
    errors.sku = "El SKU es obligatorio.";
  }

  if (isBlank(categoriaValue) || Number(categoriaValue) <= 0) {
    errors.id_categoria = "Debe seleccionar una categoría.";
  }

  if (isBlank(proveedorValue) || Number(proveedorValue) <= 0) {
    errors.id_proveedor = "Debe seleccionar un proveedor.";
  }

  if (Number(precio) <= 0) {
    errors.precio = "El precio debe ser mayor a cero.";
  }

  if (Number(stock) < 0) {
    errors.stock = "El stock no puede ser negativo.";
  }

  if (Number(stockMinimo) < 0) {
    errors.stock_minimo = "El stock mínimo no puede ser negativo.";
  }

  if (Number(stockMinimo) > Number(stock) && Number(stock) >= 0 && Number(stockMinimo) >= 0) {
    errors.stock_minimo = "El stock mínimo no puede ser mayor que el stock actual.";
  }

  return errors;
};

const validatePurchaseForm = ({ folio, idProveedor, fechaCompra, estado, items, subtotal, impuesto, total }) => {
  const errors = {};

  if (isBlank(folio)) {
    errors.folio = "El folio es obligatorio.";
  }

  if (isBlank(idProveedor) || Number(idProveedor) <= 0) {
    errors.id_proveedor = "Debe seleccionar un proveedor.";
  }

  if (isBlank(fechaCompra)) {
    errors.fecha_compra = "La fecha de compra es obligatoria.";
  }

  if (isBlank(estado)) {
    errors.estado = "Debe seleccionar un estado.";
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Debe agregar al menos un producto.";
  }

  if (Number(subtotal) < 0) {
    errors.subtotal = "El subtotal no puede ser negativo.";
  }

  if (Number(impuesto) < 0) {
    errors.impuesto = "El impuesto no puede ser negativo.";
  }

  if (!Number(total) || Number(total) <= 0) {
    errors.total = "El total debe ser mayor a cero.";
  }

  return errors;
};

const validateSaleForm = ({ cliente, vendedor, fechaVenta, metodoPago, total }) => {
  const errors = {};

  if (isBlank(cliente) || Number(cliente) <= 0) {
    errors.cliente = "Debe indicar un cliente válido.";
  }

  if (isBlank(vendedor) || Number(vendedor) <= 0) {
    errors.vendedor = "Debe seleccionar un vendedor válido.";
  }

  if (isBlank(fechaVenta)) {
    errors.fecha_venta = "La fecha de la venta es obligatoria.";
  }

  if (isBlank(metodoPago) || Number(metodoPago) <= 0) {
    errors.metodoPago = "Debe seleccionar un método de pago.";
  }

  if (!Number(total) || Number(total) <= 0) {
    errors.total = "El total debe ser mayor a cero.";
  }

  return errors;
};

export {
  validateCategoryForm,
  validateRoleForm,
  validateUserForm,
  validateCustomerForm,
  validateSupplierForm,
  validateProductForm,
  validatePurchaseForm,
  validateSaleForm,
  phonePattern,
  emailPattern,
  isBlank
};
