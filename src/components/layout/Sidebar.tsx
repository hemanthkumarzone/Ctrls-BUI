import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  LayoutDashboard, BarChart3, Layers, Ship, Lightbulb, AlertTriangle,
  FileText, Tag, Users, TrendingUp, CloudLightning, Wallet, ChevronLeft, ChevronRight, Receipt,CreditCard, Bot, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/context/SubscriptionContext";
import { Lock } from "lucide-react";
const navItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    path: "/agent-ops",
    label: "Agent Ops",
    icon: Bot,
  },

  {
    path: "/cost-analyzer",
    label: "Cost Analyzer",
    icon: BarChart3,
  },

  {
    path: "/categories",
    label: "Categories",
    icon: Layers,
  },

  {
    path: "/kubernetes",
    label: "Kubernetes",
    icon: Ship,
  },

  {
    path: "/recommendations",
    label: "Recommendations",
    icon: Lightbulb,
  },

  {
    path: "/anomalies",
    label: "Anomalies",
    icon: AlertTriangle,
  },

  {
    path: "/reports",
    label: "Reports",
    icon: FileText,
  },

  {
    path: "/virtual-tags",
    label: "Virtual Tags",
    icon: Tag,
  },

  {
    path: "/cost-allocation",
    label: "Cost Allocation",
    icon: Users,
    requiredPlan: "platform-plus",
  },

  {
    path: "/unit-economics",
    label: "Unit Economics",
    icon: TrendingUp,
    requiredPlan: "platform",
  },

  {
    path: "/forecasting",
    label: "Forecasting",
    icon: CloudLightning,
    requiredPlan: "platform-plus",
  },

  {
    path: "/budgeting",
    label: "Budgeting",
    icon: Wallet,
    requiredPlan: "platform",
  },

  {
    path: "/plans-billing",
    label: "Plans & Billing",
    icon: CreditCard,
  },

  {
    path: "/payment-receipts",
    label: "Payment Receipts",
    icon: Receipt,
  },
];
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const location = useLocation();
  const { selectedPlan } = useSubscription();
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] text-sidebar-foreground shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <LayoutDashboard size={16} />
            </div>
            <span className="text-[15px] font-semibold tracking-[0.2em] text-primary uppercase">CtrlS</span>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <LayoutDashboard size={16} />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-primary/15 hover:text-primary"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked =
  item.requiredPlan &&
  item.requiredPlan !== selectedPlan;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(124,255,0,0.22)]"
                  : isLocked
                    ? "cursor-not-allowed opacity-40"
                    : "text-sidebar-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
              {
  isLocked && (
    <Lock
      size={14}
      className="ml-auto text-lime-400"
    />
  )
}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
