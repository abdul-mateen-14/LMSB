import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  BorrowRecord,
  BorrowCreateRequest,
  getBorrowRecords,
  getBorrowsByStatus,
  createBorrow,
  recordReturn,
  getBooks,
  getMembers,
} from "@shared/api";
import { useToast } from "@/hooks/use-toast";

const BorrowingPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingBorrow, setIsAddingBorrow] = useState(false);
  const [formData, setFormData] = useState({
    member_id: 0,
    book_id: 0,
    borrow_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Fetch borrow records
  const {
    data: borrowRecords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["borrowing", filterStatus],
    queryFn: () =>
      filterStatus === "all"
        ? getBorrowRecords()
        : getBorrowsByStatus(filterStatus),
  });

  // Fetch books and members for dropdown
  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  // Create borrow mutation
  const createMutation = useMutation({
    mutationFn: (data: BorrowCreateRequest) => createBorrow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowing"] });
      setIsAddingBorrow(false);
      setFormData({
        member_id: 0,
        book_id: 0,
        borrow_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
      toast({
        title: "Success",
        description: "Borrow record created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create borrow record",
        variant: "destructive",
      });
    },
  });

  // Record return mutation
  const returnMutation = useMutation({
    mutationFn: (id: number) => recordReturn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowing"] });
      toast({
        title: "Success",
        description: "Return recorded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record return",
        variant: "destructive",
      });
    },
  });

  const filteredRecords = borrowRecords.filter((record: BorrowRecord) => {
    const matchesSearch =
      record.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.book_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    active: borrowRecords.filter((r: BorrowRecord) => r.status === "active")
      .length,
    returned: borrowRecords.filter((r: BorrowRecord) => r.status === "returned")
      .length,
    overdue: borrowRecords.filter((r: BorrowRecord) => r.status === "overdue")
      .length,
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.member_id === 0 || formData.book_id === 0) {
      toast({
        title: "Error",
        description: "Please select both member and book",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load borrowing records</p>
        </div>
      </Layout>
    );
  }

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
            <p className="text-2xl font-bold">{stats.active}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Returned</p>
            </div>
            <p className="text-2xl font-bold">{stats.returned}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <p className="text-2xl font-bold">{stats.overdue}</p>
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
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <select
                value={formData.member_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    member_id: parseInt(e.target.value),
                  })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              >
                <option value="0">Select Member</option>
                {members.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.member_id})
                  </option>
                ))}
              </select>
              <select
                value={formData.book_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    book_id: parseInt(e.target.value),
                  })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              >
                <option value="0">Select Book</option>
                {books.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={formData.borrow_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    borrow_date: e.target.value,
                  })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    due_date: e.target.value,
                  })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <div className="sm:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  ) : null}
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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading records...</p>
          </div>
        ) : (
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
                  {filteredRecords.map((record: BorrowRecord) => (
                    <tr
                      key={record.id}
                      className="table-row-hover border-b border-border/50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {record.member_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {record.book_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(record.borrow_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {new Date(record.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              record.status,
                            )}`}
                          >
                            {record.status.charAt(0).toUpperCase() +
                              record.status.slice(1)}
                          </span>
                          {record.fine_amount > 0 && (
                            <span className="text-xs text-red-600">
                              Fine: ${record.fine_amount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {record.status === "active" && (
                          <button
                            onClick={() => returnMutation.mutate(record.id)}
                            disabled={returnMutation.isPending}
                            className="px-3 py-1 rounded-lg bg-green-500/10 text-green-700 hover:bg-green-500/20 transition-colors text-xs font-medium disabled:opacity-50"
                          >
                            Mark Returned
                          </button>
                        )}
                        {record.status === "returned" && (
                          <span className="text-xs text-muted-foreground">
                            Returned{" "}
                            {record.return_date &&
                              new Date(record.return_date).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredRecords.length === 0 && (
          <div className="text-center py-12 card-hover">
            <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No borrow records found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BorrowingPage;
