import Layout from "@/components/Layout";
import { BookOpen } from "lucide-react";

export default function Documentation() {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use LibraryX and integrate it into your applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card-elevated p-6">
              <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Learn the basics and set up your first project
              </p>
            </div>
            <div className="card-elevated p-6">
              <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-sm text-muted-foreground">
                Complete documentation of all available APIs
              </p>
            </div>
            <div className="card-elevated p-6">
              <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Examples</h3>
              <p className="text-sm text-muted-foreground">
                Real-world examples and use cases
              </p>
            </div>
          </div>

          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              This documentation section is currently being developed. Continue prompting to
              add detailed guides, API references, and code examples.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
