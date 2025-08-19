import React, { useState } from 'react';
import { uploadGalleryImage } from '../data/cloudinaryServices'; // implement this function
import { Save, X } from 'lucide-react';

const UploadImageModal = ({ isOpen, onClose, onSuccess, imageCategories }) => {
  const [formData, setFormData] = useState({
    title: '',
    file: null,
    category: 'Festival',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = e => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.file || !formData.date) {
      alert('Please fill in all required fields and select an image');
      return;
    }
    setIsSubmitting(true);
    try {
      await uploadGalleryImage(formData);
      onSuccess();
      setFormData({ title: '', file: null, category: 'Festival', date: '' });
      onClose();
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Upload Image</h3>
            <button onClick={onClose}><X className="w-5 h-5" /></button>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            />
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl"
            >
              {imageCategories.map(type =>
                <option key={type.value} value={type.value}>{type.label}</option>
              )}
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl"
            >
              <Save className="w-5 h-5" /> {isSubmitting ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;
