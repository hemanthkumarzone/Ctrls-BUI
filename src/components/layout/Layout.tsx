import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header />
        <main className="animate-fade-in p-6">{children}</main>
      </div>
    </div>
  );
}
