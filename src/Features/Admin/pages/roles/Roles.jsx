import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, CheckCircle, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
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

const availablePermissions = [
  { id: 'dashboard.view', name: 'Ver Dashboard', description: 'Acceso al panel principal', module: 'Dashboard' },
  { id: 'products.view', name: 'Ver Productos', description: 'Ver listado de productos', module: 'Productos' },
  { id: 'products.create', name: 'Crear Productos', description: 'Crear nuevos productos', module: 'Productos' },
  { id: 'products.edit', name: 'Editar Productos', description: 'Modificar productos existentes', module: 'Productos' },
  { id: 'sales.view', name: 'Ver Ventas', description: 'Ver historial de ventas', module: 'Ventas' },
  { id: 'customers.view', name: 'Ver Clientes', description: 'Ver listado de clientes', module: 'Clientes' },
  { id: 'users.view', name: 'Ver Usuarios', description: 'Ver listado de usuarios', module: 'Usuarios' },
];

const mockRoles = [
  {
    id: 1,
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    permissions: availablePermissions.map(p => p.id),
    usersCount: 2,
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: 'Vendedor',
    description: 'Acceso a ventas, productos y clientes',
    permissions: ['dashboard.view', 'products.view', 'sales.view', 'customers.view'],
    usersCount: 5,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    name: 'Supervisor',
    description: 'Acceso a reportes y supervisión',
    permissions: ['dashboard.view', 'products.view', 'sales.view', 'customers.view'],
    usersCount: 3,
    status: 'active',
    createdAt: '2024-02-01'
  }
];

const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'usersCount', label: 'Usuarios' },
  { value: 'createdAt', label: 'Fecha Creación' }
];

export function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [roleToView, setRoleToView] = useState(null);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = sortedRoles.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsModalOpen(true);
  };

  const handleView = (role) => {
    setRoleToView(role);
    setDetailModalOpen(true);
  };

  const handleNewRole = () => {
    setSelectedRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedRole) {
      setRoles(roles.map((role) =>
        role.id === selectedRole.id
          ? { ...role, ...roleForm }
          : role
      ));
    } else {
      const nextId = Math.max(0, ...roles.map((role) => role.id)) + 1;
      setRoles([...roles, {
        id: nextId,
        usersCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
        ...roleForm
      }]);
    }
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const handleToggleStatus = (role) => {
    setRoles(roles.map(r => r.id === role.id
      ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' }
      : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Roles y Permisos</h1>
          <p className="text-muted-foreground">
            Gestiona los roles y permisos de acceso al sistema
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={handleNewRole}>
          <Plus className="h-5 w-5" />
          Nuevo Rol
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold text-foreground">{roles.length}</p>
            </div>
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Roles Activos</p>
              <p className="text-2xl font-bold text-success">
                {roles.filter(r => r.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Usuarios Asignados</p>
              <p className="text-2xl font-bold text-primary">
                {roles.reduce((sum, r) => sum + r.usersCount, 0)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">👥</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Permisos Totales</p>
              <p className="text-2xl font-bold text-foreground">{availablePermissions.length}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-foreground">🔐</span>
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
                placeholder="Buscar roles..."
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

      {/* Roles Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rol</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Usuarios</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{role.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {role.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {role.description}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="info">
                    {role.permissions.length} permisos
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-foreground font-semibold">{role.usersCount}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={role.status === 'active' ? 'success' : 'danger'}>
                    {role.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(role)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleEdit(role)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
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
            totalItems={sortedRoles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        }}
        title={selectedRole ? 'Editar Rol' : 'Nuevo Rol'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={roleForm.name}
            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
            placeholder="Nombre del rol"
          />
          <Input
            label="Descripción"
            value={roleForm.description}
            onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
            placeholder="Descripción del rol"
          />
          <Select
            label="Permisos"
            value={roleForm.permissions.join(',')}
            onChange={(e) => setRoleForm({ ...roleForm, permissions: e.target.value.split(',') })}
            options={availablePermissions.map((permission) => ({ value: permission.id, label: permission.name }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setSelectedRole(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Detalle de Rol"
      >
        {roleToView && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">{roleToView.name}</h2>
              <p className="text-sm text-muted-foreground">{roleToView.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="block text-sm text-muted-foreground">Usuarios asignados</span>
                <p className="mt-1 text-foreground">{roleToView.usersCount}</p>
              </div>
              <div>
                <span className="block text-sm text-muted-foreground">Estado</span>
                <p className="mt-1 text-foreground">{roleToView.status === 'active' ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Permisos</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-foreground">
                {roleToView.permissions.map((permission) => (
                  <li key={permission}>{permission}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>
                Cerrar
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
          setRoleToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar este rol?"
        description="Los usuarios con este rol perderán sus permisos asignados."
        itemName={roleToDelete?.name}
      />
    </div>
  );
}
