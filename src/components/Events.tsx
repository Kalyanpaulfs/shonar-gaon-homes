import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Megaphone, Sparkles } from "lucide-react";

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
  Cultural: { 
    badge: "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
    bg: "from-purple-50 to-violet-50",
    accent: "from-purple-400 to-violet-500"
  },
  Official: { 
    badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    bg: "from-blue-50 to-indigo-50",
    accent: "from-blue-400 to-indigo-500"
  },
  Sports: { 
    badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    bg: "from-green-50 to-emerald-50",
    accent: "from-green-400 to-emerald-500"
  },
  Festival: { 
    badge: "bg-gradient-to-r from-orange-500 to-amber-600 text-white",
    bg: "from-orange-50 to-amber-50",
    accent: "from-orange-400 to-amber-500"
  },
  maintenance: { 
    badge: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    bg: "from-red-50 to-rose-50",
    accent: "from-red-400 to-rose-500"
  },
  security: { 
    badge: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white",
    bg: "from-yellow-50 to-amber-50",
    accent: "from-yellow-400 to-amber-500"
  },
  community: { 
    badge: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white",
    bg: "from-teal-50 to-cyan-50",
    accent: "from-teal-400 to-cyan-500"
  }
};

export function Events() {
  return (
    <Section id="events" className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-16 right-16 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-amber-200/25 to-orange-300/25 rounded-full blur-xl animate-bounce"></div>

      <div className="relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Community Updates</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Events & Announcements
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with community events, cultural celebrations, and important announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Upcoming Events
              </h3>
            </div>
            
            <div className="space-y-6">
              {events.map((event, index) => (
                <Card 
                  key={event.title} 
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[event.type as keyof typeof typeColors].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Side accent bar */}
                  <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${typeColors[event.type as keyof typeof typeColors].accent} group-hover:w-2 transition-all duration-500`}></div>
                  
                  <CardHeader className="relative pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                        {event.title}
                      </CardTitle>
                      <Badge className={`${typeColors[event.type as keyof typeof typeColors].badge} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        {event.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <p className="text-slate-600 mb-6 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                      {event.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                        <div className={`p-2 bg-gradient-to-br ${typeColors[event.type as keyof typeof typeColors].accent} rounded-lg`}>
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{event.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                        <div className={`p-2 bg-gradient-to-br ${typeColors[event.type as keyof typeof typeColors].accent} rounded-lg`}>
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                        <div className={`p-2 bg-gradient-to-br ${typeColors[event.type as keyof typeof typeColors].accent} rounded-lg`}>
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Announcements */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Recent Announcements
              </h3>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <Card 
                  key={announcement.title} 
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Card background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[announcement.type as keyof typeof typeColors].bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${typeColors[announcement.type as keyof typeof typeColors].accent}`}></div>
                  
                  <CardContent className="relative p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                        {announcement.title}
                      </h4>
                      <Badge 
                        className={`${typeColors[announcement.type as keyof typeof typeColors].badge} text-xs shadow-md group-hover:scale-105 transition-transform duration-300`}
                      >
                        {announcement.type}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {announcement.date}
                    </p>
                    
                    <p className="text-sm leading-relaxed text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                      {announcement.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Community Notice */}
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
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `
      }} />
    </Section>
  );
}