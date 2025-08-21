import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  Calendar,
  Home,
  LogOut,
  Shield,
  Activity,
  Megaphone,
  Bell,
  Users,
  Image as GalleryIcon,
  Menu,
  X,
} from "lucide-react";
import {
  fetchEvents,
  fetchAnnouncements,
  fetchContacts,
} from "../data/firebaseServices";
import ManageEvents from "./ManageEvents";
import ManageAnnouncements from "./ManageAnnouncements";
import ManageContacts from "./ManageContacts";
import ManageGallery from "./ManageGallery";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "events" | "announcements" | "contacts" | "gallery"
  >("events");
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Load Data ---
  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    }
  };
  const loadAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch {
      setAnnouncements([]);
    }
  };
  const loadContacts = async () => {
    try {
      const data = await fetchContacts();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setContacts([]);
    }
  };
  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadEvents(), loadAnnouncements(), loadContacts()]);
    setLoading(false);
  };

  // --- Auth ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut(auth);
    navigate("/admin", { replace: true });
    setIsLoggingOut(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tab: "events" | "announcements" | "contacts" | "gallery") => {
    setActiveTab(tab);
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-slate-900 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-semibold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-sm">
                  Sonar Gaon Management Portal
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-800 text-gray-200 hover:bg-slate-700 transition"
              >
                <Home className="w-4 h-4" /> Home
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : <><LogOut className="w-4 h-4" /> Logout</>}
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-lg font-semibold text-white">Admin</h1>
                <p className="text-slate-400 text-xs">Management Portal</p>
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md bg-slate-800 text-white hover:bg-slate-700 transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-700">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-800 text-gray-200 hover:bg-slate-700 transition text-left"
                >
                  <Home className="w-4 h-4" /> Home
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 text-left"
                >
                  {isLoggingOut ? "Logging out..." : <><LogOut className="w-4 h-4" /> Logout</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* STATS */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {[
            {
              label: "Events",
              value: events.length,
              icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />,
            },
            {
              label: "Announcements",
              value: announcements.length,
              icon: <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />,
            },
            {
              label: "Active",
              value: events.filter(
                (e) => e.date && new Date(e.date) >= new Date()
              ).length,
              icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />,
            },
            {
              label: "Priority",
              value: announcements.filter((a) => a.priority === "high").length,
              icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />,
            },
            {
              label: "Contacts",
              value: contacts.length,
              icon: <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-cyan-600" />,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm text-gray-500 truncate">{card.label}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold">{card.value}</p>
              </div>
              <div className="self-end sm:self-auto">
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block border-b border-gray-200">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
              { id: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
              { id: "contacts", label: "Contacts", icon: <Users className="w-4 h-4" /> },
              { id: "gallery", label: "Gallery", icon: <GalleryIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900 font-medium"
                    : "border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="sm:hidden bg-white border-b border-gray-200 sticky top-[73px] z-40">
          <div className="flex justify-center">
            <div className="flex gap-2 px-4">
              {[
                { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
                { id: "announcements", label: "Announce", icon: <Megaphone className="w-4 h-4" /> },
                { id: "contacts", label: "Contacts", icon: <Users className="w-4 h-4" /> },
                { id: "gallery", label: "Gallery", icon: <GalleryIcon className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 py-3 px-3 transition ${
                    activeTab === tab.id
                      ? "text-slate-900 font-medium border-b-2 border-slate-900"
                      : "text-gray-500 hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                  <span className="text-xs whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="min-h-[400px]">
          {activeTab === "events" && (
            <ManageEvents
              events={events}
              eventTypes={["Cultural", "Official", "Sports", "Festival"]}
              loading={loading}
              onDataChange={loadData}
            />
          )}
          {activeTab === "announcements" && (
            <ManageAnnouncements
              announcements={announcements}
              announcementTypes={[
                { value: "general", label: "General" },
                { value: "urgent", label: "Urgent" },
                { value: "maintenance", label: "Maintenance" },
                { value: "event", label: "Event Related" },
                { value: "community", label: "Community" },
              ]}
              loading={loading}
              onDataChange={loadData}
            />
          )}
          {activeTab === "contacts" && (
            <ManageContacts
              contacts={contacts}
              contactTypes={[
                { value: "committee", label: "Committee" },
                { value: "emergency", label: "Emergency" },
                { value: "Services", label: "Services" },
                { value: "vendor", label: "Vendor" },
              ]}
              loading={loading}
              onDataChange={loadData}
            />
          )}
          {activeTab === "gallery" && <ManageGallery />}
        </div>
      </div>

      {/* Custom Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
    </div>
  );
};

export default AdminDashboard;