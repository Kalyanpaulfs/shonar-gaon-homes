import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { fetchEvents, fetchAnnouncements, fetchContacts } from '../data/firebaseServices';
import { 
  Calendar, 
  Home,
  LogOut,
  Shield,
  Activity,
  Megaphone,
  Bell,
  Users
} from 'lucide-react';
import ManageEvents from './ManageEvents';
import ManageAnnouncements from './ManageAnnouncements';
import ManageContacts from './ManageContacts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'announcements' | 'contacts'>('events');
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const eventTypes = ['Cultural', 'Official', 'Sports', 'Festival'] as const;
  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event Related' },
    { value: 'community', label: 'Community' }
  ];
  const contactTypes = [
    { value: 'committee', label: 'Committee' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'staff', label: 'Staff' },
    { value: 'vendor', label: 'Vendor' }
  ];

  // Validation functions
  const validateEvent = (event: any) => {
    return event && 
           typeof event === 'object' && 
           typeof event.title === 'string' &&
           typeof event.description === 'string' &&
           typeof event.date === 'string' &&
           typeof event.time === 'string' &&
           typeof event.location === 'string' &&
           typeof event.type === 'string';
  };

  const validateAnnouncement = (announcement: any) => {
    return announcement && 
           typeof announcement === 'object' && 
           typeof announcement.title === 'string' &&
           typeof announcement.content === 'string' &&
           typeof announcement.date === 'string' &&
           typeof announcement.type === 'string' &&
           typeof announcement.priority === 'string';
  };

  const validateContact = (c: any) => {
    return c &&
           typeof c === 'object' &&
           typeof c.name === 'string' &&
           typeof c.position === 'string' &&
           typeof c.type === 'string' &&
           typeof c.phone === 'string' &&
           typeof c.email === 'string';
  };

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      const validEvents = Array.isArray(eventsData) ? eventsData.filter((e) => validateEvent(e)) : [];
      setEvents(validEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const announcementsData = await fetchAnnouncements();
      const validAnnouncements = Array.isArray(announcementsData) ? announcementsData.filter((a) => validateAnnouncement(a)) : [];
      setAnnouncements(validAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
      setAnnouncements([]);
    }
  };

  const loadContacts = async () => {
    try {
      const contactsData = await fetchContacts();
      const valid = Array.isArray(contactsData) ? contactsData.filter(validateContact) : [];
      setContacts(valid);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setContacts([]);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadEvents(), loadAnnouncements(), loadContacts()]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  // Auth state check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin', { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);

      // Clear any cached data
      setEvents([]);
      setAnnouncements([]);
      setContacts([]);

      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      navigate('/admin', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const goToHome = () => {
    navigate('/', { replace: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 shadow-2xl border-b border-purple-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-slate-300 text-sm">Sonar Gaon Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={goToHome}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Signing Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Events</p>
                <p className="text-3xl font-bold">{Array.isArray(events) ? events.length : 0}</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Announcements</p>
                <p className="text-3xl font-bold">{Array.isArray(announcements) ? announcements.length : 0}</p>
              </div>
              <Megaphone className="w-10 h-10 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Events</p>
                <p className="text-3xl font-bold">{Array.isArray(events) ? events.filter(e => e && e.date && new Date(e.date) >= new Date()).length : 0}</p>
              </div>
              <Activity className="w-10 h-10 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">High Priority</p>
                <p className="text-3xl font-bold">{Array.isArray(announcements) ? announcements.filter(a => a && a.priority === 'high').length : 0}</p>
              </div>
              <Bell className="w-10 h-10 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Total Contacts</p>
                <p className="text-3xl font-bold">{Array.isArray(contacts) ? contacts.length : 0}</p>
              </div>
              <Users className="w-10 h-10 text-cyan-200" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'events'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Events
                </div>
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'announcements'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Announcements
                </div>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'contacts'
                    ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Contacts
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'events' && (
          <ManageEvents 
            events={events}
            eventTypes={eventTypes as unknown as string[]}
            loading={loading}
            onDataChange={refreshData}
          />
        )}

        {activeTab === 'announcements' && (
          <ManageAnnouncements 
            announcements={announcements}
            announcementTypes={announcementTypes}
            loading={loading}
            onDataChange={refreshData}
          />
        )}

        {activeTab === 'contacts' && (
          <ManageContacts 
            contacts={contacts}
            contactTypes={contactTypes}
            loading={loading}
            onDataChange={refreshData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;