import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getDashboardData,
  getMonthlyStats,
  getBorrowRecords,
} from "@shared/api";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
}

const Dashboard = () => {
  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  // Fetch monthly stats
  const { data: monthlyStats = [], isLoading: monthlyLoading } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: getMonthlyStats,
  });

  // Fetch recent borrowing records
  const { data: borrowRecords = [] } = useQuery({
    queryKey: ["borrowing"],
    queryFn: getBorrowRecords,
  });

  // Transform monthly stats for charts
  const chartData = monthlyStats
    .map((item: any) => ({
      name: new Date(item.month + "-01").toLocaleDateString("en-US", {
        month: "short",
      }),
      value: item.borrows || 0,
    }))
    .reverse()
    .slice(-6);

  const borrowData = [
    { name: "Fiction", books: 234 },
    { name: "Non-Fiction", books: 189 },
    { name: "Academic", books: 167 },
    { name: "Reference", books: 98 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  const stats: StatCard[] = [
    {
      label: "Total Books",
      value: dashboardData?.total_books || 0,
      icon: BookOpen,
      trend: "+12% this month",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Active Members",
      value: dashboardData?.active_members || 0,
      icon: Users,
      trend: "+8% this month",
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Books Borrowed",
      value: dashboardData?.books_borrowed || 0,
      icon: RotateCcw,
      trend: "This month",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Overdue Books",
      value: dashboardData?.overdue_books || 0,
      icon: AlertCircle,
      trend: "Needs attention",
      color: "bg-red-500/10 text-red-600",
    },
  ];

  const isLoading = dashboardLoading || monthlyLoading;

  // Get recent activities from borrow records
  const recentActivity = borrowRecords
    .slice(0, 4)
    .map((record: any, index: number) => ({
      id: index + 1,
      member: record.member_name,
      action: record.status === "returned" ? "Returned" : "Borrowed",
      book: record.book_title,
      date: new Date(record.borrow_date).toLocaleDateString(),
    }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your library overview.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-20 mb-2" />
                <div className="h-8 bg-muted rounded w-32" />
              </div>
            ))}
          </div>
        ) : (
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
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {stat.trend && (
                      <div className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded">
                        {stat.trend}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Borrowing Trend */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Borrowing Trend</h2>
            {isLoading ? (
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
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
            ) : (
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>

          {/* Books by Category */}
          <div className="card-hover p-6">
            <h2 className="text-lg font-semibold mb-4">Books by Category</h2>
            {isLoading ? (
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
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
          ) : (
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card-hover p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-muted rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="table-row-hover flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {activity.member}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} "{activity.book}"
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
