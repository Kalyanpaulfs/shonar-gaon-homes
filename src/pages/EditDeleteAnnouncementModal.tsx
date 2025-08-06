import React, { useState, useEffect } from 'react';
import { updateAnnouncement, deleteAnnouncement } from '../data/firebaseServices';
import { Save, X, Trash2, AlertTriangle } from 'lucide-react';

const EditDeleteAnnouncementModal = ({ isOpen, onClose, onSuccess, announcement, announcementTypes }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    type: 'general',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || '',
        date: announcement.date || '',
        type: announcement.type || 'general',
        priority: announcement.priority || 'medium'
      });
    }
  }, [announcement]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.content || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAnnouncement(announcement.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('Error updating announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteAnnouncement(announcement.id);
      setShowDeleteConfirm(false);
      onSuccess();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement. Please try again.');
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

  if (!isOpen || !announcement) return null;

  // Delete confirmation dialog
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xl font-bold">Delete Announcement</h3>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-slate-600 mb-2">
              Are you sure you want to delete this announcement?
            </p>
            <div className="bg-slate-100 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-slate-800">{announcement.title}</h4>
              <p className="text-sm text-slate-600">{new Date(announcement.date).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500 mt-2">{announcement.content.substring(0, 100)}...</p>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                {isSubmitting ? 'Deleting...' : 'Delete Announcement'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-xl font-bold">Edit Announcement</h3>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Announcement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter announcement title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Enter announcement content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                >
                  {announcementTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isSubmitting}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Updating...' : 'Update Announcement'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeleteAnnouncementModal;