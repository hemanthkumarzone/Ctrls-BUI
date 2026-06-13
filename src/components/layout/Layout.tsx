import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom"; // ✅ ADD THIS

export function Layout() {
  const { sidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header />

        {/* ✅ THIS IS IMPORTANT */}
        <main className="animate-fade-in p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}