import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
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

const mockUsers = [
  {
    id: 1,
    name: 'Admin Principal',
    email: 'admin@fragshop.com',
    phone: '+34 91 234 5678',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2024-06-01',
    joinDate: '2022-01-01'
  },
  {
    id: 2,
    name: 'Carlos Vendedor',
    email: 'carlos@fragshop.com',
    phone: '+34 93 456 7890',
    role: 'Vendedor',
    status: 'active',
    lastLogin: '2024-05-31',
    joinDate: '2022-03-15'
  },
  {
    id: 3,
    name: 'María Vendedora',
    email: 'maria@fragshop.com',
    phone: '+34 95 678 9012',
    role: 'Vendedor',
    status: 'active',
    lastLogin: '2024-06-01',
    joinDate: '2022-06-10'
  },
  {
    id: 4,
    name: 'Juan Supervisor',
    email: 'juan@fragshop.com',
    phone: '+34 94 123 4567',
    role: 'Supervisor',
    status: 'active',
    lastLogin: '2024-05-28',
    joinDate: '2023-01-20'
  },
  {
    id: 5,
    name: 'Ana Inventario',
    email: 'ana@fragshop.com',
    phone: '+34 96 789 0123',
    role: 'Vendedor',
    status: 'inactive',
    lastLogin: '2024-03-15',
    joinDate: '2023-06-01'
  }
];

const roles = ['Todos', 'Administrador', 'Supervisor', 'Vendedor'];
const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'role', label: 'Rol' },
  { value: 'lastLogin', label: 'Último acceso' },
  { value: 'joinDate', label: 'Fecha ingreso' }
];

export function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'Vendedor', status: 'active' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setUserForm({ name: '', email: '', phone: '', role: 'Vendedor', status: 'active' });
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, ...userForm }
          : user
      ));
    } else {
      const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
      setUsers([...users, {
        id: nextId,
        lastLogin: new Date().toISOString().slice(0, 10),
        joinDate: new Date().toISOString().slice(0, 10),
        ...userForm
      }]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = (user) => {
    setUsers(users.map(u => u.id === user.id
      ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
      : u
    ));
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminCount = users.filter(u => u.role === 'Administrador').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestión de cuentas de usuario y acceso al sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Mail className="h-5 w-5" />
            Invitar
          </Button>
          <Button variant="primary" size="lg" onClick={handleNewUser}>
            <Plus className="h-5 w-5" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Usuarios Activos</p>
              <p className="text-2xl font-bold text-success">{activeUsers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Administradores</p>
              <p className="text-2xl font-bold text-primary">{adminCount}</p>
            </div>
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactivos</p>
              <p className="text-2xl font-bold text-destructive">{users.filter(u => u.status === 'inactive').length}</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar usuario..."
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
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={roles.map(r => ({ value: r, label: r }))}
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

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Último Acceso</TableHead>
              <TableHead>Ingreso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-primary flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'Administrador' ? 'danger' : 'default'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(user.joinDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
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
            totalItems={sortedUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            placeholder="Nombre completo"
          />
          <Input
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
          <Input
            label="Teléfono"
            value={userForm.phone}
            onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            placeholder="Teléfono"
          />
          <Select
            label="Rol"
            value={userForm.role}
            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            options={roles.filter(r => r !== 'Todos').map((role) => ({ value: role, label: role }))}
          />
          <Select
            label="Estado"
            value={userForm.status}
            onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
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
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar este usuario?"
        description="El usuario perderá acceso al sistema y su cuenta será eliminada."
        itemName={userToDelete?.name}
      />
    </div>
  );
}
