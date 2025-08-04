import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const events = [
  {
    title: "Annual Cultural Festival",
    date: "December 15, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Main Community Hall",
    type: "Cultural",
    description: "Join us for an evening of music, dance, and cultural performances celebrating our diverse community.",
    status: "upcoming"
  },
  {
    title: "Society Annual Meeting",
    date: "January 10, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Community Hall A",
    type: "Official",
    description: "Important annual meeting to discuss society matters and future plans.",
    status: "upcoming"
  },
  {
    title: "Children's Sports Day",
    date: "January 25, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Children's Park & Open Area",
    type: "Sports",
    description: "Fun-filled sports activities for children with prizes and refreshments.",
    status: "upcoming"
  },
  {
    title: "Holi Celebration",
    date: "March 14, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Central Garden Area",
    type: "Festival",
    description: "Celebrate the festival of colors with the entire community.",
    status: "upcoming"
  }
];

const announcements = [
  {
    title: "Water Supply Maintenance",
    date: "December 8, 2024",
    type: "maintenance",
    content: "Water supply will be temporarily suspended from 10 AM to 2 PM for maintenance work."
  },
  {
    title: "New Security Guidelines",
    date: "December 5, 2024",
    type: "security",
    content: "Updated visitor policy now requires advance registration. Please inform guests beforehand."
  },
  {
    title: "Garden Beautification Drive",
    date: "December 1, 2024",
    type: "community",
    content: "Join our monthly garden beautification drive this Saturday. Tools and refreshments provided."
  }
];

const typeColors = {
  Cultural: "bg-purple-100 text-purple-800",
  Official: "bg-blue-100 text-blue-800",
  Sports: "bg-green-100 text-green-800",
  Festival: "bg-orange-100 text-orange-800",
  maintenance: "bg-red-100 text-red-800",
  security: "bg-yellow-100 text-yellow-800",
  community: "bg-primary/10 text-primary"
};

export function Events() {
  return (
    <Section id="events" className="bg-accent-beige">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Events & Announcements
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay updated with community events, cultural celebrations, and important announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-primary mb-6 animate-slide-up">
            Upcoming Events
          </h3>
          <div className="space-y-6">
            {events.map((event, index) => (
              <Card 
                key={event.title} 
                className="shadow-card hover:shadow-elegant transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-primary">{event.title}</CardTitle>
                    <Badge className={typeColors[event.type as keyof typeof typeColors]}>
                      {event.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-6 animate-slide-up">
            Recent Announcements
          </h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Card 
                key={announcement.title} 
                className="shadow-card animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-primary text-sm">{announcement.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${typeColors[announcement.type as keyof typeof typeColors]}`}
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{announcement.date}</p>
                  <p className="text-sm leading-relaxed">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Notice */}
          <Card className="mt-6 bg-gradient-primary shadow-glow animate-float">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary-foreground mx-auto mb-3" />
              <h4 className="font-semibold text-primary-foreground mb-2">
                Community WhatsApp Group
              </h4>
              <p className="text-primary-foreground/90 text-sm">
                Join our community group for instant updates and quick communication
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}