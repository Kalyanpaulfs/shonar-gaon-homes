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
  MessageSquare
} from "lucide-react";

const committeeMembers = [
  {
    name: "Rajesh Kumar",
    position: "President",
    icon: Crown,
    contact: "+91 98765 43210",
    email: "president@shonargaon.com"
  },
  {
    name: "Priya Sharma",
    position: "Secretary",
    icon: User,
    contact: "+91 98765 43211",
    email: "secretary@shonargaon.com"
  },
  {
    name: "Amit Gupta",
    position: "Treasurer",
    icon: Shield,
    contact: "+91 98765 43212",
    email: "treasurer@shonargaon.com"
  }
];

const emergencyContacts = [
  { service: "Security Gate", number: "+91 98765 99999" },
  { service: "Maintenance", number: "+91 98765 99998" },
  { service: "Medical Emergency", number: "108" },
  { service: "Fire Emergency", number: "101" }
];

export function Contact() {
  return (
    <Section id="contact" className="bg-accent-beige">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Contact Us
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get in touch with our society committee or reach out for any queries and assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-elegant animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bungalow">Bungalow Number</Label>
                  <Input id="bungalow" placeholder="e.g., A-101" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief subject of your message" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your query or concern in detail..."
                  rows={5}
                />
              </div>

              <Button className="w-full bg-primary hover:bg-primary-deep text-primary-foreground">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Society Committee & Info */}
        <div className="space-y-6">
          {/* Committee Members */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Society Committee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {committeeMembers.map((member, index) => (
                <div 
                  key={member.name} 
                  className="p-4 bg-accent-cream rounded-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <member.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-primary">{member.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{member.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div 
                  key={contact.service} 
                  className="flex justify-between items-center p-3 bg-accent-cream rounded-lg animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm font-medium">{contact.service}</span>
                  <span className="text-sm text-primary font-mono">{contact.number}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Society Address */}
          <Card className="shadow-card animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-2">Society Address</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Shonar Gaon Bungalow Project,<br />
                    Sector 12, New Town,<br />
                    Kolkata - 700156,<br />
                    West Bengal, India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}