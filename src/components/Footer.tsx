import { useEffect } from "react";
import { Heart, Phone, Mail, MapPin, Code, ExternalLink } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "About Society", href: "#about" },
    { name: "Facilities", href: "#facilities" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact Us", href: "#contact" }
  ];

  const services = [
    "Website Development",
    "React Applications",
    "Modern UI/UX Design",
    "Responsive Layouts",
    "Custom Solutions"
  ];

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true
    });
  }, []);

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 text-slate-200 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none"></div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Society Info */}
          <div className="lg:col-span-2" data-aos="fade-up">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Sonar Gaon Bungalow Project
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              A vibrant residential community where traditions meet modern living. 
              Experience the perfect blend of comfort, security, and community spirit 
              in our beautifully designed bungalow project.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm group" data-aos="fade-right" data-aos-delay="100">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">
                  Sonar Gaon Project, Bibirhat, Joka - 743377
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm group" data-aos="fade-right" data-aos-delay="200">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Phone className="h-4 w-4 text-purple-400" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm group" data-aos="fade-right" data-aos-delay="300">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Mail className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">info@Sonargaon.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="150">
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={link.name} data-aos="fade-left" data-aos-delay={index * 100}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-all duration-300 text-sm relative group inline-block"
                  >
                    <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 inline-block">
                      {link.name}
                    </span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Website Development Credit */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <Code className="h-4 w-4 text-green-400" />
              Website Development
            </h4>
            <div className="space-y-4">
              <div
                className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group"
                data-aos="zoom-in"
                data-aos-delay="350"
              >
                <p className="text-sm text-slate-300 mb-2 group-hover:text-white transition-colors duration-300">
                  This website was crafted with modern web technologies
                </p>
                <div className="text-xs space-y-1">
                  {services.map((service, index) => (
                    <div
                      key={service}
                      className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors duration-300"
                      data-aos="fade-left"
                      data-aos-delay={index * 100 + 400}
                    >
                      <div className="w-1 h-1 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center" data-aos="fade-up" data-aos-delay="500">
                <a
                  href="https://wa.me/917004516415?text=Hi%2C%20I%20am%20interested%20in%20creating%20a%20website.%20Please%20share%20the%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 hover:border-green-500/50 text-sm text-slate-300 hover:text-white transition-all duration-300 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-300">Need a website?</span>
                  <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/20 mt-8 pt-8" data-aos="fade-up" data-aos-delay="200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-300 text-sm">
              © {currentYear} Sonar Gaon Bungalow Project. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <p className="text-slate-400 text-sm flex items-center gap-1 group">
                Made with 
                <Heart className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform duration-300" /> 
                for our society
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
    </footer>
  );
}
