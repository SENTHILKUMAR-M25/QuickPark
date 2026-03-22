import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Route, Routes } from "react-router-dom";

import { Toaster } from "./components/ui/Toaster";
import { TooltipProvider } from "./components/ui/tooltip";

import {
  LayoutDashboard,
  Calendar,
  User,
  Car,
  Plus,
  Building2,
  DollarSign,
  Users,
  MapPin,
  ClipboardList
} from "lucide-react";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PageTransition from "./components/PageTransition";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ParkingDetailsPage from "./pages/ParkingDetailsPage";
import NotFound from "./pages/NotFound";

import UserDashboard from "./pages/user/UserDashboard";
import UserBookings from "./pages/user/UserBookings";
import UserProfile from "./pages/user/UserProfile";

import ProviderDashboard from "./pages/provider/ProviderDashboard";
import AddParking from "./pages/provider/AddParking";
import MyParkings from "./pages/provider/MyParkings";
import ProviderBookings from "./pages/provider/ProviderBookings";
import ProviderEarnings from "./pages/provider/ProviderEarnings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProviders from "./pages/admin/AdminProviders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminParkings from "./pages/admin/AdminParkings";

const queryClient = new QueryClient();

const userSidebarItems = [
  { label: "Dashboard", to: "/user/dashboard", icon: LayoutDashboard },
  { label: "My Bookings", to: "/user/bookings", icon: Calendar },
  { label: "Profile", to: "/user/profile", icon: User },
];

const providerSidebarItems = [
  { label: "Dashboard", to: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Add Parking", to: "/provider/add-parking", icon: Plus },
  { label: "My Parkings", to: "/provider/my-parkings", icon: Car },
  { label: "Bookings", to: "/provider/bookings", icon: Calendar },
  { label: "Earnings", to: "/provider/earnings", icon: DollarSign },
];

const adminSidebarItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Providers", to: "/admin/providers", icon: Building2 },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Bookings", to: "/admin/bookings", icon: ClipboardList },
  { label: "Parkings", to: "/admin/parkings", icon: MapPin },
];

const App = () => {
  return (
    
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />

        
            <PageTransition>
              <Routes>

                {/* Public Routes */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/parking/:id" element={<ParkingDetailsPage />} />
                </Route>

                {/* User Routes */}
                <Route element={<DashboardLayout sidebarItems={userSidebarItems} title="User Portal" />}>
                  <Route path="/user/dashboard" element={<UserDashboard />} />
                  <Route path="/user/bookings" element={<UserBookings />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                </Route>

                {/* Provider Routes */}
                <Route element={<DashboardLayout sidebarItems={providerSidebarItems} title="Provider Portal" />}>
                  <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                  <Route path="/provider/add-parking" element={<AddParking />} />
                  <Route path="/provider/my-parkings" element={<MyParkings />} />
                  <Route path="/provider/bookings" element={<ProviderBookings />} />
                  <Route path="/provider/earnings" element={<ProviderEarnings />} />
                </Route>

                {/* Admin Routes */}
                <Route element={<DashboardLayout sidebarItems={adminSidebarItems} title="Admin Portal" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/providers" element={<AdminProviders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/bookings" element={<AdminBookings />} />
                  <Route path="/admin/parkings" element={<AdminParkings />} />
                </Route>

                <Route path="*" element={<NotFound />} />

              </Routes>
            </PageTransition>
          

        </TooltipProvider>
      </QueryClientProvider>

  );
};

export default App;