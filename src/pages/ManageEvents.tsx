import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Edit3, 
  Search,
  Filter
} from 'lucide-react';
import CreateEventModal from './CreateEventModal';
import EditDeleteEventModal from './EditDeleteEventModal';

interface ManageEventsProps {
  events: any[];
  eventTypes: string[];
  loading: boolean;
  onDataChange: () => void;
}

const ManageEvents: React.FC<ManageEventsProps> = ({ 
  events, 
  eventTypes, 
  loading, 
  onDataChange 
}) => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const eventTypeColors: Record<string, string> = {
    Cultural: 'from-purple-500 to-violet-600',
    Official: 'from-blue-500 to-indigo-600', 
    Sports: 'from-green-500 to-emerald-600',
    Festival: 'from-orange-500 to-amber-600'
  };

  useEffect(() => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'All') {
      filtered = filtered.filter(event => event.type === filterType);
    }
    setFilteredEvents(filtered);
  }, [events, searchTerm, filterType]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    onDataChange();
  };

  const handleEditDeleteSuccess = () => {
    setEditingEvent(null);
    onDataChange();
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Manage Events</h2>
              <p className="text-slate-600 text-sm mt-1">
                Create, edit, and manage community events
              </p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg touch-manipulation"
            >
              <Plus className="w-5 h-5" />
              <span className="sm:inline">Create Event</span>
            </button>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : Array.isArray(filteredEvents) && filteredEvents.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Calendar className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-base sm:text-lg">No events found</p>
          <p className="text-slate-400 text-sm">
            {searchTerm || filterType !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first event to get started'
            }
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {Array.isArray(filteredEvents) && filteredEvents.map((event: any) => {
            if (!event || typeof event !== 'object' || !event.id) return null;
            
            const eventDate = event.date ? new Date(event.date) : null;
            const isUpcoming = eventDate && eventDate >= new Date();
            
            return (
              <div key={event.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and badges */}
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-start gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors flex-1 min-w-0">
                          {event.title || 'Untitled Event'}
                        </h3>
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 touch-manipulation flex-shrink-0 sm:hidden"
                          title="Edit Event"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 sm:px-3 py-1 bg-gradient-to-r ${eventTypeColors[event.type] || eventTypeColors.Cultural} text-white text-xs font-medium rounded-full whitespace-nowrap`}>
                          {event.type || 'Cultural'}
                        </span>
                        {isUpcoming && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                            Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 text-sm sm:text-base mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {event.description || 'No description available'}
                    </p>
                    
                    {/* Event details - Stack on mobile */}
                    <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="min-w-0 truncate">{event.date || 'TBD'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="min-w-0 truncate">{event.time || 'TBD'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="min-w-0 truncate">{event.location || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit button - Hidden on mobile, shown on larger screens */}
                  <div className="hidden sm:flex items-start">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 touch-manipulation"
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
      )}

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        eventTypes={eventTypes}
      />
      
      <EditDeleteEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSuccess={handleEditDeleteSuccess}
        event={editingEvent}
        eventTypes={eventTypes}
      />
    </div>
  );
};

export default ManageEvents;