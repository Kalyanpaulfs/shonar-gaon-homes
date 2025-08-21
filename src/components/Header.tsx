import { useState, useEffect, MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SonarGaonLogo from "@/assets/Sonar_gaon_logo.png";
import AOS from "aos";
import "aos/dist/aos.css";

interface NavItem {
  name: string;
  href: string;
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeHash, setActiveHash] = useState<string>(window.location.hash || "#home");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const navigation: NavItem[] = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Facilities", href: "#facilities" },
    { name: "Events", href: "#events" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  const getCurrentSection = (): string => {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 100;
    const scrollY = window.scrollY + headerHeight + 50;

    for (let i = navigation.length - 1; i >= 0; i--) {
      const sectionId = navigation[i].href.substring(1);
      const element = document.getElementById(sectionId);

      if (element) {
        const offsetTop = element.offsetTop;
        if (scrollY >= offsetTop) {
          return navigation[i].href;
        }
      }
    }
    return "#home";
  };

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || "#home");

    const onScroll = () => {
      const currentSection = getCurrentSection();
      if (currentSection !== activeHash) {
        setActiveHash(currentSection);
        window.history.replaceState(null, null, currentSection);
      }
      setIsScrolled(window.scrollY > 50);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("scroll", throttledScroll);

    const initialSection = getCurrentSection();
    setActiveHash(initialSection);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [activeHash]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLImageElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 100;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, null, href);
      setActiveHash(href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "bg-gradient-to-r from-slate-900/90 via-teal-900/90 to-indigo-900/90 shadow-xl backdrop-blur-lg"
          : "bg-gradient-to-r from-slate-900/70 via-teal-900/70 to-indigo-900/70 backdrop-blur-md"
        } border-b border-teal-500/30`}
    >
      <nav className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20" data-aos="fade-down">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={SonarGaonLogo}
              alt="Sonar Gaon Society Logo"
              className="h-24 w-auto max-h-[110px] hover:scale-105 transform cursor-pointer"
              onClick={(e) => handleSmoothScroll(e, "#home")}
              data-aos="zoom-in"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2">
              {navigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`relative px-4 py-2 text-slate-100 hover:text-white font-medium transition-all duration-300 rounded-lg ${activeHash === item.href
                      ? "bg-gradient-to-r from-teal-500/40 to-indigo-500/40 text-white shadow-md"
                      : ""
                    }`}
                  data-aos="fade-up"
                  data-aos-delay={`${index * 100}`}
                >
                  <span>{item.name}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-400 hover:w-full transition-all duration-500 ease-out"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative text-slate-100 hover:text-white hover:bg-gradient-to-r hover:from-teal-500/30 hover:to-indigo-500/30 transition-all duration-300 group rounded-full p-2"
            >
              <div className="relative z-10">
                {isMobileMenuOpen ? (
                  <X className="h-7 w-7 transform group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="h-7 w-7 transform group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-teal-400/20 to-indigo-400/20 blur-lg transition-opacity duration-300 rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-700 ease-in-out overflow-hidden ${isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-slate-800/90 to-teal-900/90 border-t border-teal-500/20 backdrop-blur-lg rounded-b-xl">
            {navigation.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`block px-4 py-3 text-slate-100 hover:text-white font-medium transition-all duration-300 group relative rounded-lg ${activeHash === item.href
                    ? "bg-gradient-to-r from-teal-500/40 to-indigo-500/40 text-white shadow-md"
                    : ""
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                  {item.name}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-lg"></div>
              </a>
            ))}

          </div>
        </div>
      </nav>

      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-slate-500/10 pointer-events-none animate-pulse" />
    </header>
  );
}
