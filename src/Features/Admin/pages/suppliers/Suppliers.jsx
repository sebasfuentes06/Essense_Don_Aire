import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Star, MapPin, Phone, Mail, Eye, Package, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Card } from '../../../../shared/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../shared/components/ui/Table';
import { Badge } from '../../../../shared/components/ui/Badge';
import { Modal } from '../../../../shared/components/ui/Modal';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { DeleteDialog } from '../../../../shared/components/ui/DeleteDialog';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { SortSelect } from '../../../../shared/components/ui/SortSelect';
import { ItemsPerPageSelect } from '../../../../shared/components/ui/ItemsPerPageSelect';
import { cn } from '../../../../shared/utils/cn';

const mockSuppliers = [
  {
    id: 1,
    name: 'Fragancias Premium SA',
    contact: 'Juan García',
    email: 'juan@fragpremium.com',
    phone: '+34 91 234 5678',
    city: 'Madrid',
    products: ['Essence Royale', 'Golden Mist', 'Ocean Breeze'],
    rating: 4.8,
    reviews: 42,
    status: 'active',
    since: '2022-01-15',
    totalOrders: 45,
    totalSpent: 45000
  },
  {
    id: 2,
    name: 'Perfumes Internacionales',
    contact: 'María López',
    email: 'maria@perfintl.com',
    phone: '+34 93 456 7890',
    city: 'Barcelona',
    products: ['Noir Elegance', 'Velvet Rose'],
    rating: 4.5,
    reviews: 28,
    status: 'active',
    since: '2022-06-20',
    totalOrders: 32,
    totalSpent: 32000
  },
  {
    id: 3,
    name: 'Aromas del Mundo',
    contact: 'Carlos Rodríguez',
    email: 'carlos@aromasmundo.es',
    phone: '+34 95 678 9012',
    city: 'Sevilla',
    products: ['Rose Oud', 'Lavender Dreams', 'Citrus Splash'],
    rating: 4.3,
    reviews: 18,
    status: 'active',
    since: '2023-03-10',
    totalOrders: 22,
    totalSpent: 18500
  }
];

const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'totalSpent', label: 'Total Gastado' },
  { value: 'totalOrders', label: 'Número Órdenes' },
  { value: 'rating', label: 'Calificación' }
];

export function Suppliers() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', email: '', phone: '', city: '', status: 'active' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [detailSupplier, setDetailSupplier] = useState(null);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = sortedSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (supplierToDelete) {
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      city: supplier.city,
      status: supplier.status
    });
    setIsModalOpen(true);
  };

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      city: supplier.city,
      status: supplier.status
    });
    setIsModalOpen(true);
  };

  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setSupplierForm({ name: '', contact: '', email: '', phone: '', city: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleSaveSupplier = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map((supplier) =>
        supplier.id === selectedSupplier.id
          ? { ...supplier, ...supplierForm }
          : supplier
      ));
    } else {
      const nextId = Math.max(0, ...suppliers.map((supplier) => supplier.id)) + 1;
      setSuppliers([...suppliers, {
        id: nextId,
        products: [],
        totalOrders: 0,
        totalSpent: 0,
        rating: 0,
        reviews: 0,
        since: new Date().toISOString().slice(0, 10),
        ...supplierForm
      }]);
    }
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalProducts = suppliers.reduce((sum, s) => sum + s.products.length, 0);
  const avgRating = (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Proveedores</h1>
          <p className="text-muted-foreground">
            Directorio de proveedores y gestión de relaciones
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Package className="h-5 w-5" />
            Importar
          </Button>
          <Button variant="primary" size="lg" onClick={handleNewSupplier}>
            <Plus className="h-5 w-5" />
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Proveedores</p>
              <p className="text-2xl font-bold text-foreground">{totalSuppliers}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Proveedores Activos</p>
              <p className="text-2xl font-bold text-success">{activeSuppliers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Productos Únicos</p>
              <p className="text-2xl font-bold text-primary">{totalProducts}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Calificación Promedio</p>
              <p className="text-2xl font-bold text-foreground">{avgRating} ⭐</p>
            </div>
            <Star className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar proveedor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={cn(
                  'w-full h-11 pl-11 pr-4 rounded-xl bg-background border border-input',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary'
                )}
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SortSelect
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                direction={sortDirection}
                onDirectionChange={setSortDirection}
              />
            </div>
            <ItemsPerPageSelect value={itemsPerPage} onChange={setItemsPerPage} />
          </div>
        </div>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Órdenes</TableHead>
              <TableHead>Gastado</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {supplier.city}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-foreground">{supplier.contact}</TableCell>
                <TableCell className="text-sm text-primary">{supplier.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{supplier.phone}</TableCell>
                <TableCell>
                  <Badge variant="info">
                    {supplier.products.length} productos
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-foreground">{supplier.totalOrders}</TableCell>
                <TableCell className="text-primary font-semibold">
                  ${(supplier.totalSpent / 1000).toFixed(1)}k
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-foreground">{supplier.rating}</span>
                    <span className="text-xs text-muted-foreground">({supplier.reviews})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(supplier)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier)}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedSuppliers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSupplier(null);
        }}
        title={selectedSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={supplierForm.name}
            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
            placeholder="Nombre del proveedor"
          />
          <Input
            label="Contacto"
            value={supplierForm.contact}
            onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
            placeholder="Nombre del contacto"
          />
          <Input
            label="Email"
            type="email"
            value={supplierForm.email}
            onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
            placeholder="contacto@proveedor.com"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Teléfono"
              value={supplierForm.phone}
              onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              placeholder="Teléfono"
            />
            <Input
              label="Ciudad"
              value={supplierForm.city}
              onChange={(e) => setSupplierForm({ ...supplierForm, city: e.target.value })}
              placeholder="Ciudad"
            />
          </div>
          <Select
            label="Estado"
            value={supplierForm.status}
            onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value })}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setSelectedSupplier(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveSupplier}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSupplierToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar este proveedor?"
        description="El proveedor será eliminado de la lista y no podrá crear órdenes de compra."
        itemName={supplierToDelete?.name}
      />
    </div>
  );
}
