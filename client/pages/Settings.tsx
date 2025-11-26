import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Bell, Database, Loader2 } from "lucide-react";
import {
  LibrarySettings,
  getSettings,
  updateSettings,
} from "@shared/api";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Partial<LibrarySettings>>({
    library_name: "",
    email: "",
    phone: "",
    address: "",
    borrow_limit: 5,
    borrow_duration_days: 14,
    late_fee_per_day: 0.5,
    enable_notifications: true,
    enable_fine: true,
  });

  // Fetch settings
  const { data: librarySettings, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<LibrarySettings>) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  // Update local state when library settings are loaded
  useEffect(() => {
    if (librarySettings) {
      setSettings({
        library_name: librarySettings.library_name,
        email: librarySettings.email,
        phone: librarySettings.phone,
        address: librarySettings.address,
        borrow_limit: librarySettings.borrow_limit,
        borrow_duration_days: librarySettings.borrow_duration_days,
        late_fee_per_day: librarySettings.late_fee_per_day,
        enable_notifications: librarySettings.enable_notifications,
        enable_fine: librarySettings.enable_fine,
      });
    }
  }, [librarySettings]);

  const handleInputChange = (
    key: keyof LibrarySettings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load settings</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Loading settings...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage library configuration and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "general"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("borrowing")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "borrowing"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Borrowing
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "notifications"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Notifications
          </button>
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="card-hover p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Library Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Library Name
                  </label>
                  <input
                    type="text"
                    value={settings.library_name || ""}
                    onChange={(e) =>
                      handleInputChange("library_name", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <textarea
                    value={settings.address || ""}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Borrowing Settings */}
        {activeTab === "borrowing" && (
          <div className="card-hover p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Borrowing Policies</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Books per Member
                    </label>
                    <input
                      type="number"
                      value={settings.borrow_limit || 5}
                      onChange={(e) =>
                        handleInputChange(
                          "borrow_limit",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Borrow Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.borrow_duration_days || 14}
                      onChange={(e) =>
                        handleInputChange(
                          "borrow_duration_days",
                          parseInt(e.target.value)
                        )
                      }
                      min="1"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Late Fee per Day ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.late_fee_per_day || 0.5}
                      onChange={(e) =>
                        handleInputChange(
                          "late_fee_per_day",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enable_fine || false}
                      onChange={(e) =>
                        handleInputChange("enable_fine", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <span className="font-medium text-foreground">
                      Enable Late Fees
                    </span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2 ml-7">
                    Charge members for overdue books
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="card-hover p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enable_notifications || false}
                    onChange={(e) =>
                      handleInputChange("enable_notifications", e.target.checked)
                    }
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      Email Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Send email reminders for due dates and overdue books
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      SMS Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Send SMS reminders for book due dates (Coming soon)
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">Admin Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for overdue books and system events (Coming soon)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Settings
          </button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
