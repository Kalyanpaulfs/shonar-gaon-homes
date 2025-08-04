import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Home, TreePine, Users } from "lucide-react";

export function About() {
  return (
    <Section id="about" className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-300/30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-300/40 rounded-full blur-xl animate-float"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Content */}
        <div className="animate-slide-up space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full border border-amber-200">
              <Home className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Premium Community Living</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
              About Our Society
            </h2>
            
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              Sonar Gaon Bungalow Project is a vibrant residential community featuring 
              beautiful bungalows, lush green spaces, and a close-knit neighborhood spirit. 
              Our community is thoughtfully designed to provide residents with a harmonious 
              blend of modern amenities and natural beauty.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Nestled in a serene environment, we offer a peaceful retreat from the hustle 
              and bustle of city life while maintaining connectivity to essential services 
              and urban conveniences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">150+</div>
                  <div className="text-sm font-medium text-slate-600">Beautiful Bungalows</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 border-0 shadow-lg">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">25</div>
                  <div className="text-sm font-medium text-slate-600">Acres of Greenery</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-amber-50 border-0 shadow-lg sm:col-span-2">
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">500+</div>
                  <div className="text-sm font-medium text-slate-600">Happy Families</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Map Section */}
        <div className="animate-fade-in space-y-6">
          <Card className="group shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 border-0 overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-700">Live Location</span>
                  </div>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10352.38894679404!2d88.20978373257131!3d22.405782608781863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02633c16f90e63%3A0x1ef3e9e541dc5f0f!2sSonargaon%20Bungalow%20Project!5e0!3m2!1sen!2sin!4v1754338702906!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sonar Gaon Location"
                  className="group-hover:scale-105 transition-transform duration-500"
                ></iframe>
              </div>
            </CardContent>
          </Card>
          
          {/* <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center gap-3 mb-4"> */}
              {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div> */}
              {/* <div>
                <h3 className="font-semibold text-slate-800">Prime Location Benefits</h3>
                <p className="text-sm text-slate-600">Strategic positioning for modern living</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Easy highway access</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Near shopping centers</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Quality schools nearby</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Medical facilities</span>
              </div> */}
            </div>
          </div>
        {/* </div>
      </div> */}

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slide-up {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out;
          }
          
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `
      }} />
    </Section>
  );
}