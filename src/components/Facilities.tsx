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

/* Common colors and facilities data for consistency */
const colors = [
  {
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-50",
  },
  {
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
  },
  {
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
  },
  {
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50",
  },
  {
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-50 to-amber-50",
  },
  {
    color: "from-cyan-500 to-blue-600",
    bgColor: "from-cyan-50 to-blue-50",
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

/* Desktop view with colored cards and fixed sizing */
function FacilitiesDesktop() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="facilities" // ✅ Added id here
      ref={containerRef}
      className="relative hidden lg:block h-[400vh] sm:h-[500vh] lg:h-[600vh] bg-slate-100"
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-start px-2 py-4 sm:py-6 lg:py-20 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 pb-4 text-center z-20 w-full px-2 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 rounded-full border border-slate-200 mb-3 sm:mb-4 shadow-lg backdrop-blur-sm">
              <span className="text-xs sm:text-sm">✨</span>
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-700 tracking-wide">
                PREMIUM AMENITIES
              </span>
              <span className="text-xs sm:text-sm">✨</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-snug pb-2">
              Facilities &{" "}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Amenities
              </span>
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
                className={`relative w-[480px] h-[320px] p-6 rounded-2xl 
                  bg-gradient-to-br ${bgColor} border border-slate-200 shadow-md 
                  hover:shadow-xl hover:scale-105 transition-transform duration-300`}
              >
                {/* Top Accent */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-14 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-full"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                  <div
                    className={`inline-flex items-center justify-center 
                      w-20 h-20 bg-gradient-to-br ${bgColor} border border-blue-200 rounded-xl shadow-sm mb-4`}
                  >
                    <IconComponent
                      className={`w-10 h-10 text-gradient-to-r from-blue-600 to-indigo-700 text-blue-700`}
                    />
                  </div>

                  <h2
                    className={`text-2xl font-bold mb-3 text-transparent bg-gradient-to-r ${color} bg-clip-text`}
                  >
                    {facility.title}
                  </h2>

                  <p className="text-gray-700 text-sm leading-relaxed max-w-[320px]">
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

/* Mobile/Tablet version with updated heading size */
function FacilitiesMobile() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out" });
  }, []);

  return (
    <Section
      id="facilities" // ✅ Already had id here
      className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden lg:hidden"
    >
      <div className="relative z-10 px-4">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">
              Premium Amenities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-snug pb-2">
            Facilities & Amenities
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            const { color, bgColor } = colors[index];
            return (
              <Card
                key={facility.title}
                className="group relative overflow-hidden border-0 shadow-lg bg-white"
                data-aos="zoom-in-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-5 blur-xl`}
                ></div>
                <CardContent className="relative p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`p-4 bg-gradient-to-br ${color} rounded-xl shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
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

/* Combined export */
export default function FacilitiesSection() {
  return (
    <>
      <FacilitiesDesktop />
      <FacilitiesMobile />
    </>
  );
}
