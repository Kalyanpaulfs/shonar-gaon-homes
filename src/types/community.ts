import { LucideIcon } from "lucide-react";

export type CommitteeMember = {
  name: string;
  position: string;
  icon: LucideIcon;
  contact: string;
  email: string;
  color: string;
  bgColor: string;
};

export type EmergencyContact = {
  service: string;
  number: string;
  color: string;
};