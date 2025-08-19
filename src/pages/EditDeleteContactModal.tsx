import React, { useState, useEffect } from 'react';
import { updateContact, deleteContact } from '../data/firebaseServices';
import { Save, X, Trash2, AlertTriangle, User } from 'lucide-react';

const EditDeleteContactModal = ({ isOpen, onClose, onSuccess, contactTypes, contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    type: '',
    phone: '',
    email: '',
    image: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        position: contact.position || '',
        type: contact.type || (contactTypes[0]?.value || ''),
        phone: contact.phone || '',
        email: contact.email || '',
        image: contact.image || '',
        description: contact.description || ''
      });
    }
  }, [contact, contactTypes]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.position || !formData.type || !formData.phone || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateContact(contact.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Error updating contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await deleteContact(contact.id);
      setShowDeleteConfirm(false);
      onSuccess();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact. Please try again.');
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

  if (!isOpen || !contact) return null;

  // Delete confirmation dialog
  if (showDeleteConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 sm:mx-auto">
          {/* Delete Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 sm:p-6 rounded-t-2xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                <h3 className="text-lg sm:text-xl font-bold">Delete Contact</h3>
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
          
          {/* Delete Content */}
          <div className="p-4 sm:p-6">
            <p className="text-slate-600 mb-3 text-sm sm:text-base">
              Are you sure you want to delete this contact?
            </p>
            <div className="bg-slate-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{contact.name}</h4>
              <p className="text-xs sm:text-sm text-slate-600">{contact.position}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">{contact.email}</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
              This action cannot be undone.
            </p>
            
            {/* Delete Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="order-2 sm:order-1 flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="order-1 sm:order-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Edit Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
              <h3 className="text-lg sm:text-xl font-bold">Edit Contact</h3>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Edit Form Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter contact name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Position Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter position/title"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                required
                disabled={isSubmitting}
              />
            </div>
            
            {/* Type Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base appearance-none bg-white"
                required
                disabled={isSubmitting}
              >
                {contactTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Phone and Email Grid */}
            <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                placeholder="Enter image URL (optional)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              {/* Update Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="order-3 sm:order-1 flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
              
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="order-2 sm:order-2 sm:flex-shrink-0 px-4 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Delete
              </button>
              
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="order-1 sm:order-3 sm:flex-shrink-0 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDeleteContactModal;