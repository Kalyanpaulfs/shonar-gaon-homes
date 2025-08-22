"use client";
import React, { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { fetchEvents, fetchAnnouncements } from "../data/firebaseServices";
import AOS from "aos";
import "aos/dist/aos.css";

const typeColors: Record<string, string> = {
  Cultural: "from-teal-600 to-cyan-700",
  Official: "from-blue-600 to-indigo-700",
  Sports: "from-green-600 to-emerald-700",
  Festival: "from-amber-600 to-orange-700",
};

const announcementTypeColors: Record<string, string> = {
  general: "from-gray-600 to-slate-700",
  urgent: "from-red-600 to-rose-700",
  maintenance: "from-yellow-600 to-amber-700",
  community: "from-green-600 to-emerald-700",
};

// Skeleton Loader
function SkeletonLine() {
  return (
    <div className="h-4 w-3/4 bg-gray-200/50 rounded animate-pulse mb-3" />
  );
}

export function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-quad" });
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents();
        const formattedEvents = eventsData.map((e: any) => ({
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
        const formattedAnnouncements = announcementsData.map((a: any) => ({
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
      className="relative bg-gray-50 py-20 overflow-x-hidden w-full"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 
                   bg-gradient-to-br from-teal-200/30 to-cyan-300/30 rounded-full blur-2xl 
                   animate-pulse -translate-x-1/3 -translate-y-1/3"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-60 h-60 sm:w-80 sm:h-80 
                   bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 rounded-full blur-2xl 
                   animate-float translate-x-1/4 translate-y-1/4"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-4">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">
              Community Updates
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 mb-4 tracking-tight">
            Events & Announcements
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Stay updated with our community's upcoming events and latest
            announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full overflow-hidden">
          {/* Timeline Events */}
          <div className="lg:col-span-2 w-full" data-aos="fade-right">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
              <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-600 text-white">
                <Calendar className="w-5 h-5" />
              </span>
              Upcoming Events
            </h3>

            {loadingEvents ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLine key={i} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-600">No upcoming events.</p>
            ) : (
              <div className="relative border-l-2 border-gray-300 ml-5 space-y-8 w-full overflow-hidden">
                {events.map((event: any, index: number) => (
                  <div
                    key={event.id || index}
                    className="relative pl-6"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {/* Timeline Dot */}
                    <span
                      className={`absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${
                        typeColors[event.type] || typeColors.Cultural
                      }`}
                    />

                    {/* Event Content */}
                    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow w-full">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-base text-gray-800 break-words">
                          {event.title}
                        </h4>
                        <Badge
                          className={`shrink-0 bg-gradient-to-r ${
                            typeColors[event.type] || typeColors.Cultural
                          } text-white`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 break-words">
                        {event.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                        <InfoRow
                          icon={<Calendar className="w-4 h-4" />}
                          label={event.date}
                        />
                        <InfoRow
                          icon={<Clock className="w-4 h-4" />}
                          label={event.time}
                        />
                        <InfoRow
                          icon={<MapPin className="w-4 h-4" />}
                          label={event.location}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcement Feed */}
          <div className="w-full" data-aos="fade-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
              <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Megaphone className="w-5 h-5" />
              </span>
              Latest Announcements
            </h3>

            {loadingAnnouncements ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <SkeletonLine key={i} />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-gray-500 text-sm">No announcements yet.</p>
            ) : (
              <div className="space-y-5">
                {announcements.map((a: any, index: number) => (
                  <div
                    key={a.id || index}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow w-full"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-base text-gray-800 break-words">
                        {a.title}
                      </h4>
                      <Badge
                        className={`shrink-0 bg-gradient-to-r ${
                          announcementTypeColors[a.type] ||
                          announcementTypeColors.general
                        } text-white`}
                      >
                        {a.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 break-words">
                      {a.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{a.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div
              className="mt-6 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Users className="h-6 w-6 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Join Our Community Group</h4>
              <p className="text-white/80 text-xs">
                Get instant updates in our WhatsApp community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// Info row component
function InfoRow({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md shadow-sm w-full overflow-hidden">
      <span className="text-gray-600 shrink-0">{icon}</span>
      <span className="font-medium text-xs break-words">{label}</span>
    </div>
  );
}
