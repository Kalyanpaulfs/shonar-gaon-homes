import React, { useState, useEffect } from 'react';
import { updateEvent, deleteEvent } from '../data/firebaseServices';
import { Save, X, Trash2, AlertTriangle } from 'lucide-react';

const EditDeleteEventModal = ({ isOpen, onClose, onSuccess, event, eventTypes }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Cultural',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        type: event.type || 'Cultural',
      });
    }
  }, [event]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateEvent(event.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteEvent(event.id);
      setShowDeleteConfirm(false);
      onSuccess();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!isOpen || !event) return null;

  // Delete confirmation dialog
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md mx-2 sm:mx-0">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6" />
                <h3 className="text-lg sm:text-xl font-bold">Delete Event</h3>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            <p className="text-slate-600 text-sm sm:text-base mb-3 sm:mb-2">
              Are you sure you want to delete this event?
            </p>
            <div className="bg-slate-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{event.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600">{event.date} at {event.time}</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-lg sm:rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                <Trash2 className="w-5 h-5" />
                {isSubmitting ? 'Deleting...' : 'Delete Event'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit form
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg sm:text-xl font-bold">Edit Event</h3>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleUpdate} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Event Title - Full width on all screens */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Description - Full width on all screens */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter event description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Date and Time - Stack on mobile, side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Location and Type - Stack on mobile, side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Action Buttons - Stack vertically on mobile */}
          <div className="pt-4 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
            {/* Update Button - Full width on mobile */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
            
            {/* Secondary Actions - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg sm:rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeleteEventModal;