import Layout from "@/components/Layout";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, Mail, Phone, MapPin } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  borrowedBooks: number;
  totalBorrowed: number;
}

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingMember, setIsAddingMember] = useState(false);

  const members: Member[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0123",
      memberId: "LIB001",
      joinDate: "2023-01-15",
      status: "active",
      borrowedBooks: 3,
      totalBorrowed: 24,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1-555-0124",
      memberId: "LIB002",
      joinDate: "2023-02-20",
      status: "active",
      borrowedBooks: 1,
      totalBorrowed: 18,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1-555-0125",
      memberId: "LIB003",
      joinDate: "2023-03-10",
      status: "active",
      borrowedBooks: 5,
      totalBorrowed: 32,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1-555-0126",
      memberId: "LIB004",
      joinDate: "2022-11-05",
      status: "inactive",
      borrowedBooks: 0,
      totalBorrowed: 15,
    },
    {
      id: "5",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "+1-555-0127",
      memberId: "LIB005",
      joinDate: "2023-04-22",
      status: "suspended",
      borrowedBooks: 2,
      totalBorrowed: 8,
    },
    {
      id: "6",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1-555-0128",
      memberId: "LIB006",
      joinDate: "2023-05-30",
      status: "active",
      borrowedBooks: 2,
      totalBorrowed: 12,
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/10 text-green-700",
      inactive: "bg-gray-500/10 text-gray-700",
      suspended: "bg-red-500/10 text-red-700",
    };
    return styles[status] || "bg-gray-500/10 text-gray-700";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Members</h1>
            <p className="text-muted-foreground mt-2">
              Manage library members and their information
            </p>
          </div>
          <button
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or member ID..."
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
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Add Member Form */}
        {isAddingMember && (
          <div className="card-hover p-6 bg-muted/30 border-primary/30">
            <h2 className="text-lg font-semibold mb-4">Add New Member</h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Member ID"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <select className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none">
                <option>Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <div className="sm:col-span-2 flex gap-2">
                <button type="submit" className="btn-primary flex-1">
                  Save Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member.memberId}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    member.status
                  )}`}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-border mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Currently Borrowed</p>
                  <p className="text-lg font-bold text-foreground">
                    {member.borrowedBooks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Borrowed</p>
                  <p className="text-lg font-bold text-foreground">
                    {member.totalBorrowed}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">Edit</span>
                </button>
                <button className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12 card-hover">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No members found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MembersPage;
