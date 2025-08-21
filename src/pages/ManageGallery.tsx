import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Camera, Image } from 'lucide-react';
import { fetchGalleryImages } from '../data/cloudinaryServices'; // implement this function
import UploadImageModal from './UploadImageModal';
import EditDeleteImageModal from './EditDeleteImageModal';

const imageCategories = [
  { value: 'Festival', label: 'Festival' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Landscape', label: 'Landscape' },
  { value: 'National', label: 'National' }
];

const ManageGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const result = await fetchGalleryImages();
      setImages(Array.isArray(result) ? result : []);
    } catch (error) {
      setImages([]);
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(img => {
    let match = true;
    if (searchTerm) {
      match = img.title?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (filterCategory !== 'All') {
      match = match && img.category === filterCategory;
    }
    return match;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mx-2 sm:mx-0">
      {/* Header Section - Enhanced Mobile Layout */}
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Manage Gallery</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Upload, edit, and manage community gallery images.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Upload Image
          </button>
        </div>
      </div>

      {/* Search and Filter Section - Enhanced Mobile Layout */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-0 sm:flex sm:gap-4">
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="All">All Categories</option>
          {imageCategories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-slate-500 text-sm sm:text-base">Loading...</div>
        </div>
      ) : filteredImages.length === 0 ? (
        /* Empty State - Enhanced Mobile Layout */
        <div className="text-center py-8 sm:py-12 px-4">
          <Image className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-slate-500 text-base sm:text-lg font-medium">No images found</p>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            {searchTerm || filterCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Upload your first image to get started'
            }
          </p>
        </div>
      ) : (
        /* Image Grid - Enhanced Mobile Responsive Grid */
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6">
          {filteredImages.map(image => (
            <div key={image.id} className="group overflow-hidden shadow-lg rounded-lg sm:rounded-xl relative bg-white transition-transform duration-200 hover:scale-105">
              {/* Image Container - Responsive Heights */}
              <div className="relative overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-32 xs:h-36 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                {/* Mobile Action Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="bg-white text-indigo-600 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Content Section - Responsive Padding and Text */}
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2 leading-tight">
                  {image.title || 'Untitled'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-2">{image.date}</p>
                
                {/* Category Badge and Actions Row */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                    {image.category}
                  </span>
                  
                  {/* Mobile Edit Button - Always Visible on Mobile */}
                  <button
                    onClick={() => setEditingImage(image)}
                    className="sm:hidden text-indigo-600 p-1 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <UploadImageModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={loadImages}
        imageCategories={imageCategories}
      />

      <EditDeleteImageModal
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        onSuccess={loadImages}
        image={editingImage}
        imageCategories={imageCategories}
      />
    </div>
  );
};

export default ManageGallery;