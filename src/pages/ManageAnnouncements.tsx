import React, { useEffect, useState } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Plus, 
  Edit3, 
  Search,
  Filter,
  Bell
} from 'lucide-react';
import CreateAnnouncementModal from './CreateAnnouncementModal';
import EditDeleteAnnouncementModal from './EditDeleteAnnouncementModal';

interface AnnouncementType {
  value: string;
  label: string;
}

interface ManageAnnouncementsProps {
  announcements: any[];
  announcementTypes: AnnouncementType[];
  loading: boolean;
  onDataChange: () => void;
}

const ManageAnnouncements: React.FC<ManageAnnouncementsProps> = ({ 
  announcements, 
  announcementTypes, 
  loading, 
  onDataChange 
}) => {
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any | null>(null);

  const announcementTypeColors: Record<string, string> = {
    general: 'from-gray-500 to-slate-600',
    urgent: 'from-red-500 to-rose-600',
    maintenance: 'from-yellow-500 to-amber-600',
    event: 'from-purple-500 to-violet-600',
    community: 'from-green-500 to-emerald-600'
  };

  const priorityColors: Record<string, string> = {
    low: 'from-gray-400 to-gray-500',
    medium: 'from-blue-400 to-blue-500',
    high: 'from-red-500 to-red-600'
  };

  useEffect(() => {
    let filtered = announcements;
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'All') {
      filtered = filtered.filter(announcement => announcement.type === filterType);
    }
    setFilteredAnnouncements(filtered);
  }, [announcements, searchTerm, filterType]);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    onDataChange();
  };

  const handleEditDeleteSuccess = () => {
    setEditingAnnouncement(null);
    onDataChange();
  };

  const getTypeLabel = (value: string) => {
    const type = announcementTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isRecentAnnouncement = (dateString: string) => {
    try {
      const announcementDate = new Date(dateString);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return announcementDate >= threeDaysAgo;
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col gap-4">
          {/* Title and Create Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Manage Announcements
              </h2>
              <p className="text-slate-600 text-sm mt-1 hidden sm:block">
                Create, edit, and manage community announcements
              </p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="sm:inline">Create</span>
              <span className="hidden sm:inline">Announcement</span>
            </button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-auto pl-9 sm:pl-10 pr-8 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="All">All Types</option>
              {announcementTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      ) : Array.isArray(filteredAnnouncements) && filteredAnnouncements.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-base sm:text-lg">No announcements found</p>
          <p className="text-slate-400 text-sm mt-1">
            {searchTerm || filterType !== 'All' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first announcement to get started'
            }
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {Array.isArray(filteredAnnouncements) && filteredAnnouncements.map((announcement: any) => {
            if (!announcement || typeof announcement !== 'object' || !announcement.id) return null;
            
            const isRecent = isRecentAnnouncement(announcement.date);
            const isHighPriority = announcement.priority === 'high';
            
            return (
              <div key={announcement.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title and Tags */}
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-purple-600 transition-colors leading-tight pr-2">
                          {announcement.title || 'Untitled Announcement'}
                        </h3>
                        
                        {/* Mobile Edit Button */}
                        <button
                          onClick={() => setEditingAnnouncement(announcement)}
                          className="sm:hidden p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 flex-shrink-0"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 sm:px-3 py-1 bg-gradient-to-r ${announcementTypeColors[announcement.type] || announcementTypeColors.general} text-white text-xs font-medium rounded-full`}>
                          {getTypeLabel(announcement.type)}
                        </span>
                        
                        <span className={`px-2 py-1 bg-gradient-to-r ${priorityColors[announcement.priority] || priorityColors.medium} text-white text-xs font-medium rounded-full`}>
                          {announcement.priority || 'medium'}
                        </span>
                        
                        {isRecent && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Recent
                          </span>
                        )}
                        
                        {isHighPriority && (
                          <Bell className="w-4 h-4 text-red-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <p className="text-slate-600 mb-4 leading-relaxed text-sm sm:text-base">
                      {announcement.content || 'No content available'}
                    </p>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span>
                        Published: {announcement.date ? formatDate(announcement.date) : 'TBD'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Desktop Edit Button */}
                  <div className="hidden sm:flex items-center gap-2 ml-6">
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
      )}

      {/* Modals */}
      <CreateAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        announcementTypes={announcementTypes}
      />
      
      <EditDeleteAnnouncementModal
        isOpen={!!editingAnnouncement}
        onClose={() => setEditingAnnouncement(null)}
        onSuccess={handleEditDeleteSuccess}
        announcement={editingAnnouncement}
        announcementTypes={announcementTypes}
      />
    </div>
  );
};

export default ManageAnnouncements;