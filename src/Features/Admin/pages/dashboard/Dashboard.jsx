import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertCircle
} from 'lucide-react';
import { StatCard } from '../../../components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const salesData = [
  { month: 'Ene', ventas: 45000, pedidos: 120 },
  { month: 'Feb', ventas: 52000, pedidos: 145 },
  { month: 'Mar', ventas: 48000, pedidos: 130 },
  { month: 'Abr', ventas: 61000, pedidos: 168 },
  { month: 'May', ventas: 55000, pedidos: 152 },
  { month: 'Jun', ventas: 67000, pedidos: 180 }
];

const topProducts = [
  { name: 'Essence Royale', sales: 245, revenue: '$12,250' },
  { name: 'Noir Elegance', sales: 198, revenue: '$9,900' },
  { name: 'Golden Mist', sales: 176, revenue: '$8,800' },
  { name: 'Velvet Rose', sales: 154, revenue: '$7,700' },
  { name: 'Ocean Breeze', sales: 132, revenue: '$6,600' }
];

const lowStockProducts = [
  { name: 'Essence Royale', stock: 5, min: 20 },
  { name: 'Midnight Dream', stock: 3, min: 15 },
  { name: 'Summer Bloom', stock: 8, min: 25 }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a Essence Don Aire - Vista general de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales"
          value="$67,000"
          change="+12% vs mes anterior"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-primary"
        />
        <StatCard
          title="Pedidos"
          value="180"
          change="+8% vs mes anterior"
          changeType="positive"
          icon={ShoppingCart}
          iconColor="text-primary"
        />
        <StatCard
          title="Clientes Nuevos"
          value="42"
          change="+23% vs mes anterior"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
        />
        <StatCard
          title="Tasa de Conversión"
          value="3.2%"
          change="-0.5% vs mes anterior"
          changeType="negative"
          icon={TrendingUp}
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="Ventas ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="pedidos" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Productos Más Vendidos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} ventas
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Alertas de Stock Bajo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/10"
                >
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Mínimo: {product.min} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-destructive">{product.stock}</p>
                    <p className="text-xs text-destructive">Stock actual</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
