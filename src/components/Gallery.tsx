
"use client";

import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Loader2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchGalleryImages, ImageData } from "@/data/firebaseServices";
import { getThumbnailUrl } from "@/data/cloudinaryServices";
import AOS from "aos";
import "aos/dist/aos.css";
import ImageViewer from "./ImageViewer";
import { motion, useScroll, useTransform } from "framer-motion";

// Static categories
const staticCategories = ["All", "Festival", "Cultural", "Sports", "Landscape", "National"];

const categoryColors = {
  Festival: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
  Cultural: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
  Sports: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
  Landscape: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
  National: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
  default: {
    badge: "bg-gradient-to-r from-amber-800 to-amber-900 text-amber-100",
  },
};

interface ImageGroup {
  id: string;
  title: string;
  category: string;
  date: string;
  images: ImageData[];
  thumbnailImage: ImageData;
  createdAt?: string | undefined;
}

export function Gallery() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Parallax movement for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [images, setImages] = useState<ImageData[]>([]);
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<ImageGroup[]>([]);
  const [categories, setCategories] = useState<string[]>(staticCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Track current page
  const imagesPerPage = 3; // Display 3 images per page

  const [selectedGroup, setSelectedGroup] = useState<ImageGroup | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1500, easing: "ease-in-out-back", once: true });
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
    groupImages();
  }, [images]);

  useEffect(() => {
    filterGroups();
  }, [selectedCategory, imageGroups]);

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

  const groupImages = () => {
    const grouped: { [key: string]: ImageData[] } = {};
    
    images.forEach(image => {
      const baseTitle = image.title.replace(/ - Image \d+$/, '');
      const groupKey = `${baseTitle}_${image.category}_${image.date}`;
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(image);
    });

    const groups: ImageGroup[] = Object.entries(grouped).map(([key, groupImages]) => {
      const sortedImages = groupImages.sort((a, b) => {
        const aMatch = a.title.match(/Image (\d+)$/);
        const bMatch = b.title.match(/Image (\d+)$/);
        const aNum = aMatch ? parseInt(aMatch[1]) : 0;
        const bNum = bMatch ? parseInt(bMatch[1]) : 0;
        return aNum - bNum;
      });

      const firstImage = sortedImages[0];
      const baseTitle = firstImage.title.replace(/ - Image \d+$/, '');

      return {
        id: key,
        title: baseTitle,
        category: firstImage.category,
        date: firstImage.date,
        images: sortedImages,
        thumbnailImage: firstImage,
        createdAt: firstImage.createdAt ? (
          firstImage.createdAt instanceof Date 
            ? firstImage.createdAt.toISOString() 
            : firstImage.createdAt
        ) : undefined
      };
    });

    groups.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB.getTime() - dateA.getTime();
    });

    setImageGroups(groups);
  };

  const filterGroups = () => {
    if (selectedCategory === "All") {
      setFilteredGroups(imageGroups);
    } else {
      setFilteredGroups(imageGroups.filter((group) => group.category === selectedCategory));
    }
    setPage(1); // Reset to first page when category changes
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setError(null);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1); // Increment page to load next set
  };

  const getCategoryStyle = (category: string) =>
    categoryColors[category as keyof typeof categoryColors] || categoryColors.default;

  const openGroupViewer = (group: ImageGroup, startIndex: number = 0) => {
    setSelectedGroup(group);
    setSelectedImageIndex(startIndex);
  };

  const closeViewer = () => {
    setSelectedGroup(null);
  };

  const navigateImage = (direction: number) => {
    if (!selectedGroup) return;
    
    const newIndex = selectedImageIndex + direction;
    if (newIndex >= 0 && newIndex < selectedGroup.images.length) {
      setSelectedImageIndex(newIndex);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const displayedGroups = filteredGroups.slice(0, page * imagesPerPage); // Show images up to current page
  const hasMore = page * imagesPerPage < filteredGroups.length; // Check if more images exist
  const totalImages = images.length;

  if (loading && images.length === 0) {
    return (
      <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden py-16 md:py-24" ref={ref}>
        <motion.div
          style={{ y: y1 }}
          className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-200/30 to-yellow-300/30 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-10 left-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-xl"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin mx-auto mb-4 text-amber-400" />
            <p className="text-base md:text-lg text-gray-700 font-serif">Preparing your exclusive collection...</p>
          </div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden py-16 md:py-24" ref={ref}>
        <motion.div
          style={{ y: y1 }}
          className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-200/30 to-yellow-300/30 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-10 left-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-xl"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-400 text-base md:text-lg mb-4 font-serif">{error}</p>
            <Button onClick={() => loadImages()} variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 px-6 py-2 rounded-full shadow-lg text-sm md:text-base">
              Retry
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id="gallery" className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden py-16 md:py-24" ref={ref}>
      {/* Parallax Background Decorative elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-200/30 to-yellow-300/30 rounded-full blur-2xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-10 left-10 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16" data-aos="fade-down">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200 mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-base md:text-lg font-serif text-amber-800">Timeless Moments</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 mb-6 leading-tight">
            Elite Gallery
          </h2>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mx-auto mb-6" />

          <p className="text-base md:text-lg text-gray-700 font-serif max-w-3xl mx-auto mb-8 leading-relaxed">
            A distinguished assembly of community legacies, preserved in unparalleled sophistication.
            {totalImages > 0 && (
              <span className="block text-sm md:text-base text-gray-600 mt-3 italic">
                {imageGroups.length} elite anthologies • {totalImages} exquisite captures • Effortlessly refreshed
              </span>
            )}
          </p>
        </div>

        {/* Category Filters - Grid layout on mobile */}
        {categories.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center gap-3 mb-12 md:mb-16" data-aos="fade-up" data-aos-delay="150">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={`rounded-full px-6 py-2 transition-all duration-500 group ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-amber-700 to-amber-800 text-gray-100 shadow-lg hover:shadow-amber-500/30"
                    : "text-gray-600 border border-amber-400/50 hover:bg-amber-100/20 hover:text-amber-600 hover:border-amber-400"
                } backdrop-blur-lg font-serif text-sm md:text-base`}
              >
                {category}
                {category !== "All" && (
                  <span className="ml-2 text-sm opacity-70">
                    ({imageGroups.filter((group) => group.category === category).length})
                  </span>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Unique Layout: Premium Timeline View */}
        {displayedGroups.length === 0 ? (
          <div className="text-center py-24">
            <Camera className="h-16 w-16 md:h-20 md:w-20 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-serif text-gray-700 mb-4">No legacies preserved</h3>
            <p className="text-base md:text-lg text-gray-600 font-serif">
              {selectedCategory === "All"
                ? "The collection awaits its inaugural masterpiece."
                : `No anthologies in the ${selectedCategory} domain.`}
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400/20 to-transparent transform md:-translate-x-1/2" />
            
            {displayedGroups.map((group, index) => {
              const categoryStyle = getCategoryStyle(group.category);
              const isMultipleImages = group.images.length > 1;
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={group.id} 
                  className={`relative mb-16 md:mb-24 flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} items-start md:items-start`}
                  data-aos={isLeft ? "fade-right" : "fade-left"}
                  data-aos-delay={index * 200}
                >
                  {/* Date Marker */}
                  <div className="absolute left-4 md:left-1/2 top-12 md:top-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-4 py-2 border border-amber-200 shadow-lg">
                      <p className="text-xs md:text-sm text-amber-800 font-serif whitespace-nowrap">
                        {new Date(group.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Image Frame */}
                  <div 
                    className={`w-full md:w-1/2 p-3 md:p-6 cursor-pointer group ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}
                    onClick={() => openGroupViewer(group)}
                  >
                    <motion.div
                      whileHover={{
                        rotateX: -3,
                        rotateY: 3,
                        scale: 1.03,
                        transition: { type: "spring", stiffness: 200, damping: 15 },
                      }}
                      className="relative overflow-hidden rounded-xl shadow-lg border-2 border-double border-amber-400/30 bg-gradient-to-br from-white to-blue-50 transform transition-all duration-700 group-hover:shadow-amber-400/20 group-hover:border-amber-400/50"
                    >
                      <img
                        src={getThumbnailUrl(group.thumbnailImage.publicId, 800)}
                        alt={group.title}
                        className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = group.thumbnailImage.url;
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Category and Multi Indicator */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <Badge
                          className={`${categoryStyle.badge} shadow-md group-hover:scale-105 transition-transform duration-500 text-sm px-3 py-1`}
                        >
                          {group.category}
                        </Badge>
                        {isMultipleImages && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-amber-100/60 backdrop-blur-md rounded-full text-amber-800 text-sm font-serif">
                            <Images className="w-4 h-4 text-amber-600" />
                            {group.images.length}
                          </div>
                        )}
                      </div>

                      {/* Hover Prompt */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <p className="text-amber-800 text-base md:text-lg font-serif bg-amber-100/40 backdrop-blur-lg px-6 py-3 rounded-full shadow-lg">
                          {isMultipleImages ? `Unveil Anthology` : 'Behold Masterpiece'}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 p-3 md:p-6 ${isLeft ? 'md:pl-12' : 'md:pr-12'}`}>
                    <h3 className="font-serif text-xl md:text-2xl text-gray-800 mb-3">{group.title}</h3>
                    <p className="text-gray-700 text-sm md:text-base font-serif mb-3 leading-relaxed">
                      A captivating {group.category.toLowerCase()} narrative from {new Date(group.date).getFullYear()}.
                    </p>
                    {group.createdAt && (
                      <p className="text-xs md:text-sm text-gray-600 italic font-serif">
                        Inducted {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {isMultipleImages && (
                      <p className="text-amber-600 text-xs md:text-sm font-serif mt-2">
                        Comprising {group.images.length} distinguished captures
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Renew Collection for Next Page */}
        {hasMore && (
          <div className="text-center mt-12 md:mt-16" data-aos="fade-up" data-aos-delay="300">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-white to-blue-50 border-amber-400/50 text-amber-600 hover:bg-amber-100 hover:text-amber-800 transition-all duration-700 group shadow-lg hover:shadow-amber-400/20 backdrop-blur-lg rounded-full text-sm md:text-base font-serif"
            >
              <Camera className="h-5 w-5 mr-3 group-hover:rotate-6 transition-transform duration-500" />
              Renew Collection
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
            className="text-gray-600 hover:text-amber-600 transition-colors duration-300 text-sm md:text-base font-serif"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enhancing...
              </>
            ) : (
              "Refresh Collection"
            )}
          </Button>
        </div>
      </div>

      {/* ImageViewer Component */}
      <ImageViewer
        selectedGroup={selectedGroup}
        selectedImageIndex={selectedImageIndex}
        onClose={closeViewer}
        onNavigate={navigateImage}
        onImageSelect={handleImageSelect}
      />
    </Section>
  );
}