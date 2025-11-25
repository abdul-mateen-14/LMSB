import Layout from "@/components/Layout";
import { Search, Filter, Plus } from "lucide-react";

export default function Libraries() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">All Libraries</h1>
            <p className="text-lg text-muted-foreground">
              Browse, search, and manage all available array-based libraries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search libraries..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background hover:border-border/80 focus:border-purple-500/50 focus:outline-none transition-colors"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg transition-all">
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>

          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              This page is currently being developed. Continue prompting to fill in the
              complete libraries browsing interface.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
