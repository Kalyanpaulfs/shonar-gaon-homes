"use client";

import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { Home, TreePine, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CountUp from "react-countup";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  // Parallax movement
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Ref for stats section
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { margin: "-100px" });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <Section
      ref={ref}
      id="about"
      className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
    >
      {/* Parallax Background Decorative elements */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-300/30 rounded-full blur-2xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-xl"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Content */}
        <div className="space-y-8" data-aos="fade-up">
          <div className="space-y-6" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200">
              <Home className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Premium Community Living
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-snug pb-2">
              About Our Society
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </div>

          <div className="space-y-6" data-aos="fade-up" data-aos-delay="150">
            <p className="text-lg text-slate-700 leading-relaxed">
              Sonar Gaon Bungalow Project is a vibrant residential community
              featuring beautiful bungalows, lush green spaces, and a close-knit
              neighborhood spirit. Our community is thoughtfully designed to
              provide residents with a harmonious blend of modern amenities and
              natural beauty.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nestled in a serene environment, we offer a peaceful retreat from
              the hustle and bustle of city life while maintaining connectivity
              to essential services and urban conveniences.
            </p>
          </div>

          {/* Stats Cards */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg" data-aos="zoom-in">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                    {isStatsInView ? <CountUp start={0} end={150} duration={3} suffix="+" /> : 0}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Beautiful Bungalows
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 border-0 shadow-lg" data-aos="zoom-in" data-aos-delay="100">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                    {isStatsInView ? <CountUp start={0} end={25} duration={3} suffix=" Acres" /> : 0}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Acres of Greenery
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50 border-0 shadow-lg sm:col-span-2" data-aos="zoom-in" data-aos-delay="200">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
                    {isStatsInView ? <CountUp start={0} end={500} duration={3} suffix="+" /> : 0}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Happy Families
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section with Tilt Effect */}
        <div className="space-y-6" data-aos="fade-left">
          <motion.div
            whileHover={{
              rotateX: -5,
              rotateY: 5,
              scale: 1.02,
              transition: { type: "spring", stiffness: 200, damping: 15 },
            }}
            className="rounded-xl shadow-2xl overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10352.38894679404!2d88.20978373257131!3d22.405782608781863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02633c16f90e63%3A0x1ef3e9e541dc5f0f!2sSonargaon%20Bungalow%20Project!5e0!3m2!1sen!2sin!4v1754338702906!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sonar Gaon Location"
              className="w-full h-96 rounded-xl"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
