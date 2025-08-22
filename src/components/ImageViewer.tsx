import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Download, Share2, Eye, Mail, MessageCircle, Facebook, Twitter, Link, Copy } from "lucide-react";
import { getThumbnailUrl } from "@/data/cloudinaryServices";
import { ImageData } from "@/data/firebaseServices";

interface ImageGroup {
  id: string;
  title: string;
  category: string;
  date: string;
  images: ImageData[];
  thumbnailImage: ImageData;
  createdAt?: string | undefined;
}

interface ImageViewerProps {
  selectedGroup: ImageGroup | null;
  selectedImageIndex: number;
  onClose: () => void;
  onNavigate: (direction: number) => void;
  onImageSelect: (index: number) => void;
}

export default function ImageViewer({
  selectedGroup,
  selectedImageIndex,
  onClose,
  onNavigate,
  onImageSelect,
}: ImageViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Handle keyboard navigation and escape
  useEffect(() => {
    if (selectedGroup) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          setShowShareMenu(false);
        } else if (e.key === "ArrowLeft") {
          onNavigate(-1);
        } else if (e.key === "ArrowRight") {
          onNavigate(1);
        }
      };
      
      window.addEventListener("keydown", onKey);
      
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [selectedGroup, selectedImageIndex, onClose, onNavigate]);

  // Auto-hide controls after 4 seconds of inactivity on desktop
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.innerWidth >= 768) {
        setShowControls(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [showControls]);

  // Reset states when image changes
  useEffect(() => {
    setImageLoaded(false);
    setIsLoading(true);
    setShowShareMenu(false);
  }, [selectedImageIndex]);

  if (!selectedGroup) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setIsLoading(false);
  };

  const handleMouseMove = () => {
    if (window.innerWidth >= 768) {
      setShowControls(true);
    }
  };

  const currentImage = selectedGroup.images[selectedImageIndex];
  const imageUrl = currentImage.url;
  const imageTitle = currentImage.title;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageTitle}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = (platform: string) => {
    const text = `Check out this image: ${imageTitle}`;
    const url = encodeURIComponent(imageUrl);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${url}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(imageTitle)}&body=${encodedText}%20${url}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(imageUrl).then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        });
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col animate-in fade-in duration-300"
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowShareMenu(false);
        }
      }}
    >
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Header Controls */}
      <div className={`relative z-20 p-3 sm:p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent transition-all duration-500 ${
        showControls || window.innerWidth < 768 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="flex items-center justify-between">
          {/* Image info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium border border-white/20 flex-shrink-0">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{selectedImageIndex + 1} of {selectedGroup.images.length}</span>
              <span className="xs:hidden">{selectedImageIndex + 1}/{selectedGroup.images.length}</span>
            </div>
            <div className="text-white min-w-0 flex-1">
              <h3 className="text-sm sm:text-lg font-semibold mb-0 sm:mb-1 drop-shadow-lg truncate">
                {currentImage.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 drop-shadow-md hidden sm:block">
                {new Date(selectedGroup.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Share button with dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 relative"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Share dropdown */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-2 animate-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
                  >
                    <Facebook className="w-4 h-4 text-blue-500" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl text-white text-sm transition-colors"
                  >
                    {copySuccess ? (
                      <>
                        <div className="w-4 h-4 text-green-500">✓</div>
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-400" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleDownload}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 bg-red-500/20 hover:bg-red-500/30 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-red-300/30 group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 relative min-h-0">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-3 sm:inset-6 lg:inset-8 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl animate-pulse border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Main image with proper sizing */}
        <div className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-500 ${
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="max-w-[85vw] max-h-[60vh] sm:max-w-[80vw] sm:max-h-[65vh] lg:max-w-[75vw] lg:max-h-[70vh] xl:max-w-[70vw] xl:max-h-[75vh] object-contain rounded-2xl shadow-2xl drop-shadow-2xl border border-white/10"
            onLoad={handleImageLoad}
            onError={() => setIsLoading(false)}
          />
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/3 pointer-events-none" />
          <div className="absolute inset-0 rounded-2xl shadow-[0_0_100px_rgba(255,255,255,0.1)] pointer-events-none" />
        </div>

        {/* Navigation arrows - only show if multiple images */}
        {selectedGroup.images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(-1)}
              disabled={selectedImageIndex === 0}
              className={`absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 group ${
                (showControls || window.innerWidth < 768) ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
            <button
              onClick={() => onNavigate(1)}
              disabled={selectedImageIndex === selectedGroup.images.length - 1}
              className={`absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 group ${
                (showControls || window.innerWidth < 768) ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </>
        )}
      </div>

      {/* Bottom thumbnail strip and progress */}
      {selectedGroup.images.length > 1 && (
        <div className={`relative z-20 p-3 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-500 ${
          showControls || window.innerWidth < 768 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((selectedImageIndex + 1) / selectedGroup.images.length) * 100}%`
              }}
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex justify-center">
            <div className="flex gap-2 sm:gap-3 p-2 sm:p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20 max-w-full overflow-x-auto">
              {selectedGroup.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onImageSelect(index)}
                  className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 group ${
                    index === selectedImageIndex
                      ? 'ring-2 sm:ring-3 ring-white scale-110 shadow-xl'
                      : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={getThumbnailUrl(image.publicId, 100)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay for current image */}
                  {index === selectedImageIndex && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-xl" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile swipe indicators */}
      <div className="md:hidden absolute bottom-safe-area-inset-bottom left-1/2 -translate-x-1/2 flex gap-1 p-2">
        <div className="w-8 h-1 bg-white/30 rounded-full" />
        <div className="w-2 h-1 bg-white/60 rounded-full" />
        <div className="w-8 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}