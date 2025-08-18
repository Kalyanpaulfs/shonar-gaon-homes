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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Manage Events</h2>
            <p className="text-slate-600 text-sm mt-1">
              Create, edit, and manage community events
            </p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
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
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : Array.isArray(filteredEvents) && filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No events found</p>
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
                      {isUpcoming && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 mb-4 leading-relaxed">
                      {event.description || 'No description available'}
                    </p>
                    
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
                        <span className="truncate">{event.location || 'TBD'}</span>
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