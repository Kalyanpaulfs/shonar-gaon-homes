import React, { useState, useEffect } from 'react';
import { updateGalleryImage, deleteGalleryImage } from '../data/cloudinaryServices';
import { Save, X, Trash2, AlertTriangle } from 'lucide-react';

interface ImageCategory {
  value: string;
  label: string;
}

interface ImageData {
  id: string;
  title: string;
  category: string;
  date: string;
  url: string;
  publicId: string;
}

interface EditDeleteImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  image: ImageData | null;
  imageCategories: ImageCategory[];
}

const EditDeleteImageModal: React.FC<EditDeleteImageModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  image, 
  imageCategories 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Festival',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (image) {
      setFormData({
        title: image.title || '',
        category: image.category || 'Festival',
        date: image.date || ''
      });
    }
  }, [image]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    if (!formData.title.trim()) {
      alert('Please enter a title for the image');
      return;
    }

    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateGalleryImage(image.id, formData);
      alert('Image updated successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      alert(`Error updating image: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!image) return;

    setIsSubmitting(true);
    try {
      await deleteGalleryImage(image.id);
      alert('Image deleted successfully!');
      onSuccess();
      onClose();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Error deleting image: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Edit Image</h3>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 pb-6 max-h-[80vh] overflow-y-auto">
          
          {/* Image Preview */}
          <div className="mb-6">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleUpdate}>
            
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Title 
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter image title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Date and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  Date 
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-900"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-900"
                  disabled={isSubmitting}
                >
                  {imageCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              
              {/* Save Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>

              {/* Delete Section */}
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isSubmitting}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Image
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-4">
                  
                  {/* Warning */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm">Delete Image</h4>
                      <p className="text-red-700 text-sm mt-1">
                        This action cannot be undone. The image will be permanently deleted.
                      </p>
                    </div>
                  </div>

                  {/* Confirmation Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-60"
                    >
                      <Trash2 className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDeleteImageModal;