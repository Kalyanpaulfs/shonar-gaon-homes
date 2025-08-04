import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";

export function About() {
  return (
    <Section id="about" className="bg-accent-beige">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            About Our Society
          </h2>
          <p className="text-lg text-foreground mb-6 leading-relaxed">
            Shonar Gaon Bungalow Project is a vibrant residential community featuring 
            beautiful bungalows, lush green spaces, and a close-knit neighborhood spirit. 
            Our community is thoughtfully designed to provide residents with a harmonious 
            blend of modern amenities and natural beauty.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Nestled in a serene environment, we offer a peaceful retreat from the hustle 
            and bustle of city life while maintaining connectivity to essential services 
            and urban conveniences.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">150+</div>
                <div className="text-sm text-muted-foreground">Beautiful Bungalows</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-muted-foreground">Acres of Greenery</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="animate-fade-in">
          <Card className="shadow-elegant">
            <CardContent className="p-0">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0738542434147!2d88.4393!3d22.6078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM2JzI4LjEiTiA4OMKwMjYnMjEuNSJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shonar Gaon Location"
                ></iframe>
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            📍 Prime location with easy access to main roads and amenities
          </p>
        </div>
      </div>
    </Section>
  );
}