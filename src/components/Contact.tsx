import React, { useEffect, useMemo, useState } from "react";
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
  Crown,
  User,
  Shield,
  MessageSquare,
  Sparkles,
  Briefcase,
  Store,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { fetchContacts } from "@/data/firebaseServices";

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
};

type FlatContact = {
  id?: string;
  type: "committee" | "emergency" | "staff" | "vendor" | string;
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
  description?: string;
  image?: string;
  categories?: string[]; // (unused now, kept for data compat)
  serviceType?: string;  // (unused now, kept for data compat)
};

export function Contact() {
  const [committeeFromDb, setCommitteeFromDb] = useState<CommitteeItem[]>([]);
  const [emergencyFromDb, setEmergencyFromDb] = useState<{ service: string; number: string; color: string; description?: string; image?: string }[]>([]);
  const [staffFromDb, setStaffFromDb] = useState<FlatContact[]>([]);
  const [vendorsFromDb, setVendorsFromDb] = useState<FlatContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);

  // Tabs
  const [dirTab, setDirTab] = useState<"staff" | "vendors">("vendors");

  // Shared cards-per-page
  const CARDS_PER_PAGE = 4;

  // Vendors: search + carousel (4 visible)
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorPage, setVendorPage] = useState(0);

  // Staff: search + carousel (4 visible)
  const [staffSearch, setStaffSearch] = useState("");
  const [staffPage, setStaffPage] = useState(0);

  // Detail modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FlatContact | null>(null);

  // icon helper for committee roles
  const roleIcon = (position?: string) => {
    const p = (position || "").toLowerCase();
    if (p.includes("president") || p.includes("chair")) return Crown;
    if (p.includes("security") || p.includes("treasurer")) return Shield;
    return User;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingContacts(true);
        const all = (await fetchContacts()) as FlatContact[];

        const committee = (all || []).filter((c) => c?.type === "committee");
        const emergency = (all || []).filter((c) => c?.type === "emergency");
        const staff = (all || []).filter((c) => c?.type === "staff");
        const vendors = (all || []).filter((c) => c?.type === "vendor");

        const mappedCommittee: CommitteeItem[] = committee.map((c) => ({
          name: c.name || "—",
          position: c.position || "—",
          icon: roleIcon(c.position),
          contact: c.phone || "—",
          email: c.email || "—",
          color: "from-emerald-500 to-teal-600",
          bgColor: "from-emerald-50 to-teal-50",
          description: c.description || "",
          image: c.image || ""
        }));

        const mappedEmergency = emergency.map((e) => ({
          service: e.name || e.position || "Emergency",
          number: e.phone || "—",
          color: "from-red-400 to-red-500",
          description: e.description || "",
          image: e.image || ""
        }));

        const mappedStaff: FlatContact[] = staff.map((s) => ({
          ...s,
          type: "staff",
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
        setStaffFromDb(mappedStaff);
        setVendorsFromDb(mappedVendors);
      } catch (e) {
        console.error("Failed to load contacts for Contact page:", e);
      } finally {
        setLoadingContacts(false);
      }
    })();
  }, []);

  // ===== Vendors: filter (name only), sort A→Z, paginate 4 =====
  const filteredSortedVendors = useMemo(() => {
    const q = vendorSearch.trim().toLowerCase();
    return vendorsFromDb
      .filter((v) => (v.name || "").toLowerCase().includes(q))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [vendorsFromDb, vendorSearch]);

  const vendorTotalPages = Math.max(1, Math.ceil(filteredSortedVendors.length / CARDS_PER_PAGE));
  const vendorStart = vendorPage * CARDS_PER_PAGE;
  const vendorSlice = filteredSortedVendors.slice(vendorStart, vendorStart + CARDS_PER_PAGE);

  useEffect(() => {
    setVendorPage(0); // reset to first page when searching or switching to Vendors tab
  }, [vendorSearch, dirTab]);

  // ===== Staff: filter (name only), sort A→Z, paginate 4 =====
  const filteredSortedStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    return staffFromDb
      .filter((s) => (s.name || "").toLowerCase().includes(q))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [staffFromDb, staffSearch]);

  const staffTotalPages = Math.max(1, Math.ceil(filteredSortedStaff.length / CARDS_PER_PAGE));
  const staffStart = staffPage * CARDS_PER_PAGE;
  const staffSlice = filteredSortedStaff.slice(staffStart, staffStart + CARDS_PER_PAGE);

  useEffect(() => {
    setStaffPage(0); // reset to first page when searching or switching to Staff tab
  }, [staffSearch, dirTab]);

  // small avatar renderer
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
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow"
      />
    ) : (
      <div
        className={`h-10 w-10 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white shadow`}
      >
        {initials}
      </div>
    );
  };

  const InfoPill = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700">
      <Icon className="h-3.5 w-3.5 text-slate-500" />
      <span className="truncate">{text}</span>
    </div>
  );

  const openDetail = (item: FlatContact) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  return (
    <Section id="contact" className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden pb-8">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-300/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/25 to-rose-300/25 rounded-full blur-xl animate-bounce"></div>

      <div className="relative z-10">
        {/* Header */}
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
            Find committee members, emergency contacts, staff, and vendors that serve our society.
          </p>
        </div>

        {/* Left: Message form | Right: Committee & Emergency */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white animate-slide-up">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                    <Input id="name" placeholder="Your full name" className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bungalow" className="text-slate-700 font-medium">Bungalow Number</Label>
                    <Input id="bungalow" placeholder="e.g., A-101" className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                  <Input id="subject" placeholder="Brief subject of your message" className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-slate-700 font-medium">Message</Label>
                  <Textarea id="message" placeholder="Please describe your query or concern in detail..." rows={5} className="border-slate-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300" />
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <span className="group-hover:scale-105 transition-transform duration-300">Send Message</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Committee & Emergency */}
          <div className="space-y-6">
            {/* Committee */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <CardTitle className="text-xl bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
                  Society Committee
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-4">
                {loadingContacts ? (
                  <div className="p-4 text-sm text-slate-500">Loading committee...</div>
                ) : committeeFromDb.length ? (
                  committeeFromDb.map((member, index) => (
                    <div key={`${member.name}-${index}`} className="group/member relative overflow-hidden p-4 bg-white rounded-lg border border-slate-100 hover:shadow-lg transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.bgColor} opacity-0 group-hover/member:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative flex items-start gap-3">
                        <div className={`p-2 bg-gradient-to-br ${member.color} rounded-lg group-hover/member:scale-110 transition-transform duration-300 shadow-md`}>
                          <member.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{member.name}</h4>
                          <p className="text-sm text-slate-600 mb-3">{member.position}</p>
                          <div className="flex flex-wrap gap-2">
                            <InfoPill icon={Phone} text={member.contact} />
                            <InfoPill icon={Mail} text={member.email} />
                          </div>
                          {member.description ? <p className="text-xs text-slate-500 mt-2">{member.description}</p> : null}
                        </div>
                        <Avatar name={member.name} image={member.image} gradient="from-emerald-500 to-teal-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-500">No committee members yet.</div>
                )}
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative">
                <CardTitle className="text-xl bg-gradient-to-r from-slate-800 to-red-800 bg-clip-text text-transparent">
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {loadingContacts ? (
                  <div className="p-3 text-sm text-slate-500">Loading emergency contacts...</div>
                ) : emergencyFromDb.length ? (
                  emergencyFromDb.map((contact, index) => (
                    <div key={`${contact.service}-${index}`} className="group/emergency flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-slate-700">{contact.service}</span>
                      </div>
                      <span className={`text-sm font-mono px-3 py-1 bg-gradient-to-r ${contact.color} text-white rounded-full shadow-sm`}>
                        {contact.number}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-slate-500">No emergency contacts yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Directory */}
        <div className="mt-10 space-y-4">
          {/* Tabs + Search (separate searches for vendors/staff) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setDirTab("vendors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dirTab === "vendors" ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="inline-flex items-center gap-2">
                  <Store className="h-4 w-4" /> Vendors
                </div>
              </button>
              <button
                onClick={() => setDirTab("staff")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  dirTab === "staff" ? "bg-indigo-100 text-indigo-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Staff
                </div>
              </button>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              {dirTab === "vendors" ? (
                <>
                  <Input
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search vendors by name..."
                    className="pl-9"
                  />
                  {vendorSearch && (
                    <button
                      onClick={() => setVendorSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Input
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder="Search staff by name..."
                    className="pl-9"
                  />
                  {staffSearch && (
                    <button
                      onClick={() => setStaffSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* VENDORS: 4 visible with arrows */}
          {dirTab === "vendors" && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 md:p-6">
                {loadingContacts ? (
                  <div className="p-4 text-sm text-slate-500">Loading vendors...</div>
                ) : filteredSortedVendors.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">No vendors found.</div>
                ) : (
                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {vendorSlice.map((item, i) => (
                        <div
                          key={`${item.name}-${vendorStart + i}`}
                          className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              name={item.name}
                              image={item.image}
                              gradient="from-amber-500 to-orange-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-200">
                                  Vendor
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{item.position}</p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.phone ? <InfoPill icon={Phone} text={item.phone} /> : null}
                                {item.email ? <InfoPill icon={Mail} text={item.email} /> : null}
                              </div>

                              {item.description ? (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-3">{item.description}</p>
                              ) : null}

                              <div className="mt-3">
                                <Button
                                  variant="secondary"
                                  className="h-8 px-3 text-xs"
                                  onClick={() => openDetail(item)}
                                >
                                  View details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => setVendorPage((p) => Math.max(0, p - 1))}
                        disabled={vendorPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-slate-600">
                        Page {vendorPage + 1} of {vendorTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => setVendorPage((p) => Math.min(vendorTotalPages - 1, p + 1))}
                        disabled={vendorPage >= vendorTotalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* STAFF: 4 visible with arrows (same behavior as vendors) */}
          {dirTab === "staff" && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4 md:p-6">
                {loadingContacts ? (
                  <div className="p-4 text-sm text-slate-500">Loading staff...</div>
                ) : filteredSortedStaff.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">No staff found.</div>
                ) : (
                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {staffSlice.map((item, i) => (
                        <div
                          key={`${item.name}-${staffStart + i}`}
                          className="p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              name={item.name}
                              image={item.image}
                              gradient="from-indigo-500 to-purple-600"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-800 border-indigo-200">
                                  Staff
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{item.position}</p>

                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.phone ? <InfoPill icon={Phone} text={item.phone} /> : null}
                                {item.email ? <InfoPill icon={Mail} text={item.email} /> : null}
                              </div>

                              {item.description ? (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-3">{item.description}</p>
                              ) : null}

                              <div className="mt-3">
                                <Button
                                  variant="secondary"
                                  className="h-8 px-3 text-xs"
                                  onClick={() => openDetail(item)}
                                >
                                  View details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => setStaffPage((p) => Math.max(0, p - 1))}
                        disabled={staffPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-slate-600">
                        Page {staffPage + 1} of {staffTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        className="h-9 px-3"
                        onClick={() => setStaffPage((p) => Math.min(staffTotalPages - 1, p + 1))}
                        disabled={staffPage >= staffTotalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {detailOpen && detailItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                {detailItem.type === "vendor" ? <Store className="h-4 w-4 text-amber-600" /> : <Briefcase className="h-4 w-4 text-indigo-600" />}
                <h3 className="font-semibold text-slate-800">
                  {detailItem.name}
                </h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setDetailOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar
                  name={detailItem.name}
                  image={detailItem.image}
                  gradient={detailItem.type === "vendor" ? "from-amber-500 to-orange-600" : "from-indigo-500 to-purple-600"}
                />
                <div>
                  <p className="text-sm text-slate-700">{detailItem.position}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detailItem.phone ? <InfoPill icon={Phone} text={detailItem.phone} /> : null}
                    {detailItem.email ? <InfoPill icon={Mail} text={detailItem.email} /> : null}
                  </div>
                </div>
              </div>

              {detailItem.description ? (
                <p className="text-sm text-slate-600">{detailItem.description}</p>
              ) : (
                <p className="text-sm text-slate-400 italic">No additional description.</p>
              )}
            </div>

            <div className="px-5 py-4 border-t bg-slate-50 flex justify-end">
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
          .animate-fade-in { animation: fade-in 0.8s ease-out; }
          .animate-slide-up { animation: slide-up 0.6s ease-out; }
          .animate-float { animation: float 6s ease-in-out infinite; }
        `,
        }}
      />
    </Section>
  );
}
