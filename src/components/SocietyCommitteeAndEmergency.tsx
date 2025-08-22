"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Mail,
  Crown,
  User,
  Shield,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

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

type SocietyCommitteeAndEmergencyProps = {
  committeeFromDb: CommitteeItem[];
  emergencyFromDb: EmergencyItem[];
  loadingContacts: boolean;
  onOpenDetail: (item: FlatContact) => void;
};

export function SocietyCommitteeAndEmergency({ 
  committeeFromDb, 
  emergencyFromDb, 
  loadingContacts,
  onOpenDetail
}: SocietyCommitteeAndEmergencyProps) {
  const COMMITTEE_PER_PAGE = 3;
  const EMERGENCY_PER_PAGE = 3;
  const [committeeSearch, setCommitteeSearch] = useState("");
  const [committeePage, setCommitteePage] = useState(0);
  const [emergencySearch, setEmergencySearch] = useState("");
  const [emergencyPage, setEmergencyPage] = useState(0);

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

  const filteredSortedCommittee = useMemo(() => {
    const q = committeeSearch.trim().toLowerCase();
    return committeeFromDb
      .filter((c) => (c.name || "").toLowerCase().includes(q))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [committeeFromDb, committeeSearch]);

  const committeeTotalPages = Math.max(1, Math.ceil(filteredSortedCommittee.length / COMMITTEE_PER_PAGE));
  const committeeStart = committeePage * COMMITTEE_PER_PAGE;
  const committeeSlice = filteredSortedCommittee.slice(committeeStart, committeeStart + COMMITTEE_PER_PAGE);

  const filteredSortedEmergency = useMemo(() => {
    const q = emergencySearch.trim().toLowerCase();
    return emergencyFromDb
      .filter((e) => (e.service || "").toLowerCase().includes(q))
      .sort((a, b) => (a.service || "").localeCompare(b.service || ""));
  }, [emergencyFromDb, emergencySearch]);

  const emergencyTotalPages = Math.max(1, Math.ceil(filteredSortedEmergency.length / EMERGENCY_PER_PAGE));
  const emergencyStart = emergencyPage * EMERGENCY_PER_PAGE;
  const emergencySlice = filteredSortedEmergency.slice(emergencyStart, emergencyStart + EMERGENCY_PER_PAGE);

  useEffect(() => {
    setCommitteePage(0);
  }, [committeeSearch]);

  useEffect(() => {
    setEmergencyPage(0);
  }, [emergencySearch]);

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

  return (
    <div className="space-y-6 overflow-hidden scrollbar-hide" data-aos="fade-left" data-aos-disable="mobile">
      <Card 
        className="group relative overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200"
        data-aos="zoom-in"
        data-aos-disable="mobile"
      >
        <CardHeader className="relative">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
            Society Committee
          </CardTitle>
          <div className="relative w-full mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              value={committeeSearch}
              onChange={(e) => setCommitteeSearch(e.target.value)}
              placeholder="Search committee by name..."
              className="pl-8 sm:pl-9 border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 text-sm"
            />
            {committeeSearch && (
              <button
                onClick={() => setCommitteeSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {loadingContacts ? (
            <div className="p-3 sm:p-4 text-sm text-gray-600">Loading committee...</div>
          ) : filteredSortedCommittee.length ? (
            <div>
              {committeeSlice.map((member, index) => (
                <div
                  key={member.id ? `${member.id}` : `${member.name}-${index}`}
                  className="group/member relative overflow-hidden p-3 sm:p-4 rounded-lg border border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-md transition-all duration-300"
                  data-aos="zoom-in-up"
                  data-aos-delay={index * 100}
                  data-aos-disable="mobile"
                >
                  <div className="relative flex items-start gap-3 min-w-0">
                    <div className={`p-2 bg-gradient-to-br ${member.color} rounded-lg group-hover/member:scale-110 transition-transform duration-300 shadow-sm`}>
                      <member.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{member.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          {member.position}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{member.position}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <InfoPill icon={Phone} text={member.contact} />
                        <InfoPill icon={Mail} text={member.email} />
                      </div>
                      {member.description ? <p className="text-xs text-gray-600 mt-2 line-clamp-3">{member.description}</p> : null}
                      <div className="mt-3">
                        <Button
                          variant="secondary"
                          className="h-7 sm:h-8 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                          onClick={() => onOpenDetail({
                            id: member.id,
                            type: "committee",
                            name: member.name,
                            position: member.position,
                            phone: member.contact,
                            email: member.email,
                            description: member.description,
                            image: member.image
                          })}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                    <Avatar name={member.name} image={member.image} gradient="from-teal-700 to-teal-900" />
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="h-7 sm:h-9 px-3 sm:px-4 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onClick={() => setCommitteePage((p) => Math.max(0, p - 1))}
                  disabled={committeePage === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <span className="text-xs sm:text-sm text-gray-500 px-2">
                  Page {committeePage + 1} of {committeeTotalPages}
                </span>
                <Button
                  variant="outline"
                  className="h-7 sm:h-9 px-3 sm:px-4 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onClick={() => setCommitteePage((p) => Math.min(committeeTotalPages - 1, p + 1))}
                  disabled={committeePage >= committeeTotalPages - 1}
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 text-sm text-gray-600">No committee members found.</div>
          )}
        </CardContent>
      </Card>

      <Card 
        className="group relative overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-900/10 to-red-900/20"
        data-aos="zoom-in"
        data-aos-disable="mobile"
      >
        <CardHeader className="relative">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">
            Emergency Contacts
          </CardTitle>
          <div className="relative w-full mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              value={emergencySearch}
              onChange={(e) => setEmergencySearch(e.target.value)}
              placeholder="Search emergency contacts by service..."
              className="pl-8 sm:pl-9 border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 text-sm"
            />
            {emergencySearch && (
              <button
                onClick={() => setEmergencySearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative space-y-3">
          {loadingContacts ? (
            <div className="p-3 text-sm text-gray-600">Loading emergency contacts...</div>
          ) : filteredSortedEmergency.length ? (
            <div>
              {emergencySlice.map((contact, index) => (
                <div
                  key={contact.id ? `${contact.id}` : `${contact.service}-${index}`}
                  className="group/emergency flex justify-between items-center p-3 rounded-lg border border-gray-300 bg-gradient-to-br from-red-900/10 to-red-900/20 hover:shadow-md transition-all duration-300"
                  data-aos="fade-right"
                  data-aos-delay={index * 100}
                  data-aos-disable="mobile"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-800" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{contact.service}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm font-mono px-2 sm:px-3 py-1 bg-gradient-to-r ${contact.color} text-white rounded-full shadow-sm`}>
                      {contact.number}
                    </span>
                    <Button
                      variant="secondary"
                      className="h-7 sm:h-8 px-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                      onClick={() => onOpenDetail({
                        id: contact.id,
                        type: "emergency",
                        name: contact.service,
                        position: "Emergency Contact",
                        phone: contact.number,
                        description: contact.description,
                        image: contact.image
                      })}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="h-7 sm:h-9 px-3 sm:px-4 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onClick={() => setEmergencyPage((p) => Math.max(0, p - 1))}
                  disabled={emergencyPage === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <span className="text-xs sm:text-sm text-gray-500 px-2">
                  Page {emergencyPage + 1} of {emergencyTotalPages}
                </span>
                <Button
                  variant="outline"
                  className="h-7 sm:h-9 px-3 sm:px-4 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                  onClick={() => setEmergencyPage((p) => Math.min(emergencyTotalPages - 1, p + 1))}
                  disabled={emergencyPage >= emergencyTotalPages - 1}
                >
                  <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-600">No emergency contacts found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}