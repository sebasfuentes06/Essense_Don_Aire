import { PurchasesHeader, purchaseColumns } from "./PurchasesHeader";
import { PurchasesStats } from "./PurchasesStats";
import { PurchasesFiltersBar } from "./PurchasesFiltersBar";
import { PurchasesTable } from "./PurchasesTable";
import { PurchaseDetailModal } from "./PurchaseDetailModal";
import { PurchaseFormModal } from "./PurchaseFormModal";
import { PurchasePaymentModal } from "./PurchasePaymentModal";

/**
 * PurchaseDeleteDialog ya no se exporta: envolvía al DeleteDialog compartido
 * sin agregarle nada, y ahora la página necesita dos diálogos distintos
 * —cancelar y eliminar— con textos propios, así que los arma directamente.
 */
export {
  PurchaseDetailModal,
  PurchaseFormModal,
  PurchasePaymentModal,
  PurchasesFiltersBar,
  PurchasesHeader,
  PurchasesStats,
  PurchasesTable,
  purchaseColumns
};
