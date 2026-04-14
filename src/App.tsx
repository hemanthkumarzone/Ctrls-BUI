import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificationProvider, NotificationsContainer } from "@/context/NotificationContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/Login";
import { SignupPage } from "@/pages/Signup";
import { ProfilePage } from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import FeatureShowcase from "@/pages/FeatureShowcase";
import CostAnalyzer from "@/pages/CostAnalyzer";
import Categories from "@/pages/Categories";
import Kubernetes from "@/pages/Kubernetes";
import Recommendations from "@/pages/Recommendations";
import Anomalies from "@/pages/Anomalies";
import Reports from "@/pages/Reports";
import VirtualTags from "@/pages/VirtualTags";
import CostAllocation from "@/pages/CostAllocation";
import UnitEconomics from "@/pages/UnitEconomics";
import Forecasting from "@/pages/Forecasting";
import Budgeting from "@/pages/Budgeting";
import PaymentReceipts from "@/pages/PaymentReceipts";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <AppProvider>
              <Toaster />
              <Sonner />
              <NotificationsContainer />
              <BrowserRouter>
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Protected Routes */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/features" element={<FeatureShowcase />} />
                            <Route path="/cost-analyzer" element={<CostAnalyzer />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/kubernetes" element={<Kubernetes />} />
                            <Route path="/recommendations" element={<Recommendations />} />
                            <Route path="/anomalies" element={<Anomalies />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/virtual-tags" element={<VirtualTags />} />
                            <Route path="/cost-allocation" element={<CostAllocation />} />
                            <Route path="/unit-economics" element={<UnitEconomics />} />
                            <Route path="/forecasting" element={<Forecasting />} />
                            <Route path="/budgeting" element={<Budgeting />} />
                            <Route path="/payment-receipts" element={<PaymentReceipts />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
