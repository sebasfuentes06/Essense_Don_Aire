import { useState } from 'react';
import {
  ShoppingBag, Search, Plus, Eye, Edit, Trash2, Download,
  ArrowUpDown, CheckCircle, Clock, XCircle, DollarSign,
  TrendingUp, FileText, CreditCard, CalendarRange
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Card } from '../../../../shared/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../shared/components/ui/Table';
import { Badge } from '../../../../shared/components/ui/Badge';
import { Modal } from '../../../../shared/components/ui/Modal';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { DeleteDialog } from '../../../../shared/components/ui/DeleteDialog';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { ItemsPerPageSelect } from '../../../../shared/components/ui/ItemsPerPageSelect';

const mockPurchases = [
  {
    id: 1, folio: 'OC-001', date: '2024-05-15', supplierId: 1, supplierName: 'Fragancias Premium SA',
    items: [
      { productName: 'Essence Royale (x50)', quantity: 50, unitCost: 45.00 },
      { productName: 'Noir Elegance (x30)', quantity: 30, unitCost: 38.00 },
    ],
    subtotal: 3390.00, tax: 542.40, total: 3932.40, paid: 3932.40, balance: 0,
    status: 'paid',
    payments: []
  },
  {
    id: 2, folio: 'OC-002', date: '2024-05-20', supplierId: 2, supplierName: 'Perfumes Internacionales',
    items: [
      { productName: 'Golden Mist (x40)', quantity: 40, unitCost: 40.00 },
    ],
    subtotal: 1600.00, tax: 256.00, total: 1856.00, paid: 1000.00, balance: 856.00,
    status: 'partial',
    payments: []
  },
  {
    id: 3, folio: 'OC-003', date: '2024-06-01', supplierId: 3, supplierName: 'Aromas del Mundo',
    items: [
      { productName: 'Rose Oud (x25)', quantity: 25, unitCost: 52.00 },
    ],
    subtotal: 1300.00, tax: 208.00, total: 1508.00, paid: 0, balance: 1508.00,
    status: 'pending',
    payments: []
  }
];

const mockSuppliers = [
  { id: 1, name: 'Fragancias Premium SA' },
  { id: 2, name: 'Perfumes Internacionales' },
  { id: 3, name: 'Aromas del Mundo' }
];

const statusConfig = {
  pending: { label: 'Pendiente', variant: 'warning', icon: Clock },
  partial: { label: 'Parcial', variant: 'info', icon: CreditCard },
  paid: { label: 'Pagado', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelado', variant: 'danger', icon: XCircle }
};

export function Purchases() {
  const [purchases, setPurchases] = useState(mockPurchases);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

  const filtered = purchases.filter(p => {
    const matchSearch = p.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchSupplier = supplierFilter === 'all' || p.supplierName === supplierFilter;
    const matchDateFrom = !dateFrom || p.date >= dateFrom;
    const matchDateTo = !dateTo || p.date <= dateTo;
    return matchSearch && matchStatus && matchSupplier && matchDateFrom && matchDateTo;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPurchased = purchases.reduce((s, p) => s + p.total, 0);
  const totalBalance = purchases.reduce((s, p) => s + p.balance, 0);
  const pendingCount = purchases.filter(p => p.status === 'pending' || p.status === 'partial').length;

  const confirmDelete = () => {
    if (purchaseToDelete) {
      setPurchases(purchases.filter(p => p.id !== purchaseToDelete.id));
      setDeleteDialogOpen(false);
      setPurchaseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Compras</h1>
          <p className="text-muted-foreground">Gestión de pedidos y abonos a proveedores</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="h-5 w-5" />
            Exportar
          </Button>
          <Button variant="primary" size="lg">
            <Plus className="h-5 w-5" />
            Nueva Orden de Compra
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Órdenes</p>
              <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Comprado</p>
              <p className="text-2xl font-bold text-primary">${totalPurchased.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
              <p className="text-2xl font-bold text-destructive">${totalBalance.toFixed(2)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Por Liquidar</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-warning" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por folio o proveedor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'pending', label: 'Pendientes' },
            { value: 'partial', label: 'Pago parcial' },
            { value: 'paid', label: 'Pagados' }
          ]} />
          <Select value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)} options={[
            { value: 'all', label: 'Todos los proveedores' },
            ...mockSuppliers.map(s => ({ value: s.name, label: s.name }))
          ]} />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Rango:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="h-10 px-3 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <span className="text-muted-foreground">—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="h-10 px-3 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="ml-auto">
            <ItemsPerPageSelect value={itemsPerPage} onChange={setItemsPerPage} />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(purchase => {
              const sc = statusConfig[purchase.status];
              return (
                <TableRow key={purchase.id}>
                  <TableCell className="font-mono text-sm font-semibold text-primary">{purchase.folio}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-foreground">{purchase.supplierName}</TableCell>
                  <TableCell>
                    <Badge variant="default">{purchase.items.length} productos</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">${purchase.total.toFixed(2)}</TableCell>
                  <TableCell className="text-success font-semibold">${purchase.paid.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={purchase.balance > 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                      ${purchase.balance.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sc.variant}>
                      {sc.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setDetailPurchase(purchase)}
                        className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center" title="Ver detalle">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => { setPurchaseToDelete(purchase); setDeleteDialogOpen(true); }}
                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center" title="Cancelar">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages}
            totalItems={filtered.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
        )}
      </Card>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setPurchaseToDelete(null); }}
        onConfirm={confirmDelete}
        title="¿Cancelar esta orden?"
        description="La orden quedará marcada como cancelada."
        itemName={purchaseToDelete?.folio}
      />
    </div>
  );
}
