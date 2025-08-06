import type { Event, Announcement } from "./eventTypes";

export const events: Event[] = [
  {
    title: "Annual Cultural Festival",
    date: "December 15, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Main Community Hall",
    type: "Cultural",
    description: "Join us for an evening of music, dance, and cultural performances celebrating our diverse community.",
    status: "upcoming"
  },
  {
    title: "Society Annual Meeting",
    date: "January 10, 2025",
    time: "10:00 AM - 12:00 PM",
    location: "Community Hall A",
    type: "Official",
    description: "Important annual meeting to discuss society matters and future plans.",
    status: "upcoming"
  },
  {
    title: "Children's Sports Day",
    date: "January 25, 2025",
    time: "9:00 AM - 1:00 PM",
    location: "Children's Park & Open Area",
    type: "Sports",
    description: "Fun-filled sports activities for children with prizes and refreshments.",
    status: "upcoming"
  },
  {
    title: "Holi Celebration",
    date: "March 14, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Central Garden Area",
    type: "Festival",
    description: "Celebrate the festival of colors with the entire community.",
    status: "upcoming"
  }
];

export const announcements: Announcement[] = [
  {
    title: "Water Supply Maintenance",
    date: "December 8, 2024",
    type: "maintenance",
    content: "Water supply will be temporarily suspended from 10 AM to 2 PM for maintenance work."
  },
  {
    title: "New Security Guidelines",
    date: "December 5, 2024",
    type: "security",
    content: "Updated visitor policy now requires advance registration. Please inform guests beforehand."
  },
  {
    title: "Garden Beautification Drive",
    date: "December 1, 2024",
    type: "community",
    content: "Join our monthly garden beautification drive this Saturday. Tools and refreshments provided."
  }
];