import Layout from "@/components/Layout";
import { useState } from "react";
import { Search, Plus, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface BorrowRecord {
  id: string;
  memberName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "overdue" | "returned";
  fineAmount?: number;
}

const BorrowingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingBorrow, setIsAddingBorrow] = useState(false);

  const borrowRecords: BorrowRecord[] = [
    {
      id: "1",
      memberName: "John Doe",
      bookTitle: "The Great Gatsby",
      borrowDate: "2024-01-10",
      dueDate: "2024-01-24",
      returnDate: null,
      status: "active",
    },
    {
      id: "2",
      memberName: "Jane Smith",
      bookTitle: "To Kill a Mockingbird",
      borrowDate: "2024-01-05",
      dueDate: "2024-01-19",
      returnDate: "2024-01-18",
      status: "returned",
    },
    {
      id: "3",
      memberName: "Mike Johnson",
      bookTitle: "1984",
      borrowDate: "2024-01-08",
      dueDate: "2024-01-22",
      returnDate: null,
      status: "overdue",
      fineAmount: 5.0,
    },
    {
      id: "4",
      memberName: "Sarah Williams",
      bookTitle: "Pride and Prejudice",
      borrowDate: "2024-01-12",
      dueDate: "2024-01-26",
      returnDate: null,
      status: "active",
    },
    {
      id: "5",
      memberName: "Robert Brown",
      bookTitle: "The Catcher in the Rye",
      borrowDate: "2024-01-01",
      dueDate: "2024-01-15",
      returnDate: null,
      status: "overdue",
      fineAmount: 10.0,
    },
    {
      id: "6",
      memberName: "Emily Davis",
      bookTitle: "Sapiens",
      borrowDate: "2024-01-11",
      dueDate: "2024-01-25",
      returnDate: null,
      status: "active",
    },
  ];

  const filteredRecords = borrowRecords.filter((record) => {
    const matchesSearch =
      record.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-blue-500/10 text-blue-700",
      returned: "bg-green-500/10 text-green-700",
      overdue: "bg-red-500/10 text-red-700",
    };
    return styles[status] || "bg-gray-500/10 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />;
      case "returned":
        return <CheckCircle className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string, returnDate: string | null) => {
    if (returnDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Borrowing</h1>
            <p className="text-muted-foreground mt-2">
              Track book borrowing and returns
            </p>
          </div>
          <button
            onClick={() => setIsAddingBorrow(!isAddingBorrow)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Borrow
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-muted-foreground">Active Borrows</p>
            </div>
            <p className="text-2xl font-bold">
              {borrowRecords.filter((r) => r.status === "active").length}
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Returned</p>
            </div>
            <p className="text-2xl font-bold">
              {borrowRecords.filter((r) => r.status === "returned").length}
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <p className="text-2xl font-bold">
              {borrowRecords.filter((r) => r.status === "overdue").length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by member or book..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
        </div>

        {/* Add Borrow Form */}
        {isAddingBorrow && (
          <div className="card-hover p-6 bg-muted/30 border-primary/30">
            <h2 className="text-lg font-semibold mb-4">Record New Borrow</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none">
                <option>Select Member</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Mike Johnson</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none">
                <option>Select Book</option>
                <option>The Great Gatsby</option>
                <option>To Kill a Mockingbird</option>
                <option>1984</option>
              </select>
              <input
                type="date"
                placeholder="Borrow Date"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                placeholder="Due Date"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <div className="sm:col-span-2 flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  Record Borrow
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingBorrow(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Borrow Records Table */}
        <div className="card-hover overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    Borrow Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="table-row-hover border-b border-border/50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {record.memberName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {record.bookTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      {new Date(record.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {new Date(record.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            record.status
                          )}`}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </span>
                        {record.fineAmount && (
                          <span className="text-xs text-red-600">
                            Fine: ${record.fineAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {record.status === "active" && (
                        <button className="px-3 py-1 rounded-lg bg-green-500/10 text-green-700 hover:bg-green-500/20 transition-colors text-xs font-medium">
                          Mark Returned
                        </button>
                      )}
                      {record.status === "returned" && (
                        <span className="text-xs text-muted-foreground">
                          Returned {new Date(record.returnDate!).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-12 card-hover">
            <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No borrow records found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

import { RotateCcw } from "lucide-react";

export default BorrowingPage;
