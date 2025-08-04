import { Heart, Phone, Mail, MapPin } from "lucide-react";

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

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Society Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-secondary">
              Shonar Gaon Bungalow Project
            </h3>
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              A vibrant residential community where traditions meet modern living. 
              Experience the perfect blend of comfort, security, and community spirit 
              in our beautifully designed bungalow project.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Sector 12, New Town, Kolkata - 700156</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@shonargaon.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-secondary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-secondary">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Security Gate:</span>
                <span className="font-mono">99999</span>
              </li>
              <li className="flex justify-between">
                <span>Maintenance:</span>
                <span className="font-mono">99998</span>
              </li>
              <li className="flex justify-between">
                <span>Medical:</span>
                <span className="font-mono">108</span>
              </li>
              <li className="flex justify-between">
                <span>Fire Emergency:</span>
                <span className="font-mono">101</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © {currentYear} Shonar Gaon Bungalow Project. All rights reserved.
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-400" /> for our community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}