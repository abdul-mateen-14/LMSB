import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  RotateCcw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface BorrowData {
  name: string;
  books: number;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatCard[] = [
    {
      label: "Total Books",
      value: "2,456",
      icon: BookOpen,
      trend: "+12% this month",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Active Members",
      value: "384",
      icon: Users,
      trend: "+8% this month",
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Books Borrowed",
      value: "147",
      icon: RotateCcw,
      trend: "This month",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Overdue Books",
      value: "12",
      icon: AlertCircle,
      trend: "Needs attention",
      color: "bg-red-500/10 text-red-600",
    },
  ];

  const chartData: ChartDataPoint[] = [
    { name: "Jan", value: 65 },
    { name: "Feb", value: 78 },
    { name: "Mar", value: 82 },
    { name: "Apr", value: 91 },
    { name: "May", value: 87 },
    { name: "Jun", value: 95 },
  ];

  const borrowData: BorrowData[] = [
    { name: "Fiction", books: 234 },
    { name: "Non-Fiction", books: 189 },
    { name: "Academic", books: 167 },
    { name: "Reference", books: 98 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const recentActivity = [
    { id: 1, member: "John Doe", action: "Borrowed", book: "The Great Gatsby", date: "2 hours ago" },
    { id: 2, member: "Jane Smith", action: "Returned", book: "1984", date: "5 hours ago" },
    { id: 3, member: "Mike Johnson", action: "Borrowed", book: "To Kill a Mockingbird", date: "1 day ago" },
    { id: 4, member: "Sarah Williams", action: "Reserved", book: "Pride and Prejudice", date: "2 days ago" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your library overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-card animate-slide-down"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {stat.trend && (
                    <div className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">
                      {stat.trend}
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Borrowing Trend */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Borrowing Trend</h2>
            {isLoading ? (
              <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
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
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Books by Category */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Books by Category</h2>
            {isLoading ? (
              <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={borrowData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="books"
                  >
                    {borrowData.map((entry, index) => (
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
            )}
          </div>
        </div>

        {/* Monthly Borrows Bar Chart */}
        <div className="card-hover p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Activity</h2>
          {isLoading ? (
            <div className="h-64 bg-muted/30 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card-hover p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="table-row-hover flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.member}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} "{activity.book}"
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
