import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Crown, 
  Shield,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { committeeMembers } from "@/data/committee";
import { emergencyContacts } from "@/data/emergencyContacts";

export function Contact() {
  return (
    <Section id="contact" className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden pb-8">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl animate-bounce"></div>

      <div className="relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full border border-purple-200 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-6 leading-tight">
            Contact Us
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full mx-auto mb-6"></div>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get in touch with our society committee or reach out for any queries and assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white animate-slide-up">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-500"></div>
              
              <CardHeader className="relative">
                <CardTitle className="text-2xl bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your full name" 
                      className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bungalow" className="text-slate-700 font-medium">Bungalow Number</Label>
                    <Input 
                      id="bungalow" 
                      placeholder="e.g., A-101" 
                      className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 98765 43210" 
                      className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Brief subject of your message" 
                    className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please describe your query or concern in detail..."
                    rows={5}
                    className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <span className="group-hover:scale-105 transition-transform duration-300">Send Message</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Society Committee & Info */}
          <div className="space-y-6">
            {/* Committee Members */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative">
                <CardTitle className="text-xl bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
                  Society Committee
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {committeeMembers.map((member, index) => (
                  <div 
                    key={member.name} 
                    className="group/member relative overflow-hidden p-4 bg-white rounded-lg border border-slate-100 hover:shadow-lg transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Member card background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.bgColor} opacity-0 group-hover/member:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative flex items-start gap-3">
                      <div className={`p-2 bg-gradient-to-br ${member.color} rounded-lg group-hover/member:scale-110 transition-transform duration-300 shadow-md`}>
                        <member.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 group-hover/member:text-slate-900 transition-colors duration-300">
                          {member.name}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3 group-hover/member:text-slate-700 transition-colors duration-300">
                          {member.position}
                        </p>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded group-hover/member:bg-white/80 transition-colors duration-300">
                            <Phone className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-700">{member.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded group-hover/member:bg-white/80 transition-colors duration-300">
                            <Mail className="h-3 w-3 text-slate-500" />
                            <span className="text-slate-700">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${member.color} group-hover/member:w-full transition-all duration-500 ease-out`}></div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative">
                <CardTitle className="text-xl bg-gradient-to-r from-slate-800 to-red-800 bg-clip-text text-transparent">
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div 
                    key={contact.service} 
                    className="group/emergency flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover/emergency:text-slate-900 transition-colors duration-300">
                      {contact.service}
                    </span>
                    <span className={`text-sm font-mono px-3 py-1 bg-gradient-to-r ${contact.color} text-white rounded-full shadow-sm group-hover/emergency:scale-105 transition-transform duration-300`}>
                      {contact.number}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Society Address */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in">
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors duration-300">
                      Society Address
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                      Sonar Gaon Bungalow Project,<br />
                      Sector 12, New Town,<br />
                      Kolkata - 700156,<br />
                      West Bengal, India
                    </p>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 group-hover:w-full transition-all duration-700 ease-out"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(3deg); }
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `
      }} />
    </Section>
  );
}