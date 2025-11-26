/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Base API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Book API types
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
  publication_year: number;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  isbn: string;
  category: string;
  copies: number;
  year?: number;
}

// Member API types
export interface Member {
  id: number;
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: "active" | "inactive" | "suspended";
  join_date: string;
}

export interface MemberCreateRequest {
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// Borrowing API types
export interface BorrowRecord {
  id: number;
  member_id: number;
  book_id: number;
  member_name: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: "active" | "returned" | "overdue";
  fine_amount: number;
}

export interface BorrowCreateRequest {
  member_id: number;
  book_id: number;
  borrow_date: string;
  due_date: string;
}

// Reports API types
export interface Statistics {
  active_borrows: number;
  returned_books: number;
  overdue_books: number;
  total_records: number;
}

export interface MonthlyStats {
  month: string;
  borrows: number;
  returns: number;
}

export interface TopBook {
  id: number;
  title: string;
  author: string;
  borrow_count: number;
}

export interface DashboardData {
  total_books: number;
  active_members: number;
  books_borrowed: number;
  overdue_books: number;
}

// Settings API types
export interface LibrarySettings {
  id: number;
  library_name: string;
  email: string;
  phone: string;
  address: string;
  borrow_limit: number;
  borrow_duration_days: number;
  late_fee_per_day: number;
  enable_notifications: boolean;
  enable_fine: boolean;
}

export interface DemoResponse {
  message: string;
}

// API client utilities
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getBooks(): Promise<Book[]> {
  return fetchFromAPI("/books");
}

export async function getBook(id: number): Promise<Book> {
  return fetchFromAPI(`/books/${id}`);
}

export async function searchBooks(
  query: string,
  category?: string,
): Promise<Book[]> {
  const params = new URLSearchParams({ q: query });
  if (category) params.append("category", category);
  return fetchFromAPI(`/books/search?${params.toString()}`);
}

export async function createBook(data: BookCreateRequest): Promise<void> {
  return fetchFromAPI("/books", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateBook(
  id: number,
  data: Partial<Book>,
): Promise<void> {
  return fetchFromAPI(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteBook(id: number): Promise<void> {
  return fetchFromAPI(`/books/${id}`, {
    method: "DELETE",
  });
}

export async function getMembers(): Promise<Member[]> {
  return fetchFromAPI("/members");
}

export async function getMember(id: number): Promise<Member> {
  return fetchFromAPI(`/members/${id}`);
}

export async function searchMembers(query: string): Promise<Member[]> {
  return fetchFromAPI(`/members/search?q=${encodeURIComponent(query)}`);
}

export async function getMembersByStatus(status: string): Promise<Member[]> {
  return fetchFromAPI(`/members/status/${status}`);
}

export async function createMember(data: MemberCreateRequest): Promise<void> {
  return fetchFromAPI("/members", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMember(
  id: number,
  data: Partial<Member>,
): Promise<void> {
  return fetchFromAPI(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMember(id: number): Promise<void> {
  return fetchFromAPI(`/members/${id}`, {
    method: "DELETE",
  });
}

export async function getBorrowRecords(): Promise<BorrowRecord[]> {
  return fetchFromAPI("/borrowing");
}

export async function getBorrowRecord(id: number): Promise<BorrowRecord> {
  return fetchFromAPI(`/borrowing/${id}`);
}

export async function getMemberBorrows(
  memberId: number,
): Promise<BorrowRecord[]> {
  return fetchFromAPI(`/borrowing/member/${memberId}`);
}

export async function getBorrowsByStatus(
  status: string,
): Promise<BorrowRecord[]> {
  return fetchFromAPI(`/borrowing/status/${status}`);
}

export async function getOverdueBorrows(): Promise<BorrowRecord[]> {
  return fetchFromAPI("/borrowing/overdue");
}

export async function createBorrow(data: BorrowCreateRequest): Promise<void> {
  return fetchFromAPI("/borrowing", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function recordReturn(borrowId: number): Promise<void> {
  return fetchFromAPI(`/borrowing/${borrowId}/return`, {
    method: "POST",
  });
}

export async function getStatistics(): Promise<Statistics> {
  return fetchFromAPI("/reports/statistics");
}

export async function getMonthlyStats(): Promise<MonthlyStats[]> {
  return fetchFromAPI("/reports/monthly");
}

export async function getTopBooks(): Promise<TopBook[]> {
  return fetchFromAPI("/reports/top-books");
}

export async function getDashboardData(): Promise<DashboardData> {
  return fetchFromAPI("/reports/dashboard");
}

export async function getSettings(): Promise<LibrarySettings> {
  return fetchFromAPI("/settings");
}

export async function updateSettings(
  data: Partial<LibrarySettings>,
): Promise<void> {
  return fetchFromAPI("/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
