import { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { Button } from '../../../../shared/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui/Card';
import { Select } from '../../../../shared/components/ui/Select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const salesByMonth = [
  { month: 'Ene', ventas: 45000, productos: 120, clientes: 35 },
  { month: 'Feb', ventas: 52000, productos: 145, clientes: 42 },
  { month: 'Mar', ventas: 48000, productos: 130, clientes: 38 },
  { month: 'Abr', ventas: 61000, productos: 168, clientes: 48 },
  { month: 'May', ventas: 55000, productos: 152, clientes: 45 },
  { month: 'Jun', ventas: 67000, productos: 180, clientes: 52 }
];

const salesByCategory = [
  { name: 'Exclusivos', value: 35, amount: 23450 },
  { name: 'Hombre', value: 28, amount: 18760 },
  { name: 'Mujer', value: 32, amount: 21440 },
  { name: 'Unisex', value: 15, amount: 10050 }
];

const topSellers = [
  { name: 'Carlos Vendedor', sales: 45, total: 33750 },
  { name: 'María Vendedora', sales: 38, total: 28500 },
  { name: 'Juan Pérez', sales: 32, total: 24000 },
  { name: 'Ana García', sales: 28, total: 21000 }
];

const COLORS = ['#C9A227', '#8B7355', '#D4AF37', '#A88620'];

export function Reports() {
  const [period, setPeriod] = useState('month');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Reportes</h1>
          <p className="text-muted-foreground">
            Vista general y análisis de tu negocio
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'week', label: 'Última Semana' },
              { value: 'month', label: 'Último Mes' },
              { value: 'quarter', label: 'Último Trimestre' },
              { value: 'year', label: 'Último Año' }
            ]}
          />
          <Button variant="primary" size="lg">
            <Download className="h-5 w-5" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-success font-semibold">+12%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ventas Totales</p>
          <p className="text-2xl font-bold text-foreground">$328,000</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-success font-semibold">+8%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Pedidos</p>
          <p className="text-2xl font-bold text-foreground">895</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-success font-semibold">+23%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Clientes Nuevos</p>
          <p className="text-2xl font-bold text-foreground">260</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-success font-semibold">+15%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
          <p className="text-2xl font-bold text-foreground">$366</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="var(--primary)" strokeWidth={2} name="Ventas ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Products Sold */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="productos" fill="var(--primary)" radius={[8, 8, 0, 0]} name="Productos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={seller.name} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">{seller.sales} ventas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${seller.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Categoría</th>
                  <th className="text-left p-4 font-semibold text-foreground">Ventas</th>
                  <th className="text-left p-4 font-semibold text-foreground">Monto</th>
                  <th className="text-left p-4 font-semibold text-foreground">% Total</th>
                  <th className="text-left p-4 font-semibold text-foreground">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                {salesByCategory.map((category) => {
                  const totalAmount = salesByCategory.reduce((sum, c) => sum + c.amount, 0);
                  const percentage = ((category.amount / totalAmount) * 100).toFixed(1);

                  return (
                    <tr key={category.name} className="border-b border-border">
                      <td className="p-4 text-foreground font-medium">{category.name}</td>
                      <td className="p-4 text-foreground">{category.value} productos</td>
                      <td className="p-4 text-primary font-semibold">${category.amount.toLocaleString()}</td>
                      <td className="p-4 text-foreground">{percentage}%</td>
                      <td className="p-4">
                        <span className="text-success">↑ 12%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
