import Layout from "@/components/Layout";
import { useState } from "react";
import { Save, Bell, Lock, Users, Database } from "lucide-react";

interface Settings {
  libraryName: string;
  email: string;
  phone: string;
  address: string;
  borrowLimit: number;
  borrowDays: number;
  lateFeePerDay: number;
  enableNotifications: boolean;
  enableFine: boolean;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<Settings>({
    libraryName: "Central Library",
    email: "admin@library.com",
    phone: "+1-555-0100",
    address: "123 Library St, City, State 12345",
    borrowLimit: 5,
    borrowDays: 14,
    lateFeePerDay: 0.5,
    enableNotifications: true,
    enableFine: true,
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleInputChange = (
    key: keyof Settings,
    value: string | number | boolean,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

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
                    value={settings.libraryName}
                    onChange={(e) =>
                      handleInputChange("libraryName", e.target.value)
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
                      value={settings.email}
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
                      value={settings.phone}
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
                    value={settings.address}
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
                      value={settings.borrowLimit}
                      onChange={(e) =>
                        handleInputChange(
                          "borrowLimit",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Borrow Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.borrowDays}
                      onChange={(e) =>
                        handleInputChange(
                          "borrowDays",
                          parseInt(e.target.value),
                        )
                      }
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
                      value={settings.lateFeePerDay}
                      onChange={(e) =>
                        handleInputChange(
                          "lateFeePerDay",
                          parseFloat(e.target.value),
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableFine}
                      onChange={(e) =>
                        handleInputChange("enableFine", e.target.checked)
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
                    checked={settings.enableNotifications}
                    onChange={(e) =>
                      handleInputChange("enableNotifications", e.target.checked)
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
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      SMS Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Send SMS reminders for book due dates
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-border cursor-pointer"
                  />
                  <div>
                    <p className="font-medium text-foreground">Admin Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for overdue books and system events
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
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
