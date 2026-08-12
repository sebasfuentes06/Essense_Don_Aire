import { useState } from 'react';
import {
  ShoppingCart, Search, Download, Eye, XCircle,
  CalendarRange, CreditCard, TrendingUp, DollarSign,
  FileText, ArrowUpDown, Percent, Package
} from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Card } from '../../../../shared/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../shared/components/ui/Table';
import { Badge } from '../../../../shared/components/ui/Badge';
import { Modal } from '../../../../shared/components/ui/Modal';
import { Select } from '../../../../shared/components/ui/Select';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { ItemsPerPageSelect } from '../../../../shared/components/ui/ItemsPerPageSelect';
import { DeleteDialog } from '../../../../shared/components/ui/DeleteDialog';

const mockSales = [
  {
    id: 1, folio: 'VTA-001', date: '2024-06-01', customer: 'Ana Martínez',
    seller: 'Carlos Vendedor', items: [
      { productId: 1, productName: 'Essence Royale', quantity: 2, unitPrice: 89.99, discount: 0 }
    ],
    subtotal: 179.98, discount: 0, total: 179.98, paymentMethod: 'card', status: 'completed'
  },
  {
    id: 2, folio: 'VTA-002', date: '2024-06-01', customer: 'Carlos Rodríguez',
    seller: 'María Vendedora', items: [
      { productId: 3, productName: 'Golden Mist', quantity: 1, unitPrice: 79.99, discount: 0 }
    ],
    subtotal: 79.99, discount: 0, total: 79.99, paymentMethod: 'cash', status: 'completed'
  },
  {
    id: 3, folio: 'VTA-003', date: '2024-05-31', customer: 'María González',
    seller: 'Carlos Vendedor', items: [
      { productId: 1, productName: 'Essence Royale', quantity: 3, unitPrice: 89.99, discount: 15 }
    ],
    subtotal: 269.97, discount: 40.50, total: 229.47, paymentMethod: 'transfer', status: 'completed'
  },
  {
    id: 4, folio: 'VTA-004', date: '2024-05-30', customer: 'Luis Hernández',
    seller: 'María Vendedora', items: [
      { productId: 2, productName: 'Noir Elegance', quantity: 2, unitPrice: 74.99, discount: 0 }
    ],
    subtotal: 149.98, discount: 0, total: 149.98, paymentMethod: 'mixed', status: 'cancelled'
  }
];

const mockSellers = ['Carlos Vendedor', 'María Vendedora', 'Admin Principal'];

const paymentMethodLabels = {
  cash: { label: 'Efectivo', variant: 'success' },
  card: { label: 'Tarjeta', variant: 'info' },
  transfer: { label: 'Transferencia', variant: 'default' },
  mixed: { label: 'Mixto', variant: 'warning' }
};

const statusLabels = {
  completed: { label: 'Completada', variant: 'success' },
  cancelled: { label: 'Cancelada', variant: 'danger' },
  pending: { label: 'Pendiente', variant: 'warning' }
};

export function Sales() {
  const [sales, setSales] = useState(mockSales);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [detailSale, setDetailSale] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [saleToCancel, setSaleToCancel] = useState(null);

  const filtered = sales.filter(s => {
    const matchSearch = s.folio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchSeller = sellerFilter === 'all' || s.seller === sellerFilter;
    return matchSearch && matchStatus && matchSeller;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0);
  const avgTicket = sales.filter(s => s.status === 'completed').length > 0
    ? totalRevenue / sales.filter(s => s.status === 'completed').length : 0;

  const handleCancel = (sale) => {
    setSaleToCancel(sale);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (saleToCancel) {
      setSales(sales.map(s => s.id === saleToCancel.id ? { ...s, status: 'cancelled' } : s));
      setCancelDialogOpen(false);
      setSaleToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Ventas</h1>
          <p className="text-muted-foreground">Historial completo de ventas y gestión</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="h-5 w-5" />
            Exportar Excel
          </Button>
          <Button variant="primary" size="lg">
            <ShoppingCart className="h-5 w-5" />
            Nueva Venta (POS)
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Completadas</p>
              <p className="text-2xl font-bold text-foreground">{sales.filter(s => s.status === 'completed').length}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <p className="text-2xl font-bold text-success">{sales.filter(s => s.date === '2024-06-01').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Promedio</p>
              <p className="text-2xl font-bold text-foreground">${avgTicket.toFixed(2)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-muted-foreground" />
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
              placeholder="Buscar por folio, cliente..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} options={[
            { value: 'all', label: 'Todos los estados' },
            { value: 'completed', label: 'Completadas' },
            { value: 'cancelled', label: 'Canceladas' }
          ]} />
          <Select value={sellerFilter} onChange={e => { setSellerFilter(e.target.value); setCurrentPage(1); }} options={[
            { value: 'all', label: 'Todos los vendedores' },
            ...mockSellers.map(s => ({ value: s, label: s }))
          ]} />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
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
              <TableHead>Cliente</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map(sale => {
              const pm = paymentMethodLabels[sale.paymentMethod];
              const st = statusLabels[sale.status];
              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-sm font-semibold text-primary">{sale.folio}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{sale.customer[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{sale.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{sale.seller}</TableCell>
                  <TableCell>
                    <Badge variant="default">{sale.items.reduce((s, i) => s + i.quantity, 0)} items</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">${sale.total.toFixed(2)}</TableCell>
                  <TableCell><Badge variant={pm.variant}>{pm.label}</Badge></TableCell>
                  <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setDetailSale(sale)}
                        className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center" title="Ver detalle">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {sale.status === 'completed' && (
                        <button onClick={() => handleCancel(sale)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center" title="Anular venta">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </button>
                      )}
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

      <DeleteDialog
        isOpen={cancelDialogOpen}
        onClose={() => { setCancelDialogOpen(false); setSaleToCancel(null); }}
        onConfirm={confirmCancel}
        title="¿Anular esta venta?"
        description="La venta quedará marcada como cancelada."
        itemName={saleToCancel?.folio}
      />
    </div>
  );
}
