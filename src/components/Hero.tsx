import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-community.jpg";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Shonar Gaon Bungalow Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-primary-foreground px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-secondary">Shonar Gaon</span>
            <span className="block text-lg md:text-xl lg:text-2xl font-normal mt-2 opacity-90">
              Bungalow Project
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-serif italic opacity-90">
            "A Community Where Traditions Meet Modern Living"
          </p>
          
          <p className="text-lg md:text-xl mb-12 opacity-80 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of contemporary comfort and timeless values 
            in our beautifully designed residential community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-8 py-4 text-lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Our Community
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-4 text-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <ArrowDown className="h-6 w-6 text-primary-foreground opacity-70" />
      </div>
    </section>
  );
}