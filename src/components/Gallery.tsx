import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchGalleryImages, ImageData } from "@/data/firebaseServices";
import { getThumbnailUrl } from "@/data/cloudinaryServices";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageViewer from "./ImageViewer";

// Static categories
const staticCategories = ["All", "Festival", "Cultural", "Sports", "Landscape", "National"];

const categoryColors = {
  Festival: {
    badge: "bg-gradient-to-r from-orange-500 to-amber-600 text-white",
  },
  Cultural: {
    badge: "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
  },
  Sports: {
    badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
  },
  Landscape: {
    badge: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
  },
  National: {
    badge: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
  },
  default: {
    badge: "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
  },
};

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [categories, setCategories] = useState<string[]>(staticCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(9);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  // Prevent scroll when viewer open + Esc to close
  useEffect(() => {
    if (selectedImage) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedImage(null);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [selectedImage]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadImages(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterImages();
  }, [selectedCategory, images]);

  const loadImages = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      const imageData = await fetchGalleryImages();
      setImages(imageData);
      const uniqueCategories = ["All", ...new Set(imageData.map((img) => img.category))];
      setCategories(uniqueCategories);
      if (!silent) setLoading(false);
    } catch (err) {
      console.error("Error loading gallery images:", err);
      setError("Failed to load gallery images");
      if (!silent) setLoading(false);
    }
  };

  const filterImages = () => {
    if (selectedCategory === "All") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory));
    }
    setDisplayCount(9);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setError(null);
  };

  const handleLoadMore = () => setDisplayCount((prev) => prev + 9);
  const getCategoryStyle = (category: string) =>
    categoryColors[category as keyof typeof categoryColors] || categoryColors.default;

  const displayedImages = filteredImages.slice(0, displayCount);
  const hasMore = displayCount < filteredImages.length;

  if (loading && images.length === 0) {
    return (
      <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-slate-600">Loading gallery...</p>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => loadImages()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-2xl animate-float" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl animate-bounce" />

      <div className="relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Community Memories</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            Community Gallery
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mb-6" />

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Capturing precious moments of our community life, festivals, and celebrations.
            {images.length > 0 && (
              <span className="block text-sm text-slate-500 mt-2">
                {images.length} photos • Updated automatically
              </span>
            )}
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-delay="100">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 group ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                    : "text-slate-600 border-slate-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300"
                }`}
              >
                {category}
                {category !== "All" && (
                  <span className="ml-2 text-xs opacity-75">
                    ({images.filter((img) => img.category === category).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {displayedImages.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No images found</h3>
            <p className="text-slate-500">
              {selectedCategory === "All"
                ? "No images have been uploaded yet."
                : `No images found in the ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedImages.map((image, index) => {
              const categoryStyle = getCategoryStyle(image.category);
              return (
                <Card
                  key={image.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={getThumbnailUrl(image.publicId, 400)}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = image.url;
                      }}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className="absolute top-4 right-4">
                      <Badge
                        className={`${categoryStyle.badge} shadow-lg group-hover:scale-105 transition-transform duration-300`}
                      >
                        {image.category}
                      </Badge>
                    </div>

                    {/* Hover overlay content */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                          <Camera className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-white text-sm font-medium">View Photo</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 relative">
                    <h3 className="font-semibold text-slate-800 mb-2 truncate">{image.title}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(image.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {image.createdAt && (
                      <p className="text-xs text-slate-400 mt-1">
                        Added {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="200">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="px-8 py-3 bg-white border-slate-300 text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-slate-800 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <Camera className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Load More Photos ({filteredImages.length - displayCount} remaining)
            </Button>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => loadImages()}
            variant="ghost"
            size="sm"
            disabled={loading}
            className="text-slate-500 hover:text-slate-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Refresh Gallery"
            )}
          </Button>
        </div>
      </div>

      {/* Full-screen Image Viewer */}
      <ImageViewer image={selectedImage} onClose={() => setSelectedImage(null)} />
    </Section>
  );
}
