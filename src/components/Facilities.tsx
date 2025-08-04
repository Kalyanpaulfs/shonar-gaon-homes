import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card";
import { 
  TreePine, 
  Building2, 
  Shield, 
  Flower2, 
  Route, 
  Car,
  Users,
  Baby,
  Sparkles
} from "lucide-react";

const facilities = [
  {
    icon: Baby,
    title: "Children's Park",
    description: "Safe and fun play area with modern equipment for kids of all ages",
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-50",
    hoverColor: "group-hover:from-pink-500 group-hover:to-rose-600"
  },
  {
    icon: Building2,
    title: "Community Halls",
    description: "Spacious halls for events, celebrations, and community gatherings",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50",
    hoverColor: "group-hover:from-blue-500 group-hover:to-indigo-600"
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security with trained personnel and CCTV monitoring",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50",
    hoverColor: "group-hover:from-emerald-500 group-hover:to-teal-600"
  },
  {
    icon: Flower2,
    title: "Landscaped Gardens",
    description: "Beautiful gardens with seasonal flowers and well-maintained green spaces",
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50",
    hoverColor: "group-hover:from-purple-500 group-hover:to-violet-600"
  },
  {
    icon: Route,
    title: "Walking Tracks",
    description: "Dedicated jogging and walking paths for health and fitness enthusiasts",
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-50 to-amber-50",
    hoverColor: "group-hover:from-orange-500 group-hover:to-amber-600"
  },
  {
    icon: Car,
    title: "Parking Spaces",
    description: "Ample parking facilities for residents and guests with proper allocation",
    color: "from-cyan-500 to-blue-600",
    bgColor: "from-cyan-50 to-blue-50",
    hoverColor: "group-hover:from-cyan-500 group-hover:to-blue-600"
  }
];

export function Facilities() {
  return (
    <Section id="facilities" className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl animate-bounce"></div>

      <div className="relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full border border-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">Premium Amenities</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            Facilities & Amenities
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience modern living with carefully curated amenities designed to enhance 
            your lifestyle and bring the community together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((facility, index) => (
            <Card 
              key={facility.title} 
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${facility.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${facility.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500`}></div>
              
              <CardContent className="relative p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className={`relative p-4 bg-gradient-to-br ${facility.color} rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    {/* Icon glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${facility.color} opacity-20 group-hover:opacity-40 blur-lg rounded-2xl transition-opacity duration-500`}></div>
                    <facility.icon className="relative h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-4 text-slate-800 group-hover:text-slate-900 transition-colors duration-500`}>
                  {facility.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-500">
                  {facility.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${facility.color} group-hover:w-full transition-all duration-700 ease-out`}></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Community Section */}
        <div className="text-center animate-fade-in">
          <Card className="relative overflow-hidden border-0 shadow-2xl max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
            
          </Card>
        </div>
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `
      }} />
    </Section>
  );
}