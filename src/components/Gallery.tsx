import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { galleryItems } from "@/data/galleryData";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = ["All", "Festival", "Cultural", "Sports", "Landscape", "National"];

const categoryColors = {
  Festival: {
    badge: "bg-gradient-to-r from-orange-500 to-amber-600 text-white",
    bg: "from-orange-50 to-amber-50",
    accent: "from-orange-400 to-amber-500"
  },
  Cultural: {
    badge: "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
    bg: "from-purple-50 to-violet-50",
    accent: "from-purple-400 to-violet-500"
  },
  Sports: {
    badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    bg: "from-green-50 to-emerald-50",
    accent: "from-green-400 to-emerald-500"
  },
  Landscape: {
    badge: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white",
    bg: "from-blue-50 to-cyan-50",
    accent: "from-blue-400 to-cyan-500"
  },
  National: {
    badge: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    bg: "from-red-50 to-rose-50",
    accent: "from-red-400 to-rose-500"
  }
};

export function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState(galleryItems);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true
    });
  }, []);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => item.category === category));
    }
  };

  return (
    <Section
      id="gallery"
      className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl animate-bounce"></div>

      <div className="relative z-10">
        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Community Memories</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            Community Gallery
          </h2>

          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mb-6"></div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Capturing precious moments of our community life, festivals, and celebrations.
          </p>
        </div>

        {/* Category Filters */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {categories.map((category, index) => (
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
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category badge */}
                <div className="absolute top-4 right-4">
                  <Badge
                    className={`${categoryColors[item.category as keyof typeof categoryColors].badge} shadow-lg group-hover:scale-105 transition-transform duration-300`}
                  >
                    {item.category}
                  </Badge>
                </div>

                {/* Hover overlay content */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full mb-2">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium">View Photo</p>
                  </div>
                </div>

                {/* Card background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryColors[item.category as keyof typeof categoryColors].bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>
              </div>

              <CardContent className="p-4 relative">
                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                  {item.date}
                </p>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${categoryColors[item.category as keyof typeof categoryColors].accent} group-hover:w-full transition-all duration-700 ease-out`}
                ></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div
          className="text-center mt-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 bg-white border-slate-300 text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-slate-800 transition-all duration-300 group shadow-lg hover:shadow-xl"
          >
            <Camera className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Load More Photos
          </Button>
        </div>
      </div>
    </Section>
  );
}
