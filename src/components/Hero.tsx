import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Replace the path below with the actual path to your hero image file
import heroImage from "@/assets/Sonar_gaon.png";

export function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, // Replay animation on scroll up/down
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sonar Gaon Bungalow Community"
          className="w-full h-full object-cover"
          data-aos="zoom-in"
        />
        {/* Enhanced overlay for better text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-slate-800/65 to-slate-900/80"
          data-aos="fade-in"
          data-aos-delay="200"
        ></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center px-4 md:px-6 lg:px-8"
        data-aos="fade-up"
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="block bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter brightness-110">
              Sonar Gaon
            </span>
            <span className="block text-lg md:text-xl lg:text-2xl font-normal mt-2 text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Bungalow Project
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl lg:text-3xl mb-8 font-serif italic text-cyan-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            "A Community Where Traditions Meet Modern Living"
          </p>

          <p
            className="text-lg md:text-xl mb-12 text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Experience the perfect blend of contemporary comfort and timeless
            values in our beautifully designed residential community.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 text-lg shadow-[0_4px_20px_rgba(245,158,11,0.4)] transform hover:scale-105 transition-all duration-300 border-0 hover:shadow-[0_6px_25px_rgba(245,158,11,0.5)]"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Our Community
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-300 text-cyan-100 hover:bg-cyan-300 hover:text-slate-900 font-semibold px-8 py-4 text-lg shadow-[0_4px_15px_rgba(0,0,0,0.3)] backdrop-blur-md bg-slate-900/30 transform hover:scale-105 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(103,232,249,0.3)]"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced floating elements with better visibility */}
      <div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-xl animate-float shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        data-aos="fade-right"
      ></div>
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-300/25 to-blue-400/25 rounded-full blur-2xl animate-pulse shadow-[0_0_40px_rgba(103,232,249,0.2)]"
        data-aos="fade-left"
      ></div>
      <div
        className="absolute bottom-32 left-20 w-16 h-16 bg-gradient-to-br from-purple-400/35 to-pink-400/35 rounded-full blur-lg animate-bounce shadow-[0_0_25px_rgba(168,85,247,0.3)]"
        data-aos="fade-right"
      ></div>

      {/* Enhanced Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <div className="bg-slate-900/40 backdrop-blur-md rounded-full p-3 shadow-[0_4px_15px_rgba(0,0,0,0.4)] border border-cyan-300/30">
          <ArrowDown className="h-6 w-6 text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
        </div>
      </div>

      {/* Custom animations with inline styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `,
        }}
      />
    </section>
  );
}