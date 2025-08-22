"use client";

import React, { useEffect, useState } from "react";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Sparkles,
  X,
  Phone,
  Mail,
  Crown,
  User,
  Shield,
  Briefcase,
  Store
} from "lucide-react";
import { fetchContacts } from "@/data/firebaseServices";
import { VendorsAndServices } from "./VendorsAndServices";
import { SocietyCommitteeAndEmergency } from "./SocietyCommitteeAndEmergency";
import AOS from "aos";
import "aos/dist/aos.css";

type CommitteeItem = {
  name: string;
  position: string;
  icon: any;
  contact: string;
  email: string;
  color: string;
  bgColor: string;
  description?: string;
  image?: string;
  id?: string;
};

type EmergencyItem = {
  service: string;
  number: string;
  color: string;
  description?: string;
  image?: string;
  id?: string;
};

type FlatContact = {
  id?: string;
  type: "committee" | "emergency" | "Services" | "vendor" | string;
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
  description?: string;
  image?: string;
  categories?: string[];
  serviceType?: string;
};

export function Contact() {
  const [committeeFromDb, setCommitteeFromDb] = useState<CommitteeItem[]>([]);
  const [emergencyFromDb, setEmergencyFromDb] = useState<EmergencyItem[]>([]);
  const [servicesFromDb, setServicesFromDb] = useState<FlatContact[]>([]);
  const [vendorsFromDb, setVendorsFromDb] = useState<FlatContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FlatContact | null>(null);

  const roleIcon = (position?: string) => {
    const p = (position || "").toLowerCase();
    if (p.includes("president") || p.includes("chair")) return Crown;
    if (p.includes("security") || p.includes("treasurer")) return Shield;
    return User;
  };

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out-quad",
      disable: "mobile"
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingContacts(true);
        const all = (await fetchContacts()) as FlatContact[];

        const committee = (all || []).filter((c) => c?.type === "committee");
        const emergency = (all || []).filter((c) => c?.type === "emergency");
        const services = (all || []).filter((c) => c?.type === "Services");
        const vendors = (all || []).filter((c) => c?.type === "vendor");

        const mappedCommittee: CommitteeItem[] = committee.map((c) => ({
          id: c.id || c.name || "",
          name: c.name || "—",
          position: c.position || "—",
          icon: roleIcon(c.position),
          contact: c.phone || "—",
          email: c.email || "—",
          color: "from-teal-700 to-teal-900",
          bgColor: "from-gray-100 to-gray-200",
          description: c.description || "",
          image: c.image || ""
        }));

        const mappedEmergency: EmergencyItem[] = emergency.map((e) => ({
          id: e.id || e.name || e.position || "",
          service: e.name || e.position || "Emergency",
          number: e.phone || "—",
          color: "from-red-800 to-red-900",
          description: e.description || "",
          image: e.image || ""
        }));

        const mappedServices: FlatContact[] = services.map((s) => ({
          ...s,
          type: "Services",
          name: s.name || "—",
          position: s.position || "—",
          phone: s.phone || "—",
          email: s.email || "—",
          description: s.description || "",
          image: s.image || ""
        }));

        const mappedVendors: FlatContact[] = vendors.map((v) => ({
          ...v,
          type: "vendor",
          name: v.name || "—",
          position: v.position || "Service Provider",
          phone: v.phone || "—",
          email: v.email || "—",
          description: v.description || "",
          image: v.image || ""
        }));

        setCommitteeFromDb(mappedCommittee);
        setEmergencyFromDb(mappedEmergency);
        setServicesFromDb(mappedServices);
        setVendorsFromDb(mappedVendors);
      } catch (e) {
        console.error("Failed to load contacts for Contact page:", e);
      } finally {
        setLoadingContacts(false);
      }
    })();
  }, []);

  const openDetail = (item: FlatContact) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const Avatar = ({ name, image, gradient }: { name?: string; image?: string; gradient: string }) => {
    const initials =
      (name || "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "SG";

    return image ? (
      <img
        src={image}
        alt={name || "avatar"}
        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-gray-300 shadow"
      />
    ) : (
      <div
        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-xs font-semibold ring-2 ring-gray-300 shadow`}
      >
        {initials}
      </div>
    );
  };

  const InfoPill = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-gray-200 border border-gray-300 text-xs text-gray-700">
      <Icon className="h-3.5 w-3.5 text-gray-500" />
      <span className="truncate">{text}</span>
    </div>
  );

  const getModalIcon = (type: string, position?: string) => {
    if (type === "vendor") return <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />;
    if (type === "Services") return <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />;
    if (type === "committee") {
      const IconComponent = roleIcon(position);
      return <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-700" />;
    }
    return <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-800" />;
  };

  return (
    <Section id="contact" className="relative bg-gray-50 py-8 sm:py-12 overflow-hidden scrollbar-hide">
      <div className="absolute -top-8 -left-8 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-br from-teal-100/10 to-emerald-100/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-tr from-violet-100/10 to-violet-200/10 rounded-full blur-2xl animate-float"></div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-down" data-aos-disable="mobile">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 rounded-full border border-gray-300 mb-4">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span className="text-sm font-semibold text-gray-700">Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-teal-800 mb-4 tracking-tight">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find committee members, emergency contacts, services, and vendors that serve our society.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" data-aos="fade-right" data-aos-disable="mobile">
            <Card className="group relative overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200">
              <CardHeader className="relative">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                  </div>
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                    <Input id="name" placeholder="Your full name" className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bungalow" className="text-gray-700 font-medium">Bungalow Number</Label>
                    <Input id="bungalow" placeholder="e.g., A-101" className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 font-medium">Subject</Label>
                  <Input id="subject" placeholder="Brief subject of your message" className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                  <Textarea id="message" placeholder="Please describe your query or concern in detail..." rows={5} className="border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 transition-all duration-300" />
                </div>
                <Button className="w-full bg-gradient-to-r from-teal-700 to-teal-900 hover:from-teal-800 hover:to-teal-950 text-white shadow-md hover:shadow-lg transition-all duration-300 group">
                  <span className="group-hover:scale-105 transition-transform duration-300">Send Message</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div data-aos="fade-left" data-aos-disable="mobile">
            <SocietyCommitteeAndEmergency
              committeeFromDb={committeeFromDb}
              emergencyFromDb={emergencyFromDb}
              loadingContacts={loadingContacts}
              onOpenDetail={openDetail}
            />
          </div>
        </div>

        <div className="mt-8 sm:mt-10" data-aos="fade-up" data-aos-disable="mobile">
          <VendorsAndServices
            servicesFromDb={servicesFromDb}
            vendorsFromDb={vendorsFromDb}
            loadingContacts={loadingContacts}
          />
        </div>

        {detailOpen && detailItem && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" data-aos="fade-in" data-aos-disable="mobile">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-lg overflow-hidden border border-gray-300">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-300">
                <div className="flex items-center gap-2">
                  {getModalIcon(detailItem.type, detailItem.position)}
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {detailItem.name}
                  </h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setDetailOpen(false)}>
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    name={detailItem.name}
                    image={detailItem.image}
                    gradient={
                      detailItem.type === "vendor" ? "from-blue-600 to-indigo-700" :
                      detailItem.type === "Services" ? "from-purple-600 to-indigo-700" :
                      detailItem.type === "committee" ? "from-teal-700 to-teal-900" :
                      "from-red-800 to-red-900"
                    }
                  />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700">{detailItem.position}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {detailItem.phone ? <InfoPill icon={Phone} text={detailItem.phone} /> : null}
                      {detailItem.email ? <InfoPill icon={Mail} text={detailItem.email} /> : null}
                    </div>
                  </div>
                </div>
                {detailItem.description ? (
                  <p className="text-xs sm:text-sm text-gray-600">{detailItem.description}</p>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 italic">No additional description.</p>
                )}
              </div>
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-300 bg-gray-100 flex justify-end">
                <Button onClick={() => setDetailOpen(false)} className="h-7 sm:h-8 px-3 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700">Close</Button>
              </div>
            </div>
          </div>
        )}

        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slide-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
            .animate-fade-in { animation: fade-in 0.6s ease-out; }
            .animate-slide-up { animation: slide-up 0.5s ease-out; }
            .animate-float { animation: float 6s ease-in-out infinite; }
          `,
          }}
        />
      </div>
    </Section>
  );
}