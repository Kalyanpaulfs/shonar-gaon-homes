import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SonarGaonLogo from "@/assets/Sonar_gaon_logo.png"; // ✅ Import your logo

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Facilities", href: "#facilities" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-md border-b border-purple-500/20 shadow-2xl">
      <nav className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 group flex items-center space-x-2 cursor-pointer">
            <img
              src={SonarGaonLogo}
              alt="Sonar Gaon Logo"
              className="h-14 w-auto sm:h-16 md:h-20 transition-transform duration-300 transform group-hover:scale-105"
            />
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-slate-200 hover:text-white font-medium transition-all duration-300 group overflow-hidden rounded-lg"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                    {item.name}
                  </span>

                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>

                  {/* Bottom border effect */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500 ease-out"></div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-xl transition-opacity duration-300 rounded-lg"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative text-slate-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 group"
            >
              <div className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg transition-opacity duration-300 rounded"></div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-slate-800/50 to-indigo-900/50 border-t border-purple-500/20 backdrop-blur-sm rounded-b-lg">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-slate-200 hover:text-white font-medium transition-all duration-300 group relative overflow-hidden rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                  {item.name}
                </span>

                {/* Mobile hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-lg"></div>

                {/* Left border accent */}
                <div className="absolute left-0 top-0 w-0 h-full bg-gradient-to-b from-blue-400 to-purple-400 group-hover:w-1 transition-all duration-300"></div>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Header glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none"></div>

      {/* Custom styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slideInFromTop {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          .animate-slide-in {
            animation: slideInFromTop 0.6s ease-out;
          }
        `,
        }}
      />
    </header>
  );
}
