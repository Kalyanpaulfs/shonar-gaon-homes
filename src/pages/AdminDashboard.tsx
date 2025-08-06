import React, { useState, useEffect } from 'react';
import { fetchEvents, fetchAnnouncements } from '../data/firebaseServices';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2,
  Home,
  Search,
  Filter,
  LogOut,
  Shield,
  Activity,
  BarChart3,
  Megaphone,
  Bell,
  Users,
  Settings
} from 'lucide-react';
import CreateEventModal from './CreateEventModal';
import EditDeleteEventModal from './EditDeleteEventModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import EditDeleteAnnouncementModal from './EditDeleteAnnouncementModal';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [activeTab, setActiveTab] = useState('events');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  const eventTypes = ['Cultural', 'Official', 'Sports', 'Festival'];
  const announcementTypes = [
    { value: 'general', label: 'General' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'event', label: 'Event Related' },
    { value: 'community', label: 'Community' }
  ];

  const eventTypeColors = {
    Cultural: 'from-purple-500 to-violet-600',
    Official: 'from-blue-500 to-indigo-600', 
    Sports: 'from-green-500 to-emerald-600',
    Festival: 'from-orange-500 to-amber-600'
  };

  const announcementTypeColors = {
    general: 'from-gray-500 to-slate-600',
    urgent: 'from-red-500 to-rose-600',
    maintenance: 'from-yellow-500 to-amber-600',
    event: 'from-purple-500 to-violet-600',
    community: 'from-green-500 to-emerald-600'
  };

  const priorityColors = {
    low: 'from-gray-400 to-gray-500',
    medium: 'from-blue-400 to-blue-500',
    high: 'from-red-500 to-red-600'
  };

  // Validation functions
  const validateEvent = (event) => {
    return event && 
           typeof event === 'object' && 
           typeof event.title === 'string' &&
           typeof event.description === 'string' &&
           typeof event.date === 'string' &&
           typeof event.time === 'string' &&
           typeof event.location === 'string' &&
           typeof event.type === 'string';
  };

  const validateAnnouncement = (announcement) => {
    return announcement && 
           typeof announcement === 'object' && 
           typeof announcement.title === 'string' &&
           typeof announcement.content === 'string' &&
           typeof announcement.date === 'string' &&
           typeof announcement.type === 'string' &&
           typeof announcement.priority === 'string';
  };

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      const validEvents = Array.isArray(eventsData) ? eventsData.filter(event => validateEvent(event)) : [];
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
      const validAnnouncements = Array.isArray(announcementsData) ? announcementsData.filter(announcement => validateAnnouncement(announcement)) : [];
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

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadEvents(), loadAnnouncements()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    }
  }, [events, announcements, searchTerm, filterType, activeTab]);

  const handleLogout = () => {
    window.location.href = '/admin-login';
  };

  const goToHome = () => {
    window.location.href = '/';
  };

  const handleCreateEventSuccess = () => {
    setIsCreateEventModalOpen(false);
    loadEvents();
  };

  const handleCreateAnnouncementSuccess = () => {
    setIsCreateAnnouncementModalOpen(false);
    loadAnnouncements();
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
      return eventTypes;
    } else {
      return announcementTypes.map(type => type.value);
    }
  };

  const getFilterLabel = (value) => {
    if (activeTab === 'events') {
      return value;
    } else {
      const type = announcementTypes.find(t => t.value === value);
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
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-full transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  } else {
                    setIsCreateAnnouncementModalOpen(true);
                  }
                }}
                className={`${
                  activeTab === 'events' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                } text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg`}
              >
                <Plus className="w-5 h-5" />
                Create {activeTab === 'events' ? 'Event' : 'Announcement'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
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
            // Events Content
            Array.isArray(filteredEvents) && filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No events found</p>
                <p className="text-slate-400 text-sm">Create your first event to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {Array.isArray(filteredEvents) && filteredEvents.map((event) => {
                  if (!event || typeof event !== 'object' || !event.id) {
                    return null;
                  }
                  
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
            // Announcements Content
            Array.isArray(filteredAnnouncements) && filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No announcements found</p>
                <p className="text-slate-400 text-sm">Create your first announcement to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {Array.isArray(filteredAnnouncements) && filteredAnnouncements.map((announcement) => {
                  if (!announcement || typeof announcement !== 'object' || !announcement.id) {
                    return null;
                  }
                  
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
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSuccess={handleCreateEventSuccess}
        eventTypes={eventTypes}
      />
      
      <EditDeleteEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={handleEditDeleteEventSuccess}
        event={editingEvent}
        eventTypes={eventTypes}
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
    </div>
  );
};

export default AdminDashboard;