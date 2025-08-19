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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Gallery</h2>
          <p className="text-slate-600 text-sm mt-1">
            Upload, edit, and manage community gallery images.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Upload Image
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md px-4 py-3 border border-slate-300 rounded-xl"
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-3 border border-slate-300 rounded-xl"
        >
          <option value="All">All Categories</option>
          {imageCategories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">Loading...</div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No images found</p>
          <p className="text-slate-400 text-sm">
            {searchTerm || filterCategory !== 'All' ? 'Try adjusting your search or filter criteria' : 'Upload your first image to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {filteredImages.map(image => (
            <div key={image.id} className="group overflow-hidden shadow-lg rounded-xl relative">
              <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 mb-2">{image.title || 'Untitled'}</h3>
                <p className="text-sm text-slate-600">{image.date}</p>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                  {image.category}
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="text-indigo-600 p-2 rounded-lg hover:bg-indigo-50"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
