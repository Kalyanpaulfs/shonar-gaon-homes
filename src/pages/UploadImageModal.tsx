import React, { useState } from 'react';
import { uploadGalleryImage } from '../data/cloudinaryServices'; // implement this function
import { Save, X, Upload, Image, Trash2 } from 'lucide-react';

interface ImageCategory {
  value: string;
  label: string;
}

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  imageCategories: ImageCategory[];
}

interface FormData {
  title: string;
  files: File[];
  category: string;
  date: string;
}

interface PreviewImage {
  file: File;
  url: string;
  id: string;
}

const UploadImageModal: React.FC<UploadImageModalProps> = ({ isOpen, onClose, onSuccess, imageCategories }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    files: [], // Changed to array for multiple files
    category: 'Festival',
    date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<PreviewImage[]>([]); // For image previews

  const MAX_FILES = 5; // Maximum 5 files allowed

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const selectedFiles = Array.from(files);
    
    if (selectedFiles.length > MAX_FILES) {
      alert(`You can only select up to ${MAX_FILES} images at once.`);
      return;
    }

    // Create preview URLs for selected images
    const newPreviews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setFormData({ ...formData, files: selectedFiles });
    setPreviews(newPreviews);
  };

  const removeImage = (indexToRemove) => {
    const updatedFiles = formData.files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    
    // Clean up URL object to prevent memory leaks
    URL.revokeObjectURL(previews[indexToRemove].url);
    
    setFormData({ ...formData, files: updatedFiles });
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter a title for the images');
      return;
    }
    
    if (formData.files.length === 0) {
      alert('Please select at least one image');
      return;
    }
    
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload all images one by one
      for (let i = 0; i < formData.files.length; i++) {
        const file = formData.files[i];
        const imageData = {
          title: `${formData.title} - Image ${i + 1}`, // Add numbering to distinguish images
          file: file,
          category: formData.category,
          date: formData.date
        };
        
        await uploadGalleryImage(imageData);
      }
      
      alert(`Successfully uploaded ${formData.files.length} images!`);
      onSuccess();
      handleClose();
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error uploading images: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs to prevent memory leaks
    previews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    // Reset form
    setFormData({ title: '', files: [], category: 'Festival', date: '' });
    setPreviews([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Upload Images</h3>
                <p className="text-sm text-gray-600 mt-1">Upload up to {MAX_FILES} images at once</p>
              </div>
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
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Title Prefix
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 'Annual Festival 2024' (will be numbered automatically)"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Each image will be numbered automatically (e.g., "Annual Festival 2024 - Image 1")
              </p>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Select Images 
                <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal">(Max {MAX_FILES})</span>
              </label>
              
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="file-upload"
                  className={`
                    w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer 
                    hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click to select images
                  </p>
                  <p className="text-sm text-gray-500">
                    Choose up to {MAX_FILES} images (JPG, PNG, GIF)
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Selected Images ({previews.length}/{MAX_FILES})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                      <div key={preview.id} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        
                        {/* Image Number */}
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || formData.files.length === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] min-h-[56px]"
              >
                <Save className={`w-5 h-5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting 
                    ? `Uploading ${formData.files.length} images...` 
                    : `Upload ${formData.files.length || 0} Image${formData.files.length !== 1 ? 's' : ''}`
                  }
                </span>
              </button>
              
              {formData.files.length > 0 && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  This will upload {formData.files.length} image{formData.files.length !== 1 ? 's' : ''} to the {formData.category} category
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadImageModal;