import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom"; // ✅ ADD THIS

export function Layout() {
  const { sidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
      <Sidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}>
        <Header />

        {/* ✅ THIS IS IMPORTANT */}
        <main className="animate-fade-in p-6 bg-[radial-gradient(circle_at_top_left,_rgba(124,255,0,0.08),_transparent_35%)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}