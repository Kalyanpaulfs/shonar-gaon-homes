import React, { useState } from 'react';
import { createContact } from '../data/firebaseServices';
import { Save, X } from 'lucide-react';

const CreateContactModal = ({ isOpen, onClose, onSuccess, contactTypes }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    type: contactTypes[0]?.value || '',
    phone: '',
    email: '',
    image: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.position || !formData.phone || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await createContact(formData);
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        type: contactTypes[0]?.value || '',
        phone: '',
        email: '',
        image: '',
        description: ''
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Error creating contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        position: '',
        type: contactTypes[0]?.value || '',
        phone: '',
        email: '',
        image: '',
        description: ''
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <h3 className="text-lg sm:text-xl font-bold">Add New Contact</h3>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Name - Full width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter contact name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Position - Full width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter position/role"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Type and Phone - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none bg-white"
                required
                disabled={isSubmitting}
              >
                {contactTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email - Full width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Image URL - Full width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              placeholder="Enter image URL (optional)"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={isSubmitting}
            />
          </div>

          {/* Description - Full width */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter additional information (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 sm:px-4 py-3 text-base border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons - Stack on mobile with full width */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-lg sm:rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Adding...' : 'Add Contact'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;