import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-50 mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <p className="text-lg text-muted-foreground">Page not found</p>
          </div>

          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <Link to="/" className="btn-primary inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}
