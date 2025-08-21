import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Plus,
  Edit3,
  Users,
  Mail,
  Phone,
  Shield,
  Building
} from 'lucide-react';
import CreateContactModal from './CreateContactModal';
import EditDeleteContactModal from './EditDeleteContactModal';

interface Contact {
  id: string;
  name: string;
  position: string;
  type: string;
  phone: string;
  email: string;
  description?: string;
}

interface ContactType {
  value: string;
  label: string;
}

interface ManageContactsProps {
  contacts: Contact[];
  contactTypes: ContactType[];
  loading: boolean;
  onDataChange: () => void;
}

const ManageContacts: React.FC<ManageContactsProps> = ({
  contacts,
  contactTypes,
  loading,
  onDataChange
}) => {
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isCreateContactModalOpen, setIsCreateContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const contactTypeColors: Record<string, string> = {
    committee: 'from-amber-500 to-orange-600',
    emergency: 'from-red-500 to-rose-600',
    Services: 'from-emerald-500 to-teal-600',
    vendor: 'from-blue-500 to-indigo-600'
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = contacts;
    
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(query) ||
        contact.position?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.toLowerCase().includes(query) ||
        contact.description?.toLowerCase().includes(query)
      );
    }
    
    if (filterType !== 'All') {
      filtered = filtered.filter(contact => contact.type === filterType);
    }
    
    setFilteredContacts(filtered);
  }, [contacts, searchTerm, filterType]);

  const handleCreateContactSuccess = () => {
    setIsCreateContactModalOpen(false);
    onDataChange();
  };

  const handleEditDeleteContactSuccess = () => {
    setEditingContact(null);
    onDataChange();
  };

  const getContactTypeLabel = (type: string) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.label : type;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Manage Contacts</h2>
              <p className="text-slate-600 text-sm mt-1">
                Create, edit, and manage community contacts
              </p>
            </div>
            <button
              onClick={() => setIsCreateContactModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4 sm:px-6 py-3 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg touch-manipulation"
            >
              <Plus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
              >
                <option value="All">All Types</option>
                {contactTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || filterType !== 'All') && (
            <button
              onClick={resetFilters}
              className="self-start text-teal-600 hover:text-teal-700 text-sm font-medium touch-manipulation"
            >
              Clear Filters
            </button>
          )}
        </div>
        
        {(searchTerm || filterType !== 'All') && (
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      ) : Array.isArray(filteredContacts) && filteredContacts.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Users className="w-12 sm:w-16 h-12 sm:h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-base sm:text-lg">
            {searchTerm || filterType !== 'All' ? 'No contacts match your filters' : 'No contacts found'}
          </p>
          <p className="text-slate-400 text-sm">
            {searchTerm || filterType !== 'All' 
              ? 'Try adjusting your search terms or filters' 
              : 'Create your first contact to get started'
            }
          </p>
          {(searchTerm || filterType !== 'All') && (
            <button
              onClick={resetFilters}
              className="mt-4 text-teal-600 hover:text-teal-700 font-medium touch-manipulation"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {Array.isArray(filteredContacts) && filteredContacts.map((contact: Contact) => {
            if (!contact || typeof contact !== 'object' || !contact.id) return null;
            
            return (
              <div key={contact.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors group">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Name and type badge */}
                      <div className="flex flex-col gap-2 mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {contact.name || 'Unnamed Contact'}
                        </h3>
                        <span className={`self-start px-2 sm:px-3 py-1 bg-gradient-to-r ${contactTypeColors[contact.type] || contactTypeColors.Services} text-white text-xs font-medium rounded-full whitespace-nowrap`}>
                          {getContactTypeLabel(contact.type)}
                        </span>
                      </div>

                      {/* Position */}
                      {contact.position && (
                        <div className="flex items-center gap-2 mb-4">
                          <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <p className="text-slate-600 font-medium text-sm sm:text-base">{contact.position}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit button - Always visible on mobile */}
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 touch-manipulation flex-shrink-0"
                      title="Edit Contact"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Contact details - Stack on mobile, grid on larger screens */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg flex-shrink-0">
                        <Phone className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                        <p className="text-slate-700 font-medium text-sm sm:text-base truncate">{contact.phone || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                        <Mail className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                        <p className="text-slate-700 font-medium text-sm sm:text-base truncate">{contact.email || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
                      <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                        <Shield className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Type</p>
                        <p className="text-slate-700 font-medium text-sm sm:text-base truncate">{getContactTypeLabel(contact.type)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {contact.description && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                      <p className="text-slate-600 text-sm leading-relaxed">{contact.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
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

export default ManageContacts;