import Layout from "@/components/Layout";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Filter, ChevronUp, ChevronDown } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  available: number;
  year: string;
  status: "available" | "low-stock" | "out-of-stock";
}

const BooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "author" | "category">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const books: Book[] = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0743273565",
      category: "Fiction",
      copies: 5,
      available: 3,
      year: "1925",
      status: "available",
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0061120084",
      category: "Fiction",
      copies: 8,
      available: 2,
      year: "1960",
      status: "available",
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      isbn: "978-0451524935",
      category: "Dystopian",
      copies: 6,
      available: 0,
      year: "1949",
      status: "out-of-stock",
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0141199818",
      category: "Romance",
      copies: 7,
      available: 1,
      year: "1813",
      status: "low-stock",
    },
    {
      id: "5",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      isbn: "978-0316769174",
      category: "Fiction",
      copies: 4,
      available: 4,
      year: "1951",
      status: "available",
    },
    {
      id: "6",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "978-0062316097",
      category: "Non-Fiction",
      copies: 10,
      available: 6,
      year: "2011",
      status: "available",
    },
  ];

  const categories = ["all", "Fiction", "Dystopian", "Romance", "Non-Fiction"];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase();
    const bValue = b[sortBy].toLowerCase();
    const comparison = aValue.localeCompare(bValue);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      available: "bg-green-500/10 text-green-700",
      "low-stock": "bg-yellow-500/10 text-yellow-700",
      "out-of-stock": "bg-red-500/10 text-red-700",
    };
    return styles[status] || "bg-gray-500/10 text-gray-700";
  };

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
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Title"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Author"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="ISBN"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <select className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none">
                <option>Select Category</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Number of Copies"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="Publication Year"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <div className="sm:col-span-2 flex gap-2">
                <button type="submit" className="btn-primary flex-1">
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
                {sortedBooks.map((book) => (
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
                      {book.copies}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      {book.available}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          book.status
                        )}`}
                      >
                        {book.status === "out-of-stock"
                          ? "Out of Stock"
                          : book.status === "low-stock"
                          ? "Low Stock"
                          : "Available"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {sortedBooks.length === 0 && (
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
