import axios from "axios";
import type { FinOpsData } from "@/types/finops.types";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 5000,
});

// ─── Helper: fetch full fakedata.json once ───────────────────────────────────
let _cache: FinOpsData | null = null;
async function getData(): Promise<FinOpsData> {
  if (_cache) return _cache;
  const res = await fetch("/fakedata.json");
  if (!res.ok) throw new Error("Could not load mock data");
  _cache = await res.json();
  return _cache!;
}

// ─── Helper: build a standard mock response ──────────────────────────────────
function ok(data: unknown, config: any) {
  return { status: 200, statusText: "OK", data, headers: {}, config, request: {} };
}
function notFound(path: string, config: any) {
  return { status: 404, statusText: "Not Found", data: { error: `Not found: ${path}` }, headers: {}, config, request: {} };
}
function created(data: unknown, config: any) {
  return { status: 201, statusText: "Created", data, headers: {}, config, request: {} };
}

// ─── Mock adapter (only activated when VITE_USE_MOCK=true) ───────────────────
if (import.meta.env.VITE_USE_MOCK === "true") {
  apiClient.defaults.adapter = async (config): Promise<any> => {
    try {
      const data = await getData() as any;
      await new Promise((resolve) => setTimeout(resolve, 150));

      const rawPath = (config.url || "").split("?")[0]; // strip query params
      const method = (config.method || "get").toLowerCase();

      // ── 1. Authentication ─────────────────────────────────────────────────
      if (rawPath === "/auth/login" && method === "post")
        return created({ token: "mock-jwt-token-xyz", user: data.users[0] }, config);
      if (rawPath === "/auth/logout" && method === "post")
        return ok({ message: "Logged out successfully" }, config);
      if (rawPath === "/auth/refresh-token" && method === "post")
        return created({ token: "mock-refreshed-token-abc" }, config);
      if (rawPath === "/auth/register" && method === "post")
        return created({ message: "Registration successful. Please verify your email." }, config);
      if (rawPath === "/auth/verify-email" && method === "post")
        return ok({ message: "Email verified successfully." }, config);
      if (rawPath === "/auth/reset-password" && method === "post")
        return ok({ message: "Password reset link sent to your email." }, config);

      // ── 2. Dashboard ──────────────────────────────────────────────────────
      if (rawPath === "/dashboard/summary")
        return ok(data.summary, config);
      if (rawPath === "/dashboard/spend-trend")
        return ok(data.costTrend, config);
      if (rawPath === "/dashboard/cost-by-category")
        return ok(data.costByCategory, config);
      if (rawPath === "/dashboard/top-services")
        return ok(data.topServices.slice(0, 5), config);
      if (rawPath === "/dashboard/recommendations-widget")
        return ok(data.recommendations.slice(0, 3), config);
      if (rawPath === "/dashboard/anomalies-widget")
        return ok(data.anomalies.slice(0, 3), config);
      if (rawPath === "/dashboard/reports-widget")
        return ok(data.reports, config);
      if (rawPath === "/dashboard/refresh" && method === "post")
        return ok({ message: "Dashboard data refreshed.", timestamp: new Date().toISOString() }, config);

      // ── 3. Cost Analyzer ──────────────────────────────────────────────────
      if (rawPath === "/cost-analyzer/services")
        return ok(data.topServices, config);
      if (rawPath === "/cost-analyzer/services/filter")
        return ok(data.topServices, config); // filter applied server-side in real API
      if (rawPath === "/cost-analyzer/cost-by-provider") {
        const byProvider = ["AWS", "GCP", "Azure"].map((p) => ({
          provider: p,
          cost: data.topServices.filter((s: any) => s.provider === p).reduce((acc: number, s: any) => acc + s.cost, 0),
        }));
        return ok(byProvider, config);
      }
      if (rawPath === "/cost-analyzer/cost-by-category")
        return ok(data.costByCategory, config);
      if (rawPath === "/cost-analyzer/usage-metrics")
        return ok(data.topServices.map((s: any) => ({ name: s.name, usage: s.usage, cost: s.cost })), config);
      if (rawPath === "/cost-analyzer/services/export")
        return ok({ downloadUrl: "/exports/services_export.csv", generatedAt: new Date().toISOString() }, config);
      if (rawPath === "/cost-analyzer/provider-comparison")
        return ok(["AWS", "GCP", "Azure"].map((p) => ({ provider: p, services: data.topServices.filter((s: any) => s.provider === p) })), config);

      // cost-analyzer/{service_id}
      const serviceMatch = rawPath.match(/^\/cost-analyzer\/services\/([^/]+)$/);
      if (serviceMatch) {
        const s = data.topServices.find((_: any, i: number) => `svc-${i + 1}` === serviceMatch[1]) || data.topServices[0];
        return ok(s, config);
      }

      // ── 4. Categories ─────────────────────────────────────────────────────
      if (rawPath === "/categories")
        return ok(data.costByCategory, config);

      const catMatch = rawPath.match(/^\/categories\/([^/]+)(\/trend|\/services|\/mom-change|\/export)?$/);
      if (catMatch) {
        const [, catId, sub] = catMatch;
        const cat = data.costByCategory.find((c: any) => c.name.toLowerCase() === catId.toLowerCase()) || data.costByCategory[0];
        if (!sub) return ok(cat, config);
        if (sub === "/trend") return ok(data.costTrend.map((t: any) => ({ month: t.month, value: t[cat.name.toLowerCase()] || 0 })), config);
        if (sub === "/services") return ok(data.topServices.filter((s: any) => s.name.toLowerCase().includes(cat.name.toLowerCase().slice(0, 3))), config);
        if (sub === "/mom-change") return ok({ category: cat.name, change: cat.change }, config);
        if (sub === "/export") return ok({ downloadUrl: `/exports/${catId}_export.csv` }, config);
      }

      // ── 5. Kubernetes ─────────────────────────────────────────────────────
      if (rawPath === "/kubernetes/clusters")
        return ok(data.kubernetes.clusters, config);
      if (rawPath === "/kubernetes/namespaces")
        return ok(data.kubernetes.namespaces, config);
      if (rawPath === "/kubernetes/resource-waste")
        return ok(data.kubernetes.namespaces.map((n: any) => ({ namespace: n.name, cluster: n.cluster, waste: n.waste, cost: n.cost })), config);
      if (rawPath === "/kubernetes/pods")
        return ok(data.kubernetes.namespaces.map((n: any) => ({ namespace: n.name, cpuReq: n.cpuReq, memReq: n.memReq })), config);
      if (rawPath === "/kubernetes/right-sizing")
        return ok(data.recommendations.filter((r: any) => r.category === "Kubernetes"), config);

      const k8sClusterMatch = rawPath.match(/^\/kubernetes\/clusters\/([^/]+)(\/cost-breakdown|\/efficiency|\/nodes|\/export)?$/);
      if (k8sClusterMatch) {
        const [, cId, sub] = k8sClusterMatch;
        const cluster = data.kubernetes.clusters.find((c: any) => c.name === cId) || data.kubernetes.clusters[0];
        if (!sub) return ok(cluster, config);
        if (sub === "/cost-breakdown") return ok({ cluster: cluster.name, cost: cluster.cost, breakdown: { compute: cluster.cost * 0.6, storage: cluster.cost * 0.2, network: cluster.cost * 0.2 } }, config);
        if (sub === "/efficiency") return ok({ cluster: cluster.name, efficiency: cluster.efficiency, cpuUtil: cluster.cpuUtil, memUtil: cluster.memUtil }, config);
        if (sub === "/nodes") return ok(Array.from({ length: cluster.nodes }, (_, i) => ({ id: `node-${i + 1}`, cluster: cluster.name, cpu: `${(Math.random() * 100).toFixed(1)}%`, memory: `${(Math.random() * 100).toFixed(1)}%` })), config);
        if (sub === "/export") return ok({ downloadUrl: `/exports/cluster_${cId}_export.csv` }, config);
      }

      const k8sNsMatch = rawPath.match(/^\/kubernetes\/namespaces\/([^/]+)(\/trend)?$/);
      if (k8sNsMatch) {
        const [, nsId, sub] = k8sNsMatch;
        const ns = data.kubernetes.namespaces.find((n: any) => n.name === nsId) || data.kubernetes.namespaces[0];
        if (!sub) return ok(ns, config);
        if (sub === "/trend") return ok(data.costTrend.map((t: any) => ({ month: t.month, cost: (ns.cost * (0.9 + Math.random() * 0.2)).toFixed(0) })), config);
      }

      // ── 6. Recommendations ────────────────────────────────────────────────
      if (rawPath === "/recommendations")
        return ok(data.recommendations, config);
      if (rawPath === "/recommendations/filter")
        return ok(data.recommendations, config);
      if (rawPath === "/recommendations/savings-summary")
        return ok({ totalSavings: data.recommendations.reduce((a: number, r: any) => a + r.savings, 0), open: data.recommendations.filter((r: any) => r.status === "open").length, inProgress: data.recommendations.filter((r: any) => r.status === "in_progress").length, done: data.recommendations.filter((r: any) => r.status === "done").length }, config);

      const recCatMatch = rawPath.match(/^\/recommendations\/category\/([^/]+)$/);
      if (recCatMatch) return ok(data.recommendations.filter((r: any) => r.category.toLowerCase() === recCatMatch[1].toLowerCase()), config);

      const recMatch = rawPath.match(/^\/recommendations\/([^/]+)(\/status|\/apply|\/impact|\/dismiss)?$/);
      if (recMatch) {
        const [, recId, sub] = recMatch;
        const rec = data.recommendations.find((r: any) => r.id === recId) || data.recommendations[0];
        if (!sub) return ok(rec, config);
        if (sub === "/status" && method === "put") return ok({ ...rec, status: "in_progress" }, config);
        if (sub === "/apply" && method === "post") return ok({ message: "Recommendation applied successfully.", steps: rec.steps }, config);
        if (sub === "/impact") return ok({ id: rec.id, savings: rec.savings, impact: rec.impact, effort: rec.effort }, config);
        if (sub === "/dismiss" && method === "post") return ok({ message: "Recommendation dismissed." }, config);
      }

      // ── 7. Anomalies ──────────────────────────────────────────────────────
      if (rawPath === "/anomalies")
        return ok(data.anomalies, config);
      if (rawPath === "/anomalies/filter")
        return ok(data.anomalies, config);
      if (rawPath === "/anomalies/severity")
        return ok(["Critical", "High", "Medium"].map((s) => ({ severity: s, count: data.anomalies.filter((a: any) => a.severity === s).length })), config);
      if (rawPath === "/anomalies/timeline")
        return ok(data.anomalies.map((a: any) => ({ id: a.id, service: a.service, detectedAt: a.detectedAt, severity: a.severity, spike: a.spike })), config);
      if (rawPath === "/anomalies/statistics")
        return ok({ total: data.anomalies.length, avgSpike: Math.round(data.anomalies.reduce((a: number, x: any) => a + x.spike, 0) / data.anomalies.length), bySeverity: { Critical: 1, High: 2, Medium: 2 } }, config);
      if (rawPath === "/anomalies/alerts-summary")
        return ok({ active: data.anomalies.length, acknowledged: 0, resolved: 0 }, config);

      const anomMatch = rawPath.match(/^\/anomalies\/([^/]+)(\/acknowledge|\/resolve|\/investigate)?$/);
      if (anomMatch) {
        const [, aId, sub] = anomMatch;
        const anom = data.anomalies.find((a: any) => a.id === aId) || data.anomalies[0];
        if (!sub) return ok(anom, config);
        if (sub === "/acknowledge") return ok({ ...anom, status: "acknowledged" }, config);
        if (sub === "/resolve") return ok({ ...anom, status: "resolved" }, config);
        if (sub === "/investigate") return ok({ ...anom, investigation: { steps: ["Review CloudWatch logs", "Check billing dashboard", "Notify team lead"] } }, config);
      }

      // ── 8. Reports ────────────────────────────────────────────────────────
      if (rawPath === "/reports")
        return ok(data.reports, config);
      if (rawPath === "/reports/create" && method === "post")
        return created({ id: `rpt-${Date.now()}`, message: "Report created successfully." }, config);
      if (rawPath === "/reports/schedules")
        return ok(data.reports.map((r: any) => ({ name: r.name, frequency: r.frequency, lastRun: r.lastRun })), config);

      const reportMatch = rawPath.match(/^\/reports\/([^/]+)(\/update|\/generate|\/download)?$/);
      if (reportMatch) {
        const [, rId, sub] = reportMatch;
        const report = data.reports.find((_: any, i: number) => `rpt-${i + 1}` === rId) || data.reports[0];
        if (!sub) return ok(report, config);
        if (sub === "/update" && method === "put") return ok({ ...report, updated: true }, config);
        if (sub === "/generate" && method === "post") return ok({ message: "Report generation started.", jobId: `job-${Date.now()}` }, config);
        if (sub === "/download") return ok({ downloadUrl: `/exports/${rId}_report.${report?.format?.toLowerCase() || "pdf"}` }, config);
        if (method === "delete") return ok({ message: `Report ${rId} deleted.` }, config);
      }

      // ── 9. Virtual Tags ───────────────────────────────────────────────────
      if (rawPath === "/virtual-tags")
        return ok(data.virtualTags, config);
      if (rawPath === "/virtual-tags/coverage")
        return ok({ covered: data.virtualTags.length, total: data.virtualTags.length + 4, percentage: Math.round((data.virtualTags.length / (data.virtualTags.length + 4)) * 100) }, config);
      if (rawPath === "/virtual-tags/mappings")
        return ok(data.virtualTags.map((t: any) => ({ from: `${t.provider}:${t.rawKey}=${t.rawValue}`, to: `${t.normalizedKey}=${t.normalizedValue}` })), config);
      if (rawPath === "/virtual-tags/rules/create" && method === "post")
        return created({ id: `rule-${Date.now()}`, message: "Tag rule created." }, config);
      if (rawPath === "/virtual-tags/mappings/create" && method === "post")
        return created({ id: `map-${Date.now()}`, message: "Tag mapping created." }, config);

      const vtRuleMatch = rawPath.match(/^\/virtual-tags\/rules\/([^/]+)(\/update)?$/);
      if (vtRuleMatch) {
        const [, rId, sub] = vtRuleMatch;
        if (sub === "/update" && method === "put") return ok({ id: rId, message: "Rule updated." }, config);
        if (method === "delete") return ok({ message: `Rule ${rId} deleted.` }, config);
      }

      // ── 10. Cost Allocation ───────────────────────────────────────────────
      if (rawPath === "/cost-allocation/teams")
        return ok(data.teams, config);
      if (rawPath === "/cost-allocation/rules/create" && method === "post")
        return created({ id: `alloc-rule-${Date.now()}`, message: "Allocation rule created." }, config);
      if (rawPath === "/cost-allocation/treemap")
        return ok(data.teams.map((t: any) => ({ name: t.name, value: t.actual, department: t.department })), config);
      if (rawPath === "/cost-allocation/chargeback")
        return ok(data.teams.map((t: any) => ({ team: t.name, chargeback: t.actual })), config);
      if (rawPath === "/cost-allocation/variance-analysis")
        return ok(data.teams.map((t: any) => ({ team: t.name, allocated: t.allocated, actual: t.actual, variance: t.variance })), config);

      const allocRuleMatch = rawPath.match(/^\/cost-allocation\/rules\/([^/]+)\/update$/);
      if (allocRuleMatch && method === "put") return ok({ id: allocRuleMatch[1], message: "Rule updated." }, config);

      const teamMatch = rawPath.match(/^\/cost-allocation\/teams\/([^/]+)(\/breakdown)?$/);
      if (teamMatch) {
        const [, tId, sub] = teamMatch;
        const team = data.teams.find((t: any) => t.name.toLowerCase().replace(/ /g, "-") === tId.toLowerCase()) || data.teams[0];
        if (!sub) return ok(team, config);
        if (sub === "/breakdown") return ok({ team: team.name, breakdown: { compute: team.actual * 0.5, storage: team.actual * 0.2, network: team.actual * 0.15, kubernetes: team.actual * 0.1, database: team.actual * 0.05 } }, config);
      }

      // ── 11. Unit Economics ────────────────────────────────────────────────
      if (rawPath === "/unit-economics/summary") {
        const last = data.unitEconomics[data.unitEconomics.length - 1];
        return ok(last, config);
      }
      if (rawPath === "/unit-economics/cost-per-user")
        return ok(data.unitEconomics.map((u: any) => ({ month: u.month, value: u.costPerUser })), config);
      if (rawPath === "/unit-economics/cost-per-transaction")
        return ok(data.unitEconomics.map((u: any) => ({ month: u.month, value: u.costPerTransaction })), config);
      if (rawPath === "/unit-economics/gross-margin")
        return ok(data.unitEconomics.map((u: any) => ({ month: u.month, margin: u.margin, revenue: u.revenue })), config);
      if (rawPath === "/unit-economics/benchmark")
        return ok({ industry: { costPerUser: 3.10, grossMargin: 72.0 }, yours: data.unitEconomics[data.unitEconomics.length - 1] }, config);
      if (rawPath === "/unit-economics/trends")
        return ok(data.unitEconomics, config);

      // ── 12. Forecasting ───────────────────────────────────────────────────
      if (rawPath === "/forecasting/forecast")
        return ok(data.forecasting.forecast, config);
      if (rawPath === "/forecasting/drivers")
        return ok(data.forecasting.drivers, config);
      if (rawPath === "/forecasting/accuracy")
        return ok({ mape: 4.2, rmse: 8900, lastEvaluated: "2026-03-01" }, config);
      if (rawPath === "/forecasting/historical-accuracy")
        return ok(data.forecasting.historical, config);
      if (rawPath === "/forecasting/what-if" && method === "post")
        return ok({ scenario: "custom", projectedSpend: 295000, savings: 15000 }, config);

      const forecastScenarioMatch = rawPath.match(/^\/forecasting\/forecast\/([^/]+)$/);
      if (forecastScenarioMatch) {
        const scenario = forecastScenarioMatch[1] as "base" | "optimistic" | "pessimistic";
        return ok(data.forecasting.forecast[scenario] || data.forecasting.forecast.base, config);
      }

      const driverUpdateMatch = rawPath.match(/^\/forecasting\/drivers\/([^/]+)\/update$/);
      if (driverUpdateMatch && method === "put") return ok({ id: driverUpdateMatch[1], message: "Driver updated." }, config);

      // ── 13. Budgeting ─────────────────────────────────────────────────────
      if (rawPath === "/budgets")
        return ok(data.budgets, config);
      if (rawPath === "/budgets/create" && method === "post")
        return created({ id: `bgt-${Date.now()}`, message: "Budget created." }, config);
      if (rawPath === "/budgets/status")
        return ok(data.budgets.map((b: any) => ({ name: b.name, status: b.status })), config);
      if (rawPath === "/budgets/daily-burn-rate")
        return ok(data.budgets.map((b: any) => ({ name: b.name, dailyBurnRate: (b.spent / 30).toFixed(2) })), config);

      const budgetMatch = rawPath.match(/^\/budgets\/([^/]+)(\/update|\/alerts)?$/);
      if (budgetMatch) {
        const [, bId, sub] = budgetMatch;
        const budget = data.budgets.find((_: any, i: number) => `bgt-${i + 1}` === bId) || data.budgets[0];
        if (!sub) return ok(budget, config);
        if (sub === "/update" && method === "put") return ok({ ...budget, updated: true }, config);
        if (sub === "/alerts" && method === "post") return created({ message: `Alert set for budget ${bId}.` }, config);
        if (method === "delete") return ok({ message: `Budget ${bId} deleted.` }, config);
      }

      // ── 14. Payment Receipts ──────────────────────────────────────────────
      if (rawPath === "/payment-receipts")
        return ok(data.paymentReceipts, config);
      if (rawPath === "/payment-receipts/summary")
        return ok({ total: data.paymentReceipts.reduce((a: number, r: any) => a + r.amount, 0), paid: data.paymentReceipts.filter((r: any) => r.status === "paid").length, pending: data.paymentReceipts.filter((r: any) => r.status === "pending").length }, config);
      if (rawPath === "/payment-receipts/upload" && method === "post")
        return created({ id: `rcpt-${Date.now()}`, message: "Receipt uploaded." }, config);

      const receiptVendorMatch = rawPath.match(/^\/payment-receipts\/vendor\/([^/]+)$/);
      if (receiptVendorMatch) return ok(data.paymentReceipts.filter((r: any) => r.vendor.toLowerCase() === receiptVendorMatch[1].toLowerCase()), config);

      const receiptMatch = rawPath.match(/^\/payment-receipts\/([^/]+)(\/download)?$/);
      if (receiptMatch) {
        const [, rId, sub] = receiptMatch;
        const receipt = data.paymentReceipts.find((r: any) => r.id === rId) || data.paymentReceipts[0];
        if (!sub) return ok(receipt, config);
        if (sub === "/download") return ok({ downloadUrl: receipt?.downloadUrl || `/receipts/${rId}.pdf` }, config);
      }

      // ── 15. Tenant Management ─────────────────────────────────────────────
      if (rawPath === "/tenants")
        return ok(data.tenants, config);
      if (rawPath === "/tenants/create" && method === "post")
        return created({ id: `ten-${Date.now()}`, message: "Tenant created." }, config);

      const tenantMatch = rawPath.match(/^\/tenants\/([^/]+)(\/update|\/users)?$/);
      if (tenantMatch) {
        const [, tId, sub] = tenantMatch;
        const tenant = data.tenants.find((t: any) => t.id === tId) || data.tenants[0];
        if (!sub) return ok(tenant, config);
        if (sub === "/update" && method === "put") return ok({ ...tenant, updated: true }, config);
        if (sub === "/users") return ok(data.users.slice(0, tenant?.usersCount || 2), config);
        if (method === "delete") return ok({ message: `Tenant ${tId} deleted.` }, config);
      }

      // ── 16. User Management ───────────────────────────────────────────────
      if (rawPath === "/users")
        return ok(data.users, config);
      if (rawPath === "/users/create" && method === "post")
        return created({ id: `usr-${Date.now()}`, message: "User created." }, config);

      const userMatch = rawPath.match(/^\/users\/([^/]+)(\/update|\/role|\/change-password|\/activity)?$/);
      if (userMatch) {
        const [, uId, sub] = userMatch;
        const user = data.users.find((u: any) => u.id === uId) || data.users[0];
        if (!sub) return ok(user, config);
        if (sub === "/update" && method === "put") return ok({ ...user, updated: true }, config);
        if (sub === "/role" && method === "put") return ok({ ...user, role: "manager" }, config);
        if (sub === "/change-password" && method === "post") return ok({ message: "Password changed successfully." }, config);
        if (sub === "/activity") return ok([{ action: "login", timestamp: "2026-03-24T08:00:00Z" }, { action: "viewed dashboard", timestamp: "2026-03-24T08:01:00Z" }], config);
        if (method === "delete") return ok({ message: `User ${uId} deleted.` }, config);
      }

      // ── Fallback ──────────────────────────────────────────────────────────
      return notFound(rawPath, config);

    } catch (err: any) {
      return { status: 500, statusText: "Internal Server Error", data: { error: err.message }, headers: {}, config, request: {} };
    }
  };
}
