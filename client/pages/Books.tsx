import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  Book,
  BookCreateRequest,
  getBooks,
  searchBooks,
  createBook,
  deleteBook,
} from "@shared/api";
import { useToast } from "@/hooks/use-toast";

const BooksPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "author" | "category">(
    "title",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Fiction",
    copies: 1,
    year: new Date().getFullYear(),
  });

  // Fetch books
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // Create book mutation
  const createMutation = useMutation({
    mutationFn: (data: BookCreateRequest) => createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setIsAddingBook(false);
      setFormData({
        title: "",
        author: "",
        isbn: "",
        category: "Fiction",
        copies: 1,
        year: new Date().getFullYear(),
      });
      toast({
        title: "Success",
        description: "Book added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    },
  });

  // Delete book mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    },
  });

  const categories = ["all", "Fiction", "Dystopian", "Romance", "Non-Fiction"];

  const filteredBooks = books.filter((book: Book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a: Book, b: Book) => {
    const aValue = a[sortBy as keyof Book].toString().toLowerCase();
    const bValue = b[sortBy as keyof Book].toString().toLowerCase();
    const comparison = aValue.localeCompare(bValue);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (available: number, total: number) => {
    if (available === 0) {
      return { style: "bg-red-500/10 text-red-700", text: "Out of Stock" };
    } else if (available < total / 3) {
      return { style: "bg-yellow-500/10 text-yellow-700", text: "Low Stock" };
    }
    return { style: "bg-green-500/10 text-green-700", text: "Available" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData as BookCreateRequest);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load books</p>
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
            <h1 className="text-3xl font-bold text-foreground">Books</h1>
            <p className="text-muted-foreground mt-2">
              Manage your library's book collection
            </p>
          </div>
          <button
            onClick={() => setIsAddingBook(!isAddingBook)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card hover:border-primary/30 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card hover:border-primary/30 focus:border-primary focus:outline-none transition-colors text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Book Form (Modal-like) */}
        {isAddingBook && (
          <div className="card-hover p-6 bg-muted/30 border-primary/30">
            <h2 className="text-lg font-semibold mb-4">Add New Book</h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="ISBN"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              >
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Number of Copies"
                value={formData.copies}
                onChange={(e) =>
                  setFormData({ ...formData, copies: parseInt(e.target.value) })
                }
                min="1"
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="Publication Year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                min="1000"
                max={new Date().getFullYear()}
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
                  Save Book
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingBook(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Books Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading books...</p>
          </div>
        ) : (
          <div className="card-hover overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      <button
                        onClick={() => {
                          setSortBy("title");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        Title
                        {sortBy === "title" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      <button
                        onClick={() => {
                          setSortBy("author");
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        }}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        Author
                        {sortBy === "author" &&
                          (sortOrder === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Copies
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Available
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBooks.map((book: Book) => {
                    const status = getStatusBadge(
                      book.available_copies,
                      book.total_copies,
                    );
                    return (
                      <tr
                        key={book.id}
                        className="table-row-hover border-b border-border/50"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                          {book.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {book.total_copies}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {book.available_copies}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${status.style}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => deleteMutation.mutate(book.id)}
                              disabled={deleteMutation.isPending}
                              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedBooks.length === 0 && (
          <div className="text-center py-12 card-hover">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No books found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;
