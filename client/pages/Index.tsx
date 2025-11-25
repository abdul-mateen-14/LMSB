import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Code2,
  Database,
  Zap,
  GitBranch,
  ArrowRight,
  Play,
  Cpu,
} from "lucide-react";

interface Library {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  language: string;
  updated: string;
  color: string;
}

const sampleLibraries: Library[] = [
  {
    id: "1",
    name: "Data Structures",
    description:
      "Core C++ data structure implementations including vectors, stacks, queues, and linked lists.",
    itemCount: 156,
    language: "C++",
    updated: "2 hours ago",
    color: "from-purple-600 to-purple-400",
  },
  {
    id: "2",
    name: "Algorithms",
    description:
      "High-performance algorithm implementations for sorting, searching, and graph operations.",
    itemCount: 89,
    language: "C++",
    updated: "5 hours ago",
    color: "from-blue-600 to-blue-400",
  },
  {
    id: "3",
    name: "Utilities",
    description:
      "Helper functions and utility classes for memory management and resource handling.",
    itemCount: 42,
    language: "C++",
    updated: "1 day ago",
    color: "from-cyan-600 to-cyan-400",
  },
  {
    id: "4",
    name: "Testing Suite",
    description:
      "Comprehensive test cases and benchmarking tools for validating library performance.",
    itemCount: 234,
    language: "C++",
    updated: "3 hours ago",
    color: "from-emerald-600 to-emerald-400",
  },
  {
    id: "5",
    name: "Graphics",
    description:
      "Matrix and vector operations optimized for 3D graphics and computational geometry.",
    itemCount: 67,
    language: "C++",
    updated: "1 week ago",
    color: "from-orange-600 to-orange-400",
  },
  {
    id: "6",
    name: "Networking",
    description:
      "Socket handling and protocol implementations for inter-process communication.",
    itemCount: 98,
    language: "C++",
    updated: "4 days ago",
    color: "from-pink-600 to-pink-400",
  },
];

const features = [
  {
    icon: Database,
    title: "Dynamic Arrays",
    description:
      "Flexible, high-performance array structures that grow and adapt to your needs",
  },
  {
    icon: Cpu,
    title: "C++ Backend",
    description:
      "Blazing-fast implementation with direct memory access and zero-copy operations",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description:
      "Live updates across all connected clients with instant synchronization",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Track changes, manage versions, and collaborate seamlessly",
  },
];

export default function Index() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for visual effect
    const timer = setTimeout(() => {
      setLibraries(sampleLibraries);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm font-medium text-purple-600">
                Introducing LibraryX
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-gradient leading-tight">
              Dynamic Array-Based Library System
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Build, manage, and deploy powerful C++ libraries with our
              intelligent array system. Real-time collaboration, version control,
              and lightning-fast performance all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                <Play className="w-5 h-5" />
                Get Started Now
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors font-medium">
                <Code2 className="w-5 h-5" />
                View Documentation
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  1M+
                </div>
                <p className="text-sm text-muted-foreground">Arrays Deployed</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  99.9%
                </div>
                <p className="text-sm text-muted-foreground">Uptime SLA</p>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  10ms
                </div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build, deploy, and maintain production-grade
              array-based libraries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-lg border border-border/50 bg-card hover:border-purple-500/30 transition-all hover:shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-500/20 group-hover:from-purple-600/30 group-hover:to-blue-500/30 transition-all mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Libraries Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured Libraries
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore and browse our curated collection of production-ready
                C++ libraries
              </p>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-lg bg-muted/50 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries.map((lib) => (
                <div
                  key={lib.id}
                  className="group card-elevated hover:border-purple-500/30 cursor-pointer p-6 transition-all"
                >
                  <div className={`w-full h-2 rounded-full bg-gradient-to-r ${lib.color} mb-4`} />

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {lib.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {lib.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-semibold text-foreground">
                        {lib.itemCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Language:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-semibold text-foreground">
                          {lib.language}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="text-muted-foreground text-xs">
                        {lib.updated}
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full py-2 px-4 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Browse Array
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-500/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers building with LibraryX today. Deploy
              your first array-based library in minutes.
            </p>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              Start Building
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
