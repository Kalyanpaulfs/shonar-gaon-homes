"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Mail,
  Store,
  Briefcase,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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

type VendorsAndServicesProps = {
  servicesFromDb: FlatContact[];
  vendorsFromDb: FlatContact[];
  loadingContacts: boolean;
};

export function VendorsAndServices({ 
  servicesFromDb, 
  vendorsFromDb, 
  loadingContacts 
}: VendorsAndServicesProps) {
  const [dirTab, setDirTab] = useState<"Services" | "vendors">("vendors");
  const CARDS_PER_PAGE = 4;
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorPage, setVendorPage] = useState(0);
  const [servicesSearch, setServicesSearch] = useState("");
  const [servicesPage, setServicesPage] = useState(0);

  const filteredSortedVendors = useMemo(() => {
    const q = vendorSearch.trim().toLowerCase();
    return vendorsFromDb
      .filter((v) => (v.name || "").toLowerCase().includes(q))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [vendorsFromDb, vendorSearch]);

  const vendorTotalPages = Math.max(1, Math.ceil(filteredSortedVendors.length / CARDS_PER_PAGE));
  const vendorStart = vendorPage * CARDS_PER_PAGE;
  const vendorSlice = filteredSortedVendors.slice(vendorStart, vendorStart + CARDS_PER_PAGE);

  const filteredSortedServices = useMemo(() => {
    const q = servicesSearch.trim().toLowerCase();
    return servicesFromDb
      .filter((s) => (s.name || "").toLowerCase().includes(q))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [servicesFromDb, servicesSearch]);

  const servicesTotalPages = Math.max(1, Math.ceil(filteredSortedServices.length / CARDS_PER_PAGE));
  const servicesStart = servicesPage * CARDS_PER_PAGE;
  const servicesSlice = filteredSortedServices.slice(servicesStart, servicesStart + CARDS_PER_PAGE);

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
    <div className="space-y-4 overflow-hidden scrollbar-hide">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="inline-flex rounded-lg border border-gray-300 bg-gray-100 p-1 shadow-sm w-full sm:w-auto">
          <button
            onClick={() => setDirTab("vendors")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              dirTab === "vendors" ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="inline-flex items-center gap-2">
              <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Vendors
            </div>
          </button>
          <button
            onClick={() => setDirTab("Services")}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              dirTab === "Services" ? "bg-violet-100 text-violet-800" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <div className="inline-flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Services
            </div>
          </button>
        </div>

        <div className="relative w-full sm:w-80 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          {dirTab === "vendors" ? (
            <div className="relative">
              <Input
                value={vendorSearch}
                onChange={(e) => setVendorSearch(e.target.value)}
                placeholder="Search vendors by name..."
                className="pl-8 sm:pl-9 border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 text-sm"
              />
              {vendorSearch && (
                <button
                  onClick={() => setVendorSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <Input
                value={servicesSearch}
                onChange={(e) => setServicesSearch(e.target.value)}
                placeholder="Search services by name..."
                className="pl-8 sm:pl-9 border-gray-300 focus:border-teal-700 focus:ring-teal-700/20 text-sm"
              />
              {servicesSearch && (
                <button
                  onClick={() => setServicesSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {dirTab === "vendors" && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-3 sm:p-4 md:p-6">
            {loadingContacts ? (
              <div className="p-3 sm:p-4 text-sm text-slate-600">Loading vendors...</div>
            ) : filteredSortedVendors.length === 0 ? (
              <div className="p-3 sm:p-4 text-sm text-slate-600">No vendors found.</div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {vendorSlice.map((item, i) => (
                    <div
                      key={item.id ? `${item.id}` : `${item.name}-${vendorStart + i}`}
                      className="p-3 sm:p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-lg hover:border-blue-200 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar
                          name={item.name}
                          image={item.image}
                          gradient="from-blue-600 to-indigo-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800 truncate text-sm sm:text-base">{item.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              Vendor
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{item.position}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.phone ? <InfoPill icon={Phone} text={item.phone} /> : null}
                            {item.email ? <InfoPill icon={Mail} text={item.email} /> : null}
                          </div>
                          {item.description ? (
                            <p className="text-xs text-slate-600 mt-2 line-clamp-3">{item.description}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="h-7 sm:h-9 px-3 sm:px-4 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    onClick={() => setVendorPage((p) => Math.max(0, p - 1))}
                    disabled={vendorPage === 0}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-slate-500 px-2">
                    Page {vendorPage + 1} of {vendorTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="h-7 sm:h-9 px-3 sm:px-4 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    onClick={() => setVendorPage((p) => Math.min(vendorTotalPages - 1, p + 1))}
                    disabled={vendorPage >= vendorTotalPages - 1}
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {dirTab === "Services" && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-3 sm:p-4 md:p-6">
            {loadingContacts ? (
              <div className="p-3 sm:p-4 text-sm text-slate-600">Loading services...</div>
            ) : filteredSortedServices.length === 0 ? (
              <div className="p-3 sm:p-4 text-sm text-slate-600">No services found.</div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {servicesSlice.map((item, i) => (
                    <div
                      key={item.id ? `${item.id}` : `${item.name}-${servicesStart + i}`}
                      className="p-3 sm:p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50 hover:shadow-lg hover:border-purple-200 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar
                          name={item.name}
                          image={item.image}
                          gradient="from-purple-600 to-indigo-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800 truncate text-sm sm:text-base">{item.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              Service
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{item.position}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.phone ? <InfoPill icon={Phone} text={item.phone} /> : null}
                            {item.email ? <InfoPill icon={Mail} text={item.email} /> : null}
                          </div>
                          {item.description ? (
                            <p className="text-xs text-slate-600 mt-2 line-clamp-3">{item.description}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    className="h-7 sm:h-9 px-3 sm:px-4 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    onClick={() => setServicesPage((p) => Math.max(0, p - 1))}
                    disabled={servicesPage === 0}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="text-xs sm:text-sm text-slate-500 px-2">
                    Page {servicesPage + 1} of {servicesTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="h-7 sm:h-9 px-3 sm:px-4 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    onClick={() => setServicesPage((p) => Math.min(servicesTotalPages - 1, p + 1))}
                    disabled={servicesPage >= servicesTotalPages - 1}
                  >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
