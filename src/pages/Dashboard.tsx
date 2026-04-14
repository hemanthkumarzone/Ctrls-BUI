import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { KPICard } from "@/components/ui/KPICard";
import { ProviderBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatPercent } from "@/utils/format";
import { DollarSign, TrendingUp, Target, Lightbulb, AlertTriangle } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Link } from "react-router-dom";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

export default function Dashboard() {
  const { data, loading } = useFinOpsData();
  if (loading || !data) return <PageSkeleton />;

  const { summary, costTrend, costByCategory, topServices } = data;
  const budgetPercent = Math.round((summary.totalSpend / summary.budgetLimit) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Total Spend" value={formatCurrency(summary.totalSpend)} change={summary.monthOverMonthChange} icon={DollarSign} />
        <KPICard title="Forecasted" value={formatCurrency(summary.forecastedSpend)} icon={TrendingUp} subtitle={`Budget: ${formatCurrency(summary.budgetLimit)}`}>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>{budgetPercent}% of budget</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
            </div>
          </div>
        </KPICard>
        <KPICard title="Savings Opportunity" value={formatCurrency(summary.savingsOpportunity)} icon={Lightbulb} />
        <KPICard title="MoM Change" value={formatPercent(summary.monthOverMonthChange)} change={summary.monthOverMonthChange} icon={TrendingUp} />
        <KPICard title="Anomalies" value={String(summary.anomaliesDetected)} icon={AlertTriangle} subtitle="Active alerts" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="finops-card col-span-2 p-5">
          <h3 className="mb-4 text-sm font-semibold">Spend Trend (12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              {["compute", "storage", "network", "kubernetes", "database"].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stackId="1" fill={COLORS[i]} stroke={COLORS[i]} fillOpacity={0.6} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="finops-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Cost by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={costByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {costByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Services */}
      <div className="finops-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Top 5 Services</h3>
          <Link to="/cost-analyzer" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Service</th>
                <th className="pb-2 font-medium">Provider</th>
                <th className="pb-2 font-medium text-right">Cost</th>
                <th className="pb-2 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody>
              {topServices.slice(0, 5).map((s) => (
                <tr key={s.name} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3"><ProviderBadge provider={s.provider} /></td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(s.cost)}</td>
                  <td className={`py-3 text-right text-xs font-medium ${s.trend > 0 ? "trend-up" : "trend-down"}`}>{formatPercent(s.trend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { to: "/recommendations", label: "Recommendations", desc: `${formatCurrency(summary.savingsOpportunity)} in savings`, icon: Lightbulb },
          { to: "/anomalies", label: "Anomalies", desc: `${summary.anomaliesDetected} active alerts`, icon: AlertTriangle },
          { to: "/reports", label: "Reports", desc: "View scheduled reports", icon: Target },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="finops-card-hover flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3"><a.icon size={20} className="text-primary" /></div>
            <div>
              <p className="font-semibold">{a.label}</p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
