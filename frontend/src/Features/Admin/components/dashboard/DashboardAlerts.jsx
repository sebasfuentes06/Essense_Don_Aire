import { useNavigate } from "react-router";
import { ArrowRight, ClipboardList, Clock, PackageX, UserPlus } from "lucide-react";
import { Card } from "../../../../shared/components/ui/Card";
import { dinero } from "../../../../shared/negocio";

/** Avisos de lo que hay que atender, con acceso directo al módulo. */
function DashboardAlerts({ pendingOrders, pendingPayments, pendingPaymentsValue, pendingSignups, lowStockCount }) {
  const navigate = useNavigate();
  const avisos = [
    pendingPayments > 0 && {
      icon: Clock,
      title: `${pendingPayments} pago(s) por aprobar`,
      text: `${dinero(pendingPaymentsValue)} reportados por clientes`,
      to: "/panel/pagos"
    },
    pendingOrders > 0 && {
      icon: ClipboardList,
      title: `${pendingOrders} pedido(s) pendiente(s)`,
      text: "Conviértelos en venta o cancélalos",
      to: "/panel/pedidos"
    },
    pendingSignups > 0 && {
      icon: UserPlus,
      title: `${pendingSignups} solicitud(es) de registro`,
      text: "Clientes esperando que apruebes su cuenta",
      to: "/panel/usuarios"
    },
    lowStockCount > 0 && {
      icon: PackageX,
      title: `${lowStockCount} producto(s) con stock bajo`,
      text: "Revisa el inventario",
      to: "/panel/productos"
    }
  ].filter(Boolean);

  if (avisos.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {avisos.map(({ icon: Icon, title, text, to }) => (
        <Card key={title} hover className="cursor-pointer p-4" onClick={() => navigate(to)}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export { DashboardAlerts };
