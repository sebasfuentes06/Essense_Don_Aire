import { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Card } from '../../../../shared/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../shared/components/ui/Table';
import { Badge } from '../../../../shared/components/ui/Badge';
import { Modal } from '../../../../shared/components/ui/Modal';
import { Input } from '../../../../shared/components/ui/Input';
import { Select } from '../../../../shared/components/ui/Select';
import { DeleteDialog } from '../../../../shared/components/ui/DeleteDialog';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { FilterPanel } from '../../../../shared/components/ui/FilterPanel';
import { SortSelect } from '../../../../shared/components/ui/SortSelect';
import { ItemsPerPageSelect } from '../../../../shared/components/ui/ItemsPerPageSelect';
import { cn } from '../../../../shared/utils/cn';

const mockProducts = [
  {
    id: 1,
    name: 'Essence Royale',
    category: 'Exclusivos',
    price: 89.99,
    stock: 45,
    minStock: 20,
    supplier: 'Fragancias Premium SA',
    status: 'active',
    sku: 'ESS-ROY-001',
    description: 'Fragancia premium con notas de ámbar y vainilla',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400']
  },
  {
    id: 2,
    name: 'Noir Elegance',
    category: 'Hombre',
    price: 74.99,
    stock: 12,
    minStock: 20,
    supplier: 'Perfumes Internacionales',
    status: 'active',
    sku: 'NOI-ELE-002',
    description: 'Aroma masculino intenso con notas de madera',
    images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400']
  },
  {
    id: 3,
    name: 'Golden Mist',
    category: 'Mujer',
    price: 79.99,
    stock: 5,
    minStock: 15,
    supplier: 'Fragancias Premium SA',
    status: 'active',
    sku: 'GOL-MIS-003',
    description: 'Fragancia femenina floral con toques cítricos',
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400']
  },
  {
    id: 4,
    name: 'Velvet Rose',
    category: 'Mujer',
    price: 69.99,
    stock: 28,
    minStock: 15,
    supplier: 'Perfumes Internacionales',
    status: 'active',
    sku: 'VEL-ROS-004',
    description: 'Delicada mezcla de rosas y jazmín',
    images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400']
  },
  {
    id: 5,
    name: 'Ocean Breeze',
    category: 'Unisex',
    price: 64.99,
    stock: 0,
    minStock: 25,
    supplier: 'Fragancias Premium SA',
    status: 'inactive',
    sku: 'OCE-BRE-005',
    description: 'Aroma fresco marino con notas acuáticas',
    images: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400']
  }
];

const categories = ['Todos', 'Exclusivos', 'Hombre', 'Mujer', 'Unisex'];
const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'price', label: 'Precio' },
  { value: 'stock', label: 'Stock' },
  { value: 'category', label: 'Categoría' }
];

export function ProductsManagement() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Unisex', price: '', stock: '', supplier: '', sku: '', status: 'active' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const suppliers = Array.from(new Set(products.map(p => p.supplier)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesPrice = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                        (!priceRange.max || product.price <= Number(priceRange.max));
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && product.stock < product.minStock) ||
                        (stockFilter === 'normal' && product.stock >= product.minStock);
    const matchesSupplier = supplierFilter === 'all' || product.supplier === supplierFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock && matchesSupplier;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplier: product.supplier,
      sku: product.sku,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      supplier: product.supplier,
      sku: product.sku,
      status: product.status
    });
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setProductForm({ name: '', category: 'Unisex', price: '', stock: '', supplier: '', sku: '', status: 'active' });
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      setProducts(products.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) }
          : product
      ));
    } else {
      const nextId = Math.max(0, ...products.map((product) => product.id)) + 1;
      setProducts([...products, {
        id: nextId,
        description: '',
        images: [],
        minStock: 10,
        status: productForm.status,
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock)
      }]);
    }
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
    setSupplierFilter('all');
    setSelectedCategory('Todos');
  };

  const lowStockCount = products.filter(p => p.stock < p.minStock).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gestión de Productos</h1>
          <p className="text-muted-foreground">
            Administra tu inventario de fragancias
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Package className="h-5 w-5" />
            Exportar
          </Button>
          <Button variant="primary" size="lg" onClick={handleNewProduct}>
            <Plus className="h-5 w-5" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Productos</p>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold text-success">
                {products.filter(p => p.status === 'active').length}
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
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-primary">
                ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary">$</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
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
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-5 w-5" />
                Filtros
              </Button>
            </div>

            {/* Quick Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap text-sm',
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted border border-border'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort and Items Per Page */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <SortSelect
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setCurrentPage(1);
                  }}
                  options={sortOptions}
                  direction={sortDirection}
                  onDirectionChange={(dir) => {
                    setSortDirection(dir);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <ItemsPerPageSelect
                value={itemsPerPage}
                onChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="lg:col-span-1">
            <FilterPanel
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              onReset={resetFilters}
            >
              <div className="space-y-4">
                <Select
                  label="Estado"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' }
                  ]}
                />

                <Select
                  label="Stock"
                  value={stockFilter}
                  onChange={(e) => {
                    setStockFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'Todos' },
                    { value: 'low', label: 'Stock Bajo' },
                    { value: 'normal', label: 'Stock Normal' }
                  ]}
                />

                <Select
                  label="Proveedor"
                  value={supplierFilter}
                  onChange={(e) => {
                    setSupplierFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { value: 'all', label: 'Todos' },
                    ...suppliers.map(s => ({ value: s, label: s }))
                  ]}
                />

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">
                    Rango de Precio
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, min: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, max: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
            </FilterPanel>
          </Card>
        )}
      </div>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{product.sku}</code>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="font-semibold text-primary">${product.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-semibold',
                      product.stock < product.minStock ? 'text-destructive' : 'text-foreground'
                    )}>
                      {product.stock}
                    </span>
                    {product.stock < product.minStock && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.supplier}</TableCell>
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'success' : 'danger'}>
                    {product.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleView(product)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="h-8 w-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
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
            totalItems={sortedProducts.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            placeholder="Nombre del producto"
          />
          <Input
            label="SKU"
            value={productForm.sku}
            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
            placeholder="Código SKU"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Precio"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="0.00"
            />
            <Input
              label="Stock"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              placeholder="Cantidad"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Select
              label="Categoría"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              options={categories.map((category) => ({ value: category, label: category }))}
            />
            <Select
              label="Proveedor"
              value={productForm.supplier}
              onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })}
              options={[
                { value: '', label: 'Seleccionar proveedor' },
                ...suppliers.map((supplier) => ({ value: supplier, label: supplier }))
              ]}
            />
          </div>
          <Select
            label="Estado"
            value={productForm.status}
            onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
            options={[
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' }
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveProduct}>
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
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="¿Eliminar este producto?"
        description="El producto y todo su historial serán eliminados del sistema."
        itemName={productToDelete?.name}
      />
    </div>
  );
}
