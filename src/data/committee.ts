import { CommitteeMember } from "@/types/community";
import { Crown, User, Shield } from "lucide-react";

export const committeeMembers: CommitteeMember[] = [
  {
    name: "Rajesh Kumar",
    position: "President",
    icon: Crown,
    contact: "+91 98765 43210",
    email: "president@Sonargaon.com",
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50 to-orange-50"
  },
  {
    name: "Priya Sharma",
    position: "Secretary",
    icon: User,
    contact: "+91 98765 43211",
    email: "secretary@Sonargaon.com",
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50"
  },
  {
    name: "Amit Gupta",
    position: "Treasurer",
    icon: Shield,
    contact: "+91 98765 43212",
    email: "treasurer@Sonargaon.com",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50"
  }
];