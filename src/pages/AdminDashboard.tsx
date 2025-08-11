import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { fetchEvents, fetchAnnouncements, fetchContacts } from '../data/firebaseServices';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit3, 
  Home,
  Search,
  Filter,
  LogOut,
  Shield,
  Activity,
  Megaphone,
  Bell,
  Users,
  Mail
} from 'lucide-react';
import CreateEventModal from './CreateEventModal';
import EditDeleteEventModal from './EditDeleteEventModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import EditDeleteAnnouncementModal from './EditDeleteAnnouncementModal';

// NEW
import CreateContactModal from './CreateContactModal';
import EditDeleteContactModal from './EditDeleteContactModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState<'events' | 'announcements' | 'contacts'>('events');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // NEW: contacts state
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any | null>(null);

  const eventTypes = ['Cultural', 'Official', 'Sports', 'Festival'] as const;
  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event Related' },
    { value: 'community', label: 'Community' }
  ];

  // NEW: contact types (for filters and labels)
  const contactTypes = [
    { value: 'committee', label: 'Committee' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'staff', label: 'Staff' },
    { value: 'vendor', label: 'Vendor' }
  ];

  const eventTypeColors: Record<string, string> = {
    Cultural: 'from-purple-500 to-violet-600',
    Official: 'from-blue-500 to-indigo-600', 
    Sports: 'from-green-500 to-emerald-600',
    Festival: 'from-orange-500 to-amber-600'
  };

  const announcementTypeColors: Record<string, string> = {
    general: 'from-gray-500 to-slate-600',
    urgent: 'from-red-500 to-rose-600',
    maintenance: 'from-yellow-500 to-amber-600',
    event: 'from-purple-500 to-violet-600',
    community: 'from-green-500 to-emerald-600'
  };

  // NEW: contact type colors
  const contactTypeColors: Record<string, string> = {
    committee: 'from-amber-500 to-orange-600',
    emergency: 'from-red-500 to-rose-600',
    staff: 'from-emerald-500 to-teal-600',
    vendor: 'from-blue-500 to-indigo-600'
  };

  const priorityColors: Record<string, string> = {
    low: 'from-gray-400 to-gray-500',
    medium: 'from-blue-400 to-blue-500',
    high: 'from-red-500 to-red-600'
  };

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

  // NEW: validate contact
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
      if (activeTab === 'events') {
        setFilteredEvents(validEvents);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
      setFilteredEvents([]);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const announcementsData = await fetchAnnouncements();
      const validAnnouncements = Array.isArray(announcementsData) ? announcementsData.filter((a) => validateAnnouncement(a)) : [];
      setAnnouncements(validAnnouncements);
      if (activeTab === 'announcements') {
        setFilteredAnnouncements(validAnnouncements);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setAnnouncements([]);
      setFilteredAnnouncements([]);
    }
  };

  // NEW: load contacts
  const loadContacts = async () => {
    try {
      const contactsData = await fetchContacts();
      const valid = Array.isArray(contactsData) ? contactsData.filter(validateContact) : [];
      setContacts(valid);
      if (activeTab === 'contacts') {
        setFilteredContacts(valid);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
      setContacts([]);
      setFilteredContacts([]);
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

  // Self-defend on mount: if no user, redirect to /admin (in addition to ProtectedRoute)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      let filtered = events;
      if (searchTerm) {
        filtered = filtered.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterType !== 'All') {
        filtered = filtered.filter(event => event.type === filterType);
      }
      setFilteredEvents(filtered);
    } else if (activeTab === 'announcements') {
      let filtered = announcements;
      if (searchTerm) {
        filtered = filtered.filter(announcement =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (filterType !== 'All') {
        filtered = filtered.filter(announcement => announcement.type === filterType);
      }
      setFilteredAnnouncements(filtered);
    } else if (activeTab === 'contacts') {
      let filtered = contacts;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(c =>
          c.name?.toLowerCase().includes(q) ||
          c.position?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q)
        );
      }
      if (filterType !== 'All') {
        filtered = filtered.filter(c => c.type === filterType);
      }
      setFilteredContacts(filtered);
    }
  }, [events, announcements, contacts, searchTerm, filterType, activeTab]);

  // Fixed logout function with navigate replace (prevents back to dashboard)
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut(auth);

      // Clear any cached data
      setEvents([]);
      setAnnouncements([]);
      setFilteredEvents([]);
      setFilteredAnnouncements([]);
      setContacts([]);
      setFilteredContacts([]);

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

  const handleCreateEventSuccess = () => {
    setIsCreateEventModalOpen(false);
    loadEvents();
  };

  const handleCreateAnnouncementSuccess = () => {
    setIsCreateAnnouncementModalOpen(false);
    loadAnnouncements();
  };

  // NEW: contact success handlers
  const handleCreateContactSuccess = () => {
    setIsCreateContactModalOpen(false);
    loadContacts();
  };

  const handleEditDeleteContactSuccess = () => {
    setEditingContact(null);
    loadContacts();
  };

  const handleEditDeleteEventSuccess = () => {
    setEditingEvent(null);
    loadEvents();
  };

  const handleEditDeleteAnnouncementSuccess = () => {
    setEditingAnnouncement(null);
    loadAnnouncements();
  };

  const getFilterOptions = () => {
    if (activeTab === 'events') {
      return eventTypes as unknown as string[];
    } else if (activeTab === 'announcements') {
      return announcementTypes.map(type => type.value);
    } else {
      return contactTypes.map(type => type.value);
    }
  };

  const getFilterLabel = (value: string) => {
    if (activeTab === 'events') {
      return value;
    } else if (activeTab === 'announcements') {
      const type = announcementTypes.find(t => t.value === value);
      return type ? type.label : value;
    } else {
      const type = contactTypes.find(t => t.value === value);
      return type ? type.label : value;
    }
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

          {/* NEW: Total Contacts */}
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
                onClick={() => {
                  setActiveTab('events');
                  setSearchTerm('');
                  setFilterType('All');
                }}
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
                onClick={() => {
                  setActiveTab('announcements');
                  setSearchTerm('');
                  setFilterType('All');
                }}
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

              {/* NEW: Contacts tab */}
              <button
                onClick={() => {
                  setActiveTab('contacts');
                  setSearchTerm('');
                  setFilterType('All');
                }}
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

          {/* Controls */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    {getFilterOptions().map(type => (
                      <option key={type} value={type}>{getFilterLabel(type)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => {
                  if (activeTab === 'events') {
                    setIsCreateEventModalOpen(true);
                  } else if (activeTab === 'announcements') {
                    setIsCreateAnnouncementModalOpen(true);
                  } else {
                    setIsCreateContactModalOpen(true);
                  }
                }}
                className={`${
                  activeTab === 'events' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    : activeTab === 'announcements'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'
                } text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg`}
              >
                <Plus className="w-5 h-5" />
                Create {activeTab === 'events' ? 'Event' : activeTab === 'announcements' ? 'Announcement' : 'Contact'}
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Content (NEW) */}
        {activeTab === 'contacts' ? (
          loading ? (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">
                  Manage Contacts
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Create, edit, and manage community contacts
                </p>
              </div>

              {Array.isArray(filteredContacts) && filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No contacts found</p>
                  <p className="text-slate-400 text-sm">Create your first contact to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {Array.isArray(filteredContacts) && filteredContacts.map((c: any) => {
                    if (!c || typeof c !== 'object' || !c.id) return null;
                    const typeMeta = contactTypes.find(t => t.value === c.type);
                    return (
                      <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                                {c.name || 'Unnamed'}
                              </h3>
                              <span className={`px-3 py-1 bg-gradient-to-r ${contactTypeColors[c.type] || contactTypeColors.staff} text-white text-xs font-medium rounded-full`}>
                                {typeMeta?.label || c.type}
                              </span>
                            </div>

                            <p className="text-slate-600 mb-2">{c.position || '—'}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-100 rounded-lg">
                                  <Users className="w-4 h-4 text-sky-600" />
                                </div>
                                <span>{c.phone || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <Mail className="w-4 h-4 text-indigo-600" />
                                </div>
                                <span>{c.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                  <Shield className="w-4 h-4 text-amber-600" />
                                </div>
                                <span className="truncate">{c.description || '—'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-6">
                            <button
                              onClick={() => setEditingContact(c)}
                              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                              title="Edit Contact"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        ) : null}

        {/* Events/Announcements */}
        {activeTab !== 'contacts' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                Manage {activeTab === 'events' ? 'Events' : 'Announcements'}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Create, edit, and manage community {activeTab}
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : activeTab === 'events' ? (
              Array.isArray(filteredEvents) && filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No events found</p>
                  <p className="text-slate-400 text-sm">Create your first event to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {Array.isArray(filteredEvents) && filteredEvents.map((event: any) => {
                    if (!event || typeof event !== 'object' || !event.id) return null;
                    return (
                      <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {event.title || 'Untitled Event'}
                              </h3>
                              <span className={`px-3 py-1 bg-gradient-to-r ${eventTypeColors[event.type] || eventTypeColors.Cultural} text-white text-xs font-medium rounded-full`}>
                                {event.type || 'Cultural'}
                              </span>
                            </div>
                            
                            <p className="text-slate-600 mb-4 leading-relaxed">{event.description || 'No description available'}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <span>{event.date || 'TBD'}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Clock className="w-4 h-4 text-green-600" />
                                </div>
                                <span>{event.time || 'TBD'}</span>
                              </div>
                              
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                  <MapPin className="w-4 h-4 text-orange-600" />
                                </div>
                                <span>{event.location || 'TBD'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-6">
                            <button
                              onClick={() => setEditingEvent(event)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              title="Edit Event"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              Array.isArray(filteredAnnouncements) && filteredAnnouncements.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No announcements found</p>
                  <p className="text-slate-400 text-sm">Create your first announcement to get started</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {Array.isArray(filteredAnnouncements) && filteredAnnouncements.map((announcement: any) => {
                    if (!announcement || typeof announcement !== 'object' || !announcement.id) return null;
                    return (
                      <div key={announcement.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                                {announcement.title || 'Untitled Announcement'}
                              </h3>
                              <span className={`px-3 py-1 bg-gradient-to-r ${announcementTypeColors[announcement.type] || announcementTypeColors.general} text-white text-xs font-medium rounded-full`}>
                                {announcementTypes.find(t => t.value === announcement.type)?.label || announcement.type}
                              </span>
                              <span className={`px-2 py-1 bg-gradient-to-r ${priorityColors[announcement.priority] || priorityColors.medium} text-white text-xs font-medium rounded-full`}>
                                {announcement.priority || 'medium'}
                              </span>
                            </div>
                            
                            <p className="text-slate-600 mb-4 leading-relaxed">
                              {announcement.content || 'No content available'}
                            </p>
                            
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <span>{announcement.date ? new Date(announcement.date).toLocaleDateString() : 'TBD'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-6">
                            <button
                              onClick={() => setEditingAnnouncement(announcement)}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                              title="Edit Announcement"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSuccess={handleCreateEventSuccess}
        eventTypes={eventTypes as unknown as string[]}
      />
      
      <EditDeleteEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={handleEditDeleteEventSuccess}
        event={editingEvent}
        eventTypes={eventTypes as unknown as string[]}
      />

      <CreateAnnouncementModal
        isOpen={isCreateAnnouncementModalOpen}
        onClose={() => setIsCreateAnnouncementModalOpen(false)}
        onSuccess={handleCreateAnnouncementSuccess}
        announcementTypes={announcementTypes}
      />
      
      <EditDeleteAnnouncementModal
        isOpen={!!editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        onSuccess={handleEditDeleteAnnouncementSuccess}
        announcement={editingAnnouncement}
        announcementTypes={announcementTypes}
      />

      {/* NEW: Contact Modals */}
      <CreateContactModal
        isOpen={isCreateContactModalOpen}
        onClose={() => setIsCreateContactModalOpen(false)}
        onSuccess={handleCreateContactSuccess}
        contactTypes={contactTypes}
      />

      <EditDeleteContactModal
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
        onSuccess={handleEditDeleteContactSuccess}
        contactTypes={contactTypes}
        contact={editingContact}
      />
    </div>
  );
};

export default AdminDashboard;
