import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, MapPin, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
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

const mockCustomers = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+1 234 567 8901',
    address: 'Calle Principal 123',
    city: 'Ciudad de México',
    totalPurchases: 12,
    totalSpent: 1250.50,
    status: 'active',
    joinDate: '2024-01-15',
    lastPurchase: '2024-06-01'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    email: 'carlos.r@email.com',
    phone: '+1 234 567 8902',
    address: 'Av. Reforma 456',
    city: 'Guadalajara',
    totalPurchases: 8,
    totalSpent: 890.00,
    status: 'active',
    joinDate: '2024-02-10',
    lastPurchase: '2024-05-28'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+1 234 567 8903',
    address: 'Colonia Centro 789',
    city: 'Monterrey',
    totalPurchases: 25,
    totalSpent: 2340.75,
    status: 'active',
    joinDate: '2023-11-05',
    lastPurchase: '2024-06-02'
  },
  {
    id: 4,
    name: 'Luis Hernández',
    email: 'luis.h@email.com',
    phone: '+1 234 567 8904',
    address: 'Boulevard 321',
    city: 'Puebla',
    totalPurchases: 3,
    totalSpent: 340.25,
    status: 'inactive',
    joinDate: '2024-03-20',
    lastPurchase: '2024-04-15'
  }
];

const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'totalSpent', label: 'Total Gastado' },
  { value: 'totalPurchases', label: 'Compras' },
  { value: 'joinDate', label: 'Fecha Registro' }
];

export function Customers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('edit');
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', city: '', status: 'active' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(c => c.id !== customerToDelete.id));
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status
    });
    setViewMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      status: customer.status
    });
    setViewMode('details');
    setIsModalOpen(true);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setCustomerForm({ name: '', email: '', phone: '', city: '', status: 'active' });
    setViewMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, ...customerForm }
          : customer
      ));
    } else {
      const nextId = Math.max(0, ...customers.map((customer) => customer.id)) + 1;
      setCustomers([...customers, { id: nextId, totalPurchases: 0, totalSpent: 0, joinDate: new Date().toISOString().slice(0, 10), lastPurchase: '', ...customerForm }]);
    }
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleToggleStatus = (customer) => {
    setCustomers(customers.map(c => c.id === customer.id
      ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
      : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de clientes
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Users className="h-5 w-5" />
            Exportar
          </Button>
          <Button variant="primary" size="lg" onClick={() => {
            setSelectedCustomer(null);
            setViewMode('edit');
            setIsModalOpen(true);
          }}>
            <Plus className="h-5 w-5" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="text-2xl font-bold text-foreground">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-success">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
              <span className="text-success">✓</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Gastado</p>
              <p className="text-2xl font-bold text-primary">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">$</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Compras Totales</p>
              <p className="text-2xl font-bold text-foreground">
                {customers.reduce((sum, c) => sum + c.totalPurchases, 0)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-foreground">🛍</span>
            </div>
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
                placeholder="Buscar clientes..."
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
                { value: 'all', label: 'Todos los estados' },
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

      {/* Customers Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Compras</TableHead>
              <TableHead>Total Gastado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{customer.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-foreground">{customer.city}</p>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{customer.totalPurchases}</TableCell>
                <TableCell className="font-semibold text-primary">${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'success' : 'danger'}>
                    {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(customer)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(customer)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title={customer.status === 'active' ? 'Desactivar' : 'Activar'}
                    >
                      {customer.status === 'active'
                        ? <ToggleRight className="h-5 w-5 text-success" />
                        : <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      }
                    </button>
                    <button
                      onClick={() => handleEdit(customer)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer)}
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
            totalItems={sortedCustomers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        title={viewMode === 'details' ? 'Detalles de Cliente' : selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        {viewMode === 'details' ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{customerForm.name}</h2>
              <p className="text-sm text-muted-foreground">{customerForm.email}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="block text-sm text-muted-foreground">Teléfono</span>
                <p className="mt-1 text-foreground">{customerForm.phone}</p>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Ciudad</span>
                <p className="mt-1 text-foreground">{customerForm.city}</p>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Estado</span>
                <p className="mt-1 text-foreground">{customerForm.status === 'active' ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => {
                setIsModalOpen(false);
                setSelectedCustomer(null);
              }}>
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Nombre"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
              placeholder="Nombre completo"
            />
            <Input
              label="Email"
              type="email"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
            <Input
              label="Teléfono"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
              placeholder="+52 1 555 555 5555"
            />
            <Input
              label="Ciudad"
              value={customerForm.city}
              onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })}
              placeholder="Ciudad"
            />
            <Select
              label="Estado"
              value={customerForm.status}
              onChange={(e) => setCustomerForm({ ...customerForm, status: e.target.value })}
              options={[
                { value: 'active', label: 'Activo' },
                { value: 'inactive', label: 'Inactivo' }
              ]}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => {
                setIsModalOpen(false);
                setSelectedCustomer(null);
              }}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveCustomer}>
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar este cliente?"
        description="Se perderán todos los datos y el historial de compras del cliente."
        itemName={customerToDelete?.name}
      />
    </div>
  );
}
