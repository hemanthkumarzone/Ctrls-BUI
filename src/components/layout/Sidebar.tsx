import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  LayoutDashboard, BarChart3, Layers, Ship, Lightbulb, AlertTriangle,
  FileText, Tag, Users, TrendingUp, CloudLightning, Wallet, ChevronLeft, ChevronRight, Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/cost-analyzer", label: "Cost Analyzer", icon: BarChart3 },
  { path: "/categories", label: "Categories", icon: Layers },
  { path: "/kubernetes", label: "Kubernetes", icon: Ship },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { path: "/anomalies", label: "Anomalies", icon: AlertTriangle },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/virtual-tags", label: "Virtual Tags", icon: Tag },
  { path: "/cost-allocation", label: "Cost Allocation", icon: Users },
  { path: "/unit-economics", label: "Unit Economics", icon: TrendingUp },
  { path: "/forecasting", label: "Forecasting", icon: CloudLightning },
  { path: "/budgeting", label: "Budgeting", icon: Wallet },
  { path: "/payment-receipts", label: "Payment Receipts", icon: Receipt },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {sidebarOpen && (
          <span className="text-lg font-bold text-primary">FinOps AI</span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "border-l-2 border-primary bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
