import React, { useState, useEffect } from 'react';
import { updateGalleryImage, deleteGalleryImage } from '../data/cloudinaryServices';
import { Save, X, Trash2 } from 'lucide-react';

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

    // Basic validation
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Edit Image</h3>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Image Preview */}
          <div className="mb-6">
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-40 object-cover rounded-xl border"
            />
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="Enter image title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              >
                {imageCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          {/* Delete Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-xl hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <Trash2 className="w-5 h-5" />
                Delete Image
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 font-medium mb-2">Confirm Deletion</p>
                  <p className="text-red-600 text-sm">
                    Are you sure you want to delete this image? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isSubmitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDeleteImageModal;