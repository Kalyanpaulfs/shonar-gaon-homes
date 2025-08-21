import { X } from "lucide-react";
import { getOptimizedImageUrl } from "@/data/cloudinaryServices";
import { ImageData } from "@/data/firebaseServices";

interface ImageViewerProps {
  image: ImageData | null;
  onClose: () => void;
}

export default function ImageViewer({ image, onClose }: ImageViewerProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 cursor-zoom-out"
      onClick={(e) => {
        // Close only when clicking backdrop
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        aria-label="Close viewer"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image centered */}
      <div className="w-screen h-screen flex items-center justify-center">
        <img
          src={getOptimizedImageUrl(image.publicId, 2000)}
          alt={image.title}
          className="max-w-screen max-h-screen object-contain select-none"
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
        <h3 className="text-lg font-semibold">{image.title}</h3>
        <p className="text-xs opacity-80">
          {new Date(image.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
