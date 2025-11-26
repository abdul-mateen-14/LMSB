import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  Member,
  MemberCreateRequest,
  getMembers,
  getMembersByStatus,
  createMember,
  deleteMember,
} from "@shared/api";
import { useToast } from "@/hooks/use-toast";

const MembersPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [formData, setFormData] = useState({
    member_id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch members
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ["members", filterStatus],
    queryFn: () =>
      filterStatus === "all"
        ? getMembers()
        : getMembersByStatus(filterStatus),
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: (data: MemberCreateRequest) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsAddingMember(false);
      setFormData({
        member_id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    },
  });

  // Delete member mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    },
  });

  const filteredMembers = members.filter((member: Member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.member_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-500/10 text-green-700",
      inactive: "bg-gray-500/10 text-gray-700",
      suspended: "bg-red-500/10 text-red-700",
    };
    return styles[status] || "bg-gray-500/10 text-gray-700";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load members</p>
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Member ID"
                value={formData.member_id}
                onChange={(e) =>
                  setFormData({ ...formData, member_id: e.target.value })
                }
                required
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none col-span-2"
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
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading members...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member: Member) => (
              <div key={member.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.member_id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      member.status
                    )}`}
                  >
                    {member.status.charAt(0).toUpperCase() +
                      member.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                <div className="py-4 border-t border-border mb-4">
                  <p className="text-xs text-muted-foreground">
                    Joined: {new Date(member.join_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4 text-primary" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(member.id)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMembers.length === 0 && (
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
