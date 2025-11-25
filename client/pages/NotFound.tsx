import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="text-6xl sm:text-8xl font-bold text-gradient mb-4">
              404
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
              The page you're looking for doesn't exist or this feature is still
              being developed. Continue prompting to build out this page.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
}
