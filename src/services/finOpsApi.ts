import { apiClient } from "./apiClient";
import type {
  Summary, CostCategory, CostTrendItem, TopService,
  Recommendation, Anomaly, Team, UnitEconomicsItem,
  Budget, VirtualTag, Report, FinOpsData
} from "@/types/finops.types";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }).then((r) => r.data),
  logout: () => apiClient.post("/auth/logout").then((r) => r.data),
  refreshToken: () => apiClient.post("/auth/refresh-token").then((r) => r.data),
  register: (payload: { email: string; password: string; name: string }) =>
    apiClient.post("/auth/register", payload).then((r) => r.data),
  verifyEmail: (token: string) =>
    apiClient.post("/auth/verify-email", { token }).then((r) => r.data),
  resetPassword: (email: string) =>
    apiClient.post("/auth/reset-password", { email }).then((r) => r.data),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => apiClient.get<Summary>("/dashboard/summary").then((r) => r.data),
  getSpendTrend: () => apiClient.get<CostTrendItem[]>("/dashboard/spend-trend").then((r) => r.data),
  getCostByCategory: () => apiClient.get<CostCategory[]>("/dashboard/cost-by-category").then((r) => r.data),
  getTopServices: () => apiClient.get<TopService[]>("/dashboard/top-services").then((r) => r.data),
  getRecommendationsWidget: () => apiClient.get<Recommendation[]>("/dashboard/recommendations-widget").then((r) => r.data),
  getAnomaliesWidget: () => apiClient.get<Anomaly[]>("/dashboard/anomalies-widget").then((r) => r.data),
  getReportsWidget: () => apiClient.get<Report[]>("/dashboard/reports-widget").then((r) => r.data),
  refresh: () => apiClient.post("/dashboard/refresh").then((r) => r.data),
};

// ─── Cost Analyzer ────────────────────────────────────────────────────────────
export const costAnalyzerApi = {
  getServices: () => apiClient.get<TopService[]>("/cost-analyzer/services").then((r) => r.data),
  filterServices: (params?: Record<string, string>) =>
    apiClient.get<TopService[]>("/cost-analyzer/services/filter", { params }).then((r) => r.data),
  getServiceById: (id: string) => apiClient.get<TopService>(`/cost-analyzer/services/${id}`).then((r) => r.data),
  getCostByProvider: () => apiClient.get("/cost-analyzer/cost-by-provider").then((r) => r.data),
  getCostByCategory: () => apiClient.get<CostCategory[]>("/cost-analyzer/cost-by-category").then((r) => r.data),
  getUsageMetrics: () => apiClient.get("/cost-analyzer/usage-metrics").then((r) => r.data),
  exportServices: () => apiClient.get("/cost-analyzer/services/export").then((r) => r.data),
  getProviderComparison: () => apiClient.get("/cost-analyzer/provider-comparison").then((r) => r.data),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => apiClient.get<CostCategory[]>("/categories").then((r) => r.data),
  getById: (id: string) => apiClient.get<CostCategory>(`/categories/${id}`).then((r) => r.data),
  getTrend: (id: string) => apiClient.get(`/categories/${id}/trend`).then((r) => r.data),
  getServices: (id: string) => apiClient.get<TopService[]>(`/categories/${id}/services`).then((r) => r.data),
  getMomChange: (id: string) => apiClient.get(`/categories/${id}/mom-change`).then((r) => r.data),
  export: (id: string) => apiClient.get(`/categories/${id}/export`).then((r) => r.data),
};

// ─── Kubernetes ───────────────────────────────────────────────────────────────
export const kubernetesApi = {
  getClusters: () => apiClient.get<FinOpsData["kubernetes"]["clusters"]>("/kubernetes/clusters").then((r) => r.data),
  getClusterById: (id: string) => apiClient.get(`/kubernetes/clusters/${id}`).then((r) => r.data),
  getClusterCostBreakdown: (id: string) => apiClient.get(`/kubernetes/clusters/${id}/cost-breakdown`).then((r) => r.data),
  getNamespaces: () => apiClient.get<FinOpsData["kubernetes"]["namespaces"]>("/kubernetes/namespaces").then((r) => r.data),
  getNamespaceById: (id: string) => apiClient.get(`/kubernetes/namespaces/${id}`).then((r) => r.data),
  getResourceWaste: () => apiClient.get("/kubernetes/resource-waste").then((r) => r.data),
  getClusterEfficiency: (id: string) => apiClient.get(`/kubernetes/clusters/${id}/efficiency`).then((r) => r.data),
  getPods: () => apiClient.get("/kubernetes/pods").then((r) => r.data),
  getNamespaceTrend: (id: string) => apiClient.get(`/kubernetes/namespaces/${id}/trend`).then((r) => r.data),
  getClusterNodes: (id: string) => apiClient.get(`/kubernetes/clusters/${id}/nodes`).then((r) => r.data),
  exportCluster: (id: string) => apiClient.get(`/kubernetes/clusters/${id}/export`).then((r) => r.data),
  getRightSizing: () => apiClient.get("/kubernetes/right-sizing").then((r) => r.data),
};

// ─── Recommendations ──────────────────────────────────────────────────────────
export const recommendationsApi = {
  getAll: () => apiClient.get<Recommendation[]>("/recommendations").then((r) => r.data),
  getById: (id: string) => apiClient.get<Recommendation>(`/recommendations/${id}`).then((r) => r.data),
  filter: (params?: Record<string, string>) =>
    apiClient.get<Recommendation[]>("/recommendations/filter", { params }).then((r) => r.data),
  getByCategory: (category: string) =>
    apiClient.get<Recommendation[]>(`/recommendations/category/${category}`).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    apiClient.put(`/recommendations/${id}/status`, { status }).then((r) => r.data),
  apply: (id: string) => apiClient.post(`/recommendations/${id}/apply`).then((r) => r.data),
  getImpact: (id: string) => apiClient.get(`/recommendations/${id}/impact`).then((r) => r.data),
  dismiss: (id: string) => apiClient.post(`/recommendations/${id}/dismiss`).then((r) => r.data),
  getSavingsSummary: () => apiClient.get("/recommendations/savings-summary").then((r) => r.data),
};

// ─── Anomalies ────────────────────────────────────────────────────────────────
export const anomaliesApi = {
  getAll: () => apiClient.get<Anomaly[]>("/anomalies").then((r) => r.data),
  getById: (id: string) => apiClient.get<Anomaly>(`/anomalies/${id}`).then((r) => r.data),
  filter: (params?: Record<string, string>) =>
    apiClient.get<Anomaly[]>("/anomalies/filter", { params }).then((r) => r.data),
  getSeverity: () => apiClient.get("/anomalies/severity").then((r) => r.data),
  acknowledge: (id: string) => apiClient.put(`/anomalies/${id}/acknowledge`).then((r) => r.data),
  resolve: (id: string) => apiClient.put(`/anomalies/${id}/resolve`).then((r) => r.data),
  investigate: (id: string) => apiClient.get(`/anomalies/${id}/investigate`).then((r) => r.data),
  getTimeline: () => apiClient.get("/anomalies/timeline").then((r) => r.data),
  getStatistics: () => apiClient.get("/anomalies/statistics").then((r) => r.data),
  getAlertsSummary: () => apiClient.get("/anomalies/alerts-summary").then((r) => r.data),
};

// ─── Reports ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  getAll: () => apiClient.get<Report[]>("/reports").then((r) => r.data),
  getById: (id: string) => apiClient.get<Report>(`/reports/${id}`).then((r) => r.data),
  create: (payload: Partial<Report>) => apiClient.post("/reports/create", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Report>) =>
    apiClient.put(`/reports/${id}/update`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/reports/${id}`).then((r) => r.data),
  generate: (id: string) => apiClient.post(`/reports/${id}/generate`).then((r) => r.data),
  download: (id: string) => apiClient.get(`/reports/${id}/download`).then((r) => r.data),
  getSchedules: () => apiClient.get("/reports/schedules").then((r) => r.data),
};

// ─── Virtual Tags ─────────────────────────────────────────────────────────────
export const virtualTagsApi = {
  getAll: () => apiClient.get<VirtualTag[]>("/virtual-tags").then((r) => r.data),
  getCoverage: () => apiClient.get("/virtual-tags/coverage").then((r) => r.data),
  createRule: (payload: object) => apiClient.post("/virtual-tags/rules/create", payload).then((r) => r.data),
  updateRule: (id: string, payload: object) =>
    apiClient.put(`/virtual-tags/rules/${id}/update`, payload).then((r) => r.data),
  deleteRule: (id: string) => apiClient.delete(`/virtual-tags/rules/${id}`).then((r) => r.data),
  getMappings: () => apiClient.get("/virtual-tags/mappings").then((r) => r.data),
  createMapping: (payload: object) => apiClient.post("/virtual-tags/mappings/create", payload).then((r) => r.data),
};

// ─── Cost Allocation ──────────────────────────────────────────────────────────
export const costAllocationApi = {
  getTeams: () => apiClient.get<Team[]>("/cost-allocation/teams").then((r) => r.data),
  getTeamById: (id: string) => apiClient.get<Team>(`/cost-allocation/teams/${id}`).then((r) => r.data),
  getTeamBreakdown: (id: string) => apiClient.get(`/cost-allocation/teams/${id}/breakdown`).then((r) => r.data),
  createRule: (payload: object) => apiClient.post("/cost-allocation/rules/create", payload).then((r) => r.data),
  updateRule: (id: string, payload: object) =>
    apiClient.put(`/cost-allocation/rules/${id}/update`, payload).then((r) => r.data),
  getTreemap: () => apiClient.get("/cost-allocation/treemap").then((r) => r.data),
  getChargeback: () => apiClient.get("/cost-allocation/chargeback").then((r) => r.data),
  getVarianceAnalysis: () => apiClient.get("/cost-allocation/variance-analysis").then((r) => r.data),
};

// ─── Unit Economics ───────────────────────────────────────────────────────────
export const unitEconomicsApi = {
  getSummary: () => apiClient.get<UnitEconomicsItem>("/unit-economics/summary").then((r) => r.data),
  getCostPerUser: () => apiClient.get("/unit-economics/cost-per-user").then((r) => r.data),
  getCostPerTransaction: () => apiClient.get("/unit-economics/cost-per-transaction").then((r) => r.data),
  getGrossMargin: () => apiClient.get("/unit-economics/gross-margin").then((r) => r.data),
  getBenchmark: () => apiClient.get("/unit-economics/benchmark").then((r) => r.data),
  getTrends: () => apiClient.get<UnitEconomicsItem[]>("/unit-economics/trends").then((r) => r.data),
};

// ─── Forecasting ──────────────────────────────────────────────────────────────
export const forecastingApi = {
  getForecast: () => apiClient.get<FinOpsData["forecasting"]["forecast"]>("/forecasting/forecast").then((r) => r.data),
  getForecastByScenario: (scenario: "base" | "optimistic" | "pessimistic") =>
    apiClient.get(`/forecasting/forecast/${scenario}`).then((r) => r.data),
  whatIf: (payload: object) => apiClient.post("/forecasting/what-if", payload).then((r) => r.data),
  getDrivers: () => apiClient.get<FinOpsData["forecasting"]["drivers"]>("/forecasting/drivers").then((r) => r.data),
  updateDriver: (id: string, payload: object) =>
    apiClient.put(`/forecasting/drivers/${id}/update`, payload).then((r) => r.data),
  getAccuracy: () => apiClient.get("/forecasting/accuracy").then((r) => r.data),
  getHistoricalAccuracy: () => apiClient.get("/forecasting/historical-accuracy").then((r) => r.data),
};

// ─── Budgeting ────────────────────────────────────────────────────────────────
export const budgetingApi = {
  getAll: () => apiClient.get<Budget[]>("/budgets").then((r) => r.data),
  getById: (id: string) => apiClient.get<Budget>(`/budgets/${id}`).then((r) => r.data),
  create: (payload: Partial<Budget>) => apiClient.post("/budgets/create", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Budget>) =>
    apiClient.put(`/budgets/${id}/update`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/budgets/${id}`).then((r) => r.data),
  getStatus: () => apiClient.get("/budgets/status").then((r) => r.data),
  getDailyBurnRate: () => apiClient.get("/budgets/daily-burn-rate").then((r) => r.data),
  setAlert: (id: string, payload: object) => apiClient.post(`/budgets/${id}/alerts`, payload).then((r) => r.data),
};

// ─── Payment Receipts ─────────────────────────────────────────────────────────
export const paymentReceiptsApi = {
  getAll: () => apiClient.get("/payment-receipts").then((r) => r.data),
  getById: (id: string) => apiClient.get(`/payment-receipts/${id}`).then((r) => r.data),
  getByVendor: (vendor: string) => apiClient.get(`/payment-receipts/vendor/${vendor}`).then((r) => r.data),
  download: (id: string) => apiClient.get(`/payment-receipts/${id}/download`).then((r) => r.data),
  upload: (payload: FormData) => apiClient.post("/payment-receipts/upload", payload).then((r) => r.data),
  getSummary: () => apiClient.get("/payment-receipts/summary").then((r) => r.data),
};

// ─── Tenant Management ────────────────────────────────────────────────────────
export const tenantsApi = {
  getAll: () => apiClient.get("/tenants").then((r) => r.data),
  getById: (id: string) => apiClient.get(`/tenants/${id}`).then((r) => r.data),
  create: (payload: object) => apiClient.post("/tenants/create", payload).then((r) => r.data),
  update: (id: string, payload: object) => apiClient.put(`/tenants/${id}/update`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/tenants/${id}`).then((r) => r.data),
  getUsers: (id: string) => apiClient.get(`/tenants/${id}/users`).then((r) => r.data),
};

// ─── User Management ──────────────────────────────────────────────────────────
export const usersApi = {
  getAll: () => apiClient.get("/users").then((r) => r.data),
  getById: (id: string) => apiClient.get(`/users/${id}`).then((r) => r.data),
  create: (payload: object) => apiClient.post("/users/create", payload).then((r) => r.data),
  update: (id: string, payload: object) => apiClient.put(`/users/${id}/update`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
  updateRole: (id: string, role: string) => apiClient.put(`/users/${id}/role`, { role }).then((r) => r.data),
  changePassword: (id: string, payload: { oldPassword: string; newPassword: string }) =>
    apiClient.post(`/users/${id}/change-password`, payload).then((r) => r.data),
  getActivity: (id: string) => apiClient.get(`/users/${id}/activity`).then((r) => r.data),
};

// ─── Legacy bulk fetcher (keeps useFinOpsData.ts working without changes) ─────
export const finOpsApi = {
  getSummary: dashboardApi.getSummary,
  getCostByCategory: dashboardApi.getCostByCategory,
  getCostTrend: dashboardApi.getSpendTrend,
  getTopServices: dashboardApi.getTopServices,
  getRecommendations: recommendationsApi.getAll,
  getAnomalies: anomaliesApi.getAll,
  getKubernetes: kubernetesApi.getClusters, // kept for hook compatibility
  getTeams: costAllocationApi.getTeams,
  getUnitEconomics: unitEconomicsApi.getTrends,
  getBudgets: budgetingApi.getAll,
  getVirtualTags: virtualTagsApi.getAll,
  getReports: reportsApi.getAll,
  getForecasting: forecastingApi.getForecast,

  getAllData: async (): Promise<FinOpsData> => {
    const [summary, costByCategory, costTrend, topServices, recommendations, anomalies, k8sClusters, k8sNamespaces, teams, unitEconomics, budgets, virtualTags, reports, forecasting, forecastingDrivers, forecastingHistorical] =
      await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getCostByCategory(),
        dashboardApi.getSpendTrend(),
        dashboardApi.getTopServices(),
        recommendationsApi.getAll(),
        anomaliesApi.getAll(),
        kubernetesApi.getClusters(),
        kubernetesApi.getNamespaces(),
        costAllocationApi.getTeams(),
        unitEconomicsApi.getTrends(),
        budgetingApi.getAll(),
        virtualTagsApi.getAll(),
        reportsApi.getAll(),
        forecastingApi.getForecast(),
        forecastingApi.getDrivers(),
        forecastingApi.getHistoricalAccuracy(),
      ]);

    return {
      summary,
      costByCategory,
      costTrend,
      topServices,
      recommendations,
      anomalies,
      kubernetes: { clusters: k8sClusters, namespaces: k8sNamespaces },
      teams,
      unitEconomics,
      budgets,
      virtualTags,
      reports,
      forecasting: {
        forecast: forecasting,
        drivers: forecastingDrivers,
        historical: forecastingHistorical,
      },
    };
  },
};
