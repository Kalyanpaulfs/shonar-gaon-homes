import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Replace the path below with the actual path to your hero image file
import heroImage from "@/assets/hero-community.jpg";

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
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-indigo-900/40 to-purple-900/50"
          data-aos="fade-in"
          data-aos-delay="200"
        ></div>
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center text-white px-4 md:px-6 lg:px-8"
        data-aos="fade-up"
      >
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-200 to-gold-300 bg-clip-text text-transparent drop-shadow-2xl">
              Sonar Gaon
            </span>
            <span className="block text-lg md:text-xl lg:text-2xl font-normal mt-2 text-amber-200">
              Bungalow Project
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl lg:text-3xl mb-8 font-serif italic text-blue-200 drop-shadow-md"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            "A Community Where Traditions Meet Modern Living"
          </p>

          <p
            className="text-lg md:text-xl mb-12 text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm"
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
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
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
              className="border-2 border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-slate-900 font-semibold px-8 py-4 text-lg shadow-lg backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300"
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

      {/* Floating elements for visual interest */}
      <div
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-amber-300/20 to-yellow-400/20 rounded-full blur-xl animate-float"
        data-aos="fade-right"
      ></div>
      <div
        className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-300/15 to-indigo-400/15 rounded-full blur-2xl animate-pulse"
        data-aos="fade-left"
      ></div>
      <div
        className="absolute bottom-32 left-20 w-16 h-16 bg-gradient-to-br from-purple-300/25 to-pink-400/25 rounded-full blur-lg animate-bounce"
        data-aos="fade-right"
      ></div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <ArrowDown className="h-6 w-6 text-blue-300" />
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
