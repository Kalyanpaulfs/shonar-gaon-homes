import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TreePine, 
  Building2, 
  Shield, 
  Flower2, 
  Route, 
  Car,
  Users,
  Baby
} from "lucide-react";

const facilities = [
  {
    icon: Baby,
    title: "Children's Park",
    description: "Safe and fun play area with modern equipment for kids of all ages"
  },
  {
    icon: Building2,
    title: "Community Halls",
    description: "Spacious halls for events, celebrations, and community gatherings"
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security with trained personnel and CCTV monitoring"
  },
  {
    icon: Flower2,
    title: "Landscaped Gardens",
    description: "Beautiful gardens with seasonal flowers and well-maintained green spaces"
  },
  {
    icon: Route,
    title: "Walking Tracks",
    description: "Dedicated jogging and walking paths for health and fitness enthusiasts"
  },
  {
    icon: Car,
    title: "Parking Spaces",
    description: "Ample parking facilities for residents and guests with proper allocation"
  }
];

export function Facilities() {
  return (
    <Section id="facilities" className="bg-background">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Facilities & Amenities
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience modern living with carefully curated amenities designed to enhance 
          your lifestyle and bring the community together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map((facility, index) => (
          <Card 
            key={facility.title} 
            className="shadow-card hover:shadow-elegant transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-accent-beige rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <facility.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">
                {facility.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center animate-fade-in">
        <Card className="bg-gradient-secondary shadow-glow max-w-2xl mx-auto">
          <CardContent className="p-8">
            <Users className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-secondary-foreground mb-4">
              Community First
            </h3>
            <p className="text-secondary-foreground/90 leading-relaxed">
              All our facilities are designed with community interaction in mind, 
              fostering friendships and creating lasting memories for residents of all ages.
            </p>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}