"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import {
  Baby,
  Building2,
  Shield,
  Leaf,
  Car,
  User,
  Sparkles,
} from "lucide-react";

const colors = [
  {
    color: "from-teal-600 to-cyan-700",
    bgColor: "from-teal-100 to-cyan-100",
  },
  {
    color: "from-blue-600 to-indigo-700",
    bgColor: "from-blue-100 to-indigo-100",
  },
  {
    color: "from-green-600 to-emerald-700",
    bgColor: "from-green-100 to-emerald-100",
  },
  {
    color: "from-gray-600 to-slate-700",
    bgColor: "from-gray-100 to-slate-100",
  },
  {
    color: "from-amber-600 to-orange-700",
    bgColor: "from-amber-100 to-orange-100",
  },
  {
    color: "from-cyan-600 to-blue-700",
    bgColor: "from-cyan-100 to-blue-100",
  },
];

const facilities = [
  {
    icon: Baby,
    title: "Children's Park",
    description:
      "Safe and fun play area with modern equipment for kids of all ages.",
  },
  {
    icon: Building2,
    title: "Community Halls",
    description:
      "Spacious halls for events, celebrations, and community gatherings.",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "Round-the-clock security with trained personnel and CCTV monitoring.",
  },
  {
    icon: Leaf,
    title: "Landscaped Gardens",
    description:
      "Beautiful gardens with seasonal flowers and well-maintained green spaces.",
  },
  {
    icon: User,
    title: "Walking Tracks",
    description:
      "Dedicated jogging and walking paths for health and fitness enthusiasts.",
  },
  {
    icon: Car,
    title: "Parking Spaces",
    description:
      "Ample parking facilities for residents and guests with proper allocation.",
  },
];

function FacilitiesDesktop() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="facilities"
      ref={containerRef}
      className="relative hidden lg:block h-[400vh] sm:h-[500vh] lg:h-[600vh] bg-gray-50 pt-20 lg:pt-24"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-start px-2 py-4 sm:py-6 lg:py-16 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-cyan-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 rounded-full blur-2xl animate-float" />

        {/* Header - Added more top padding and margin */}
        <div className="flex-shrink-0 pb-4 text-center z-20 w-full px-2 sm:px-4 pt-8 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 rounded-full border border-gray-200 mb-3 sm:mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wide">
                PREMIUM AMENITIES
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-teal-800 leading-snug pb-2 tracking-tight">
              Facilities & Amenities
            </h1>
          </motion.div>
        </div>

        {/* Facility Cards */}
        <div className="flex-1 flex items-center justify-center relative w-full px-2 sm:px-3">
          {facilities.map((facility, i) => {
            const start = i / facilities.length;
            const end = (i + 1) / facilities.length;

            const y = useTransform(scrollYProgress, [start, end], ["100%", "0%"]);
            const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
            const scale = useTransform(
              scrollYProgress,
              [start, start + 0.1, end - 0.1, end],
              [0.95, 1, 1, 0.95]
            );

            const IconComponent = facility.icon;
            const { color, bgColor } = colors[i];

            return (
              <motion.div
                key={i}
                style={{ y, opacity, scale }}
                className={`relative w-[420px] h-[280px] p-5 rounded-lg bg-gradient-to-br ${bgColor} border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${color} rounded-lg shadow-sm mb-3`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    {facility.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-[300px]">
                    {facility.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FacilitiesMobile() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-quad" });
  }, []);

  return (
    <Section
      id="facilities"
      className="relative bg-gray-50 lg:hidden py-16 pt-20 lg:pt-24"
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        {/* Background Glow */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-to-br from-teal-200/30 to-cyan-300/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-200/30 to-blue-300/30 rounded-full blur-2xl animate-float" />

        {/* Header with additional top margin */}
        <div className="text-center mb-8 mt-8" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-4">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-semibold text-gray-700">
              PREMIUM AMENITIES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-teal-800 leading-snug pb-2 tracking-tight">
            Facilities & Amenities
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            const { color, bgColor } = colors[index];
            return (
              <Card
                key={facility.title}
                className={`relative overflow-hidden border border-gray-200 shadow-md bg-gradient-to-br ${bgColor}`}
                data-aos="zoom-in-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-4 text-center">
                  <div className="mb-3 flex justify-center">
                    <div
                      className={`p-3 bg-gradient-to-br ${color} rounded-lg shadow-sm`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-gray-800">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export default function FacilitiesSection() {
  return (
    <>
      <FacilitiesDesktop />
      <FacilitiesMobile />
    </>
  );
}