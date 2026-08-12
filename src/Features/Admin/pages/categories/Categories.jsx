import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Tag } from 'lucide-react';
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

const mockCategories = [
  {
    id: 1,
    name: 'Exclusivos',
    description: 'Fragancias premium de edición limitada',
    productCount: 8,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Hombre',
    description: 'Perfumes masculinos',
    productCount: 15,
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'Mujer',
    description: 'Fragancias femeninas',
    productCount: 22,
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 4,
    name: 'Unisex',
    description: 'Perfumes para todos',
    productCount: 12,
    status: 'active',
    createdAt: '2024-01-20'
  },
  {
    id: 5,
    name: 'Niños',
    description: 'Fragancias suaves para niños',
    productCount: 5,
    status: 'inactive',
    createdAt: '2024-02-01'
  }
];

const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'productCount', label: 'Productos' },
  { value: 'createdAt', label: 'Fecha' }
];

export function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', status: 'active' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cat.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setIsModalOpen(true);
  };

  const openNewCategoryModal = () => {
    setSelectedCategory(null);
    setCategoryForm({ name: '', description: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (selectedCategory) {
      setCategories(categories.map((cat) =>
        cat.id === selectedCategory.id
          ? { ...cat, ...categoryForm }
          : cat
      ));
    } else {
      const nextId = Math.max(0, ...categories.map((cat) => cat.id)) + 1;
      setCategories([...categories, { id: nextId, productCount: 0, createdAt: new Date().toISOString().slice(0, 10), ...categoryForm }]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Categorías</h1>
          <p className="text-muted-foreground">
            Administra las categorías de tus productos
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={openNewCategoryModal}>
          <Plus className="h-5 w-5" />
          Nueva Categoría
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Categorías</p>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
            <Tag className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activas</p>
              <p className="text-2xl font-bold text-success">
                {categories.filter(c => c.status === 'active').length}
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
              <p className="text-sm text-muted-foreground">Productos Totales</p>
              <p className="text-2xl font-bold text-primary">
                {categories.reduce((sum, c) => sum + c.productCount, 0)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">#</span>
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
                placeholder="Buscar categorías..."
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
                { value: 'active', label: 'Activas' },
                { value: 'inactive', label: 'Inactivas' }
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

      {/* Categories Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Tag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{category.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {category.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{category.description}</TableCell>
                <TableCell>
                  <Badge variant="info">{category.productCount} productos</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={category.status === 'active' ? 'success' : 'danger'}>
                    {category.status === 'active' ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
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
            totalItems={sortedCategories.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            placeholder="Nombre de la categoría"
          />
          <Input
            label="Descripción"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            placeholder="Descripción breve"
          />
          <Select
            label="Estado"
            value={categoryForm.status}
            onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setSelectedCategory(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveCategory}>
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
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar esta categoría?"
        description="Los productos asociados quedarán sin categoría."
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}
