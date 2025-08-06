import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";  // Home page
import NotFound from "./pages/NotFound";  // 404 page
import AdminLogin from "./pages/AdminLogin";  // Admin Login page
import AdminDashboard from "./pages/AdminDashboard";  // Admin Dashboard page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminLogin />} /> {/* Admin login route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin dashboard route */}
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
