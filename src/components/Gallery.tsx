import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder gallery items
const galleryItems = [
  {
    id: 1,
    title: "Diwali Celebration 2024",
    category: "Festival",
    image: "https://images.unsplash.com/photo-1478736817723-75e6b11b45fb?w=400&h=300&fit=crop&crop=center",
    date: "November 2024"
  },
  {
    id: 2,
    title: "Community Garden",
    category: "Landscape",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center",
    date: "October 2024"
  },
  {
    id: 3,
    title: "Children's Sports Day",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
    date: "September 2024"
  },
  {
    id: 4,
    title: "Annual Cultural Program",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop&crop=center",
    date: "August 2024"
  },
  {
    id: 5,
    title: "Independence Day Celebration",
    category: "National",
    image: "https://images.unsplash.com/photo-1561113202-09c9db8e6e5a?w=400&h=300&fit=crop&crop=center",
    date: "August 2024"
  },
  {
    id: 6,
    title: "Community Iftar",
    category: "Festival",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&crop=center",
    date: "March 2024"
  }
];

const categories = ["All", "Festival", "Cultural", "Sports", "Landscape", "National"];

const categoryColors = {
  Festival: "bg-orange-100 text-orange-800",
  Cultural: "bg-purple-100 text-purple-800",
  Sports: "bg-green-100 text-green-800",
  Landscape: "bg-blue-100 text-blue-800",
  National: "bg-red-100 text-red-800"
};

export function Gallery() {
  return (
    <Section id="gallery" className="bg-background">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Community Gallery
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Capturing precious moments of our community life, festivals, and celebrations.
        </p>
        
        {/* Admin Upload Notice */}
        <Card className="max-w-md mx-auto bg-accent-beige">
          <CardContent className="p-4 flex items-center gap-3">
            <Upload className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-sm font-medium text-primary">Admin Access</p>
              <p className="text-xs text-muted-foreground">
                Society committee can upload photos here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 animate-slide-up">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <Card 
            key={item.id} 
            className="group overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4">
                <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                  {item.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12 animate-fade-in">
        <Button variant="outline" size="lg" className="px-8">
          <Camera className="h-4 w-4 mr-2" />
          Load More Photos
        </Button>
      </div>
    </Section>
  );
}