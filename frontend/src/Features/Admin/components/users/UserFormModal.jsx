import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "../../../../shared/components/ui/Button";
import { Modal } from "../../../../shared/components/ui/Modal";
import { Input } from "../../../../shared/components/ui/Input";
import { Select } from "../../../../shared/components/ui/Select";

function UserFormModal({
	isOpen,
	onClose,
	isEditing,
	userForm,
	onUserFormChange,
	roles,
	onSave
}) {
	const [showPassword, setShowPassword] = useState(false);
	const nombre = userForm.nombre ?? userForm.name ?? "";
	const correo = userForm.correo ?? userForm.email ?? "";
	const contrasena = userForm.contrasena ?? userForm.password ?? "";
	const telefono = userForm.telefono ?? userForm.phone ?? "";
	const rolValue = String(userForm.id_rol ?? userForm.role ?? "");
	const estadoValue = userForm.estado ?? userForm.status ?? true;
	const estadoSelect = estadoValue === true || estadoValue === "true" || estadoValue === "active" ? "active" : "inactive";

	const validate = () => {
		if (!String(nombre).trim()) return "Debe indicar el nombre completo.";
		if (!String(correo).trim()) return "Debe indicar un correo electrónico.";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo).trim())) return "El correo electrónico no es válido.";
		if (!isEditing && !String(contrasena).trim()) return "La contraseña es obligatoria.";
		if (!String(rolValue).trim() || Number(rolValue) <= 0) return "Debe seleccionar un rol.";
		if (String(telefono).trim() && !/^[+()\d\s-]{7,}$/.test(String(telefono).trim())) return "El teléfono no es válido.";
		return "";
	};

	return /* @__PURE__ */jsx(Modal, {
		isOpen,
		onClose,
		title: isEditing ? "Editar Usuario" : "Nuevo Usuario",
		children: /* @__PURE__ */jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */jsx(Input, {
					label: "Nombre completo",
					value: nombre,
					onChange: e => onUserFormChange({
						...userForm,
						nombre: e.target.value,
						name: e.target.value
					}),
					placeholder: "Nombre completo"
				}),
				/* @__PURE__ */jsx(Input, {
					label: "Correo electrónico",
					value: correo,
					onChange: e => onUserFormChange({
						...userForm,
						correo: e.target.value,
						email: e.target.value
					}),
					placeholder: "correo@ejemplo.com"
				}),
				/* @__PURE__ */jsxs("div", {
					className: "relative",
					children: [
						/* @__PURE__ */jsx(Input, {
							label: isEditing ? "Nueva contraseña (opcional)" : "Contraseña",
							type: showPassword ? "text" : "password",
							required: !isEditing,
							value: contrasena,
							onChange: e => onUserFormChange({
								...userForm,
								contrasena: e.target.value,
								password: e.target.value
							}),
							placeholder: isEditing ? "Dejar vacío para conservarla" : "Contraseña segura",
							className: "pr-11"
						}),
						/* @__PURE__ */jsx("button", {
							type: "button",
							className: "absolute right-3 top-[calc(50%+0.5rem)] -translate-y-1/2 text-muted-foreground hover:text-foreground",
							onClick: () => setShowPassword((prev) => !prev),
							"aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña",
							children: showPassword ? /* @__PURE__ */jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */jsx(Eye, { className: "h-4 w-4" })
						})
					]
				}),
				/* @__PURE__ */jsx(Input, {
					label: "Teléfono",
					value: telefono,
					onChange: e => onUserFormChange({
						...userForm,
						telefono: e.target.value,
						phone: e.target.value
					}),
					placeholder: "Teléfono"
				}),
				/* @__PURE__ */jsx(Select, {
					label: "Rol",
					value: rolValue,
					onChange: e => onUserFormChange({
						...userForm,
						id_rol: Number(e.target.value),
						role: e.target.value
					}),
					options: roles.filter(r => r !== "Todos").map(role => ({
						value: String(role.id ?? role),
						label: role.name ?? role
					}))
				}),
				/* @__PURE__ */jsx(Select, {
					label: "Estado",
					value: estadoSelect,
					onChange: e => {
						const nextEstado = e.target.value === "active";
						onUserFormChange({
							...userForm,
							estado: nextEstado,
							status: e.target.value
						});
					},
					options: [{ value: "active", label: "Activo" }, { value: "inactive", label: "Inactivo" }]
				}),
				/* @__PURE__ */jsxs("div", {
					  className: "flex justify-end gap-3 border-t border-border pt-5",
					children: [
						/* @__PURE__ */jsx(Button, {
							type: "button",
							variant: "outline",
							onClick: onClose,
							children: "Cancelar"
						}),
						/* @__PURE__ */jsx(Button, {
							type: "button",
							onClick: () => {
								const error = validate();
								if (error) {
									alert(error);
									return;
								}
								onSave();
							},
							children: "Guardar"
						})
					]
				})
			]
		})
	});
}

export { UserFormModal };
