import React, { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Megaphone, Sparkles } from "lucide-react";
import { fetchEvents, fetchAnnouncements } from "../data/firebaseServices";
import AOS from "aos";
import "aos/dist/aos.css";

const typeColors = {
  Cultural: {
    badge: "bg-gradient-to-r from-purple-500 to-violet-600 text-white",
    bg: "from-purple-50 to-violet-50",
    accent: "from-purple-400 to-violet-500",
  },
  Official: {
    badge: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
    bg: "from-blue-50 to-indigo-50",
    accent: "from-blue-400 to-indigo-500",
  },
  Sports: {
    badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    bg: "from-green-50 to-emerald-50",
    accent: "from-green-400 to-emerald-500",
  },
  Festival: {
    badge: "bg-gradient-to-r from-orange-500 to-amber-600 text-white",
    bg: "from-orange-50 to-amber-50",
    accent: "from-orange-400 to-amber-500",
  },
};

const announcementTypeColors = {
  general: {
    badge: "bg-gradient-to-r from-slate-500 to-gray-600 text-white",
    bg: "from-slate-50 to-gray-50",
  },
  urgent: {
    badge: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    bg: "from-red-50 to-rose-50",
  },
  maintenance: {
    badge: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white",
    bg: "from-yellow-50 to-amber-50",
  },
  community: {
    badge: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    bg: "from-green-50 to-emerald-50",
  }
};

// Skeleton Loader Component
function SkeletonCard({ lines = 3 }) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        {Array.from({ length: lines }).map((_, idx) => (
          <div key={idx} className="h-4 bg-slate-200 rounded animate-pulse mb-2"></div>
        ))}
      </CardContent>
    </Card>
  );
}

export function Events() {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    // Initialize AOS animations
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        const formattedEvents = eventsData.map((e) => ({
          ...e,
          date:
            e.date?.seconds != null
              ? new Date(e.date.seconds * 1000).toLocaleDateString()
              : e.date,
          time:
            e.time?.seconds != null
              ? new Date(e.time.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : e.time,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const announcementsData = await fetchAnnouncements();
        const formattedAnnouncements = announcementsData.map((a) => ({
          ...a,
          date: a.date?.seconds
            ? new Date(a.date.seconds * 1000).toLocaleDateString()
            : a.date,
        }));
        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error("Error loading announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    loadAnnouncements();
  }, []);

  return (
    <Section
      id="events"
      className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-16 right-16 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-2xl animate-float" />
      <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-amber-200/25 to-orange-300/25 rounded-full blur-xl animate-bounce" />

      <div className="relative z-10">
        <div className="text-center mb-16 animate-fade-in" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Community Updates</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Events & Announcements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mx-auto mb-6" />
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stay updated with community events, cultural celebrations, and important announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Events Section */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Upcoming Events</h3>
            </div>

            {loadingEvents ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} lines={3} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-slate-600">No upcoming events found.</p>
            ) : (
              <div className="space-y-6">
                {events.map((event, index) => (
                  <Card
                    key={event.id || index}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        typeColors[event.type]?.bg || typeColors.Cultural.bg
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <div
                      className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${
                        typeColors[event.type]?.accent || typeColors.Cultural.accent
                      } group-hover:w-2 transition-all duration-500`}
                    />
                    <CardHeader className="relative pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                          {event.title}
                        </CardTitle>
                        <Badge
                          className={`${
                            typeColors[event.type]?.badge || typeColors.Cultural.badge
                          } shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        >
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
                          <div
                            className={`p-2 bg-gradient-to-br ${
                              typeColors[event.type]?.accent || typeColors.Cultural.accent
                            } rounded-lg`}
                          >
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                          <div
                            className={`p-2 bg-gradient-to-br ${
                              typeColors[event.type]?.accent || typeColors.Cultural.accent
                            } rounded-lg`}
                          >
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
                          <div
                            className={`p-2 bg-gradient-to-br ${
                              typeColors[event.type]?.accent || typeColors.Cultural.accent
                            } rounded-lg`}
                          >
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div data-aos="fade-left">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Recent Announcements</h3>
            </div>
            
            {loadingAnnouncements ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <SkeletonCard key={i} lines={2} />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-slate-500 text-sm">No announcements available yet.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <Card
                    key={announcement.id || index}
                    className="group relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        announcementTypeColors[announcement.type]?.bg || announcementTypeColors.general.bg
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    
                    <CardHeader className="relative pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base text-slate-800">
                          {announcement.title}
                        </CardTitle>
                        <Badge className={`${
                          announcementTypeColors[announcement.type]?.badge || announcementTypeColors.general.badge
                        }`}>
                          {announcement.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative">
                      <p className="text-sm text-slate-600 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{announcement.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <Card
              className="mt-6 bg-gradient-primary shadow-glow animate-float"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
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
    </Section>
  );
}
