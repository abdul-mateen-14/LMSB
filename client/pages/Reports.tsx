import Layout from "@/components/Layout";
import { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Calendar } from "lucide-react";

interface ReportData {
  month: string;
  borrows: number;
  returns: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface TopBook {
  title: string;
  author: string;
  borrows: number;
  rating: number;
}

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("month");

  const borrowTrendData: ReportData[] = [
    { month: "Jan", borrows: 65, returns: 58 },
    { month: "Feb", borrows: 78, returns: 72 },
    { month: "Mar", borrows: 82, returns: 79 },
    { month: "Apr", borrows: 91, returns: 88 },
    { month: "May", borrows: 87, returns: 85 },
    { month: "Jun", borrows: 95, returns: 92 },
  ];

  const categoryData: CategoryData[] = [
    { name: "Fiction", value: 34 },
    { name: "Non-Fiction", value: 28 },
    { name: "Academic", value: 22 },
    { name: "Reference", value: 16 },
  ];

  const topBooks: TopBook[] = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", borrows: 45, rating: 4.8 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", borrows: 42, rating: 4.9 },
    { title: "1984", author: "George Orwell", borrows: 38, rating: 4.7 },
    { title: "Pride and Prejudice", author: "Jane Austen", borrows: 35, rating: 4.6 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", borrows: 31, rating: 4.5 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const stats = [
    { label: "Total Borrows", value: "498", change: "+12%" },
    { label: "Total Returns", value: "474", change: "+8%" },
    { label: "Active Members", value: "384", change: "+15%" },
    { label: "Books in Inventory", value: "2,456", change: "+5%" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Library statistics and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button className="btn-primary flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card animate-slide-down"
              style={{ animationDelay: `${index * 50}ms` }}>
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Borrow vs Returns */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Borrow vs Returns Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={borrowTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="borrows" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="returns" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Books by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card-hover p-6">
          <h2 className="text-lg font-semibold mb-4">Annual Borrowing Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={borrowTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="borrows"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
                name="Borrows"
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--muted-foreground))", r: 5 }}
                name="Returns"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Books Table */}
        <div className="card-hover p-6">
          <h2 className="text-lg font-semibold mb-4">Top Borrowed Books</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Book Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Borrows
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {topBooks.map((book, index) => (
                  <tr key={index} className="table-row-hover border-b border-border/50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {book.borrows}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-medium">{book.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
