import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

// ============================
// EVENT FUNCTIONS
// ============================

// Create a new event in Firestore
export const createEvent = async (eventData: { 
  title: string; 
  description: string; 
  date: string; 
  time: string; 
  location: string; 
  type: string 
}) => {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log("Event created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding event: ", e);
    throw e;
  }
};

// Update an existing event
export const updateEvent = async (eventId: string, updatedData: { 
  title?: string; 
  description?: string; 
  date?: string; 
  time?: string; 
  location?: string; 
  type?: string 
}) => {
  const eventRef = doc(db, "events", eventId);
  try {
    await updateDoc(eventRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    console.log("Event updated successfully.");
  } catch (e) {
    console.error("Error updating event: ", e);
    throw e;
  }
};

// Delete an event from Firestore
export const deleteEvent = async (eventId: string) => {
  const eventRef = doc(db, "events", eventId);
  try {
    await deleteDoc(eventRef);
    console.log("Event deleted successfully.");
  } catch (e) {
    console.error("Error deleting event: ", e);
    throw e;
  }
};

// Fetch all events from Firestore
export const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events: any[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort events by date (newest first)
    events.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });
    
    return events;
  } catch (e) {
    console.error("Error fetching events: ", e);
    throw e;
  }
};

// ============================
// ANNOUNCEMENT FUNCTIONS
// ============================

// Create a new announcement in Firestore
export const createAnnouncement = async (announcementData: { 
  title: string; 
  content: string; 
  date: string; 
  type: string; 
  priority: string 
}) => {
  try {
    const docRef = await addDoc(collection(db, "announcements"), {
      ...announcementData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log("Announcement created with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding announcement: ", e);
    throw e;
  }
};

// Update an existing announcement
export const updateAnnouncement = async (announcementId: string, updatedData: { 
  title?: string; 
  content?: string; 
  date?: string; 
  type?: string; 
  priority?: string 
}) => {
  const announcementRef = doc(db, "announcements", announcementId);
  try {
    await updateDoc(announcementRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    });
    console.log("Announcement updated successfully.");
  } catch (e) {
    console.error("Error updating announcement: ", e);
    throw e;
  }
};

// Delete an announcement from Firestore
export const deleteAnnouncement = async (announcementId: string) => {
  const announcementRef = doc(db, "announcements", announcementId);
  try {
    await deleteDoc(announcementRef);
    console.log("Announcement deleted successfully.");
  } catch (e) {
    console.error("Error deleting announcement: ", e);
    throw e;
  }
};

// Fetch all announcements from Firestore
export const fetchAnnouncements = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "announcements"));
    const announcements: any[] = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort announcements by priority (high -> medium -> low) and then by date (newest first)
    announcements.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // High priority first
      }
      
      // If same priority, sort by date (newest first)
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      return 0;
    });
    
    return announcements;
  } catch (e) {
    console.error("Error fetching announcements: ", e);
    throw e;
  }
};

// ============================
// UTILITY FUNCTIONS
// ============================

// Get events by type
export const getEventsByType = async (type: string) => {
  try {
    const events = await fetchEvents();
    return events.filter(event => event.type === type);
  } catch (e) {
    console.error("Error fetching events by type: ", e);
    throw e;
  }
};

// Get announcements by type
export const getAnnouncementsByType = async (type: string) => {
  try {
    const announcements = await fetchAnnouncements();
    return announcements.filter(announcement => announcement.type === type);
  } catch (e) {
    console.error("Error fetching announcements by type: ", e);
    throw e;
  }
};

// Get announcements by priority
export const getAnnouncementsByPriority = async (priority: string) => {
  try {
    const announcements = await fetchAnnouncements();
    return announcements.filter(announcement => announcement.priority === priority);
  } catch (e) {
    console.error("Error fetching announcements by priority: ", e);
    throw e;
  }
};

// Get upcoming events (events with dates >= today)
export const getUpcomingEvents = async () => {
  try {
    const events = await fetchEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
  } catch (e) {
    console.error("Error fetching upcoming events: ", e);
    throw e;
  }
};

// Get recent announcements (last 30 days)
export const getRecentAnnouncements = async (days: number = 30) => {
  try {
    const announcements = await fetchAnnouncements();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return announcements.filter(announcement => {
      if (!announcement.createdAt) return false;
      const createdDate = new Date(announcement.createdAt);
      return createdDate >= cutoffDate;
    });
  } catch (e) {
    console.error("Error fetching recent announcements: ", e);
    throw e;
  }
};

// Search events and announcements
export const searchContent = async (searchTerm: string) => {
  try {
    const [events, announcements] = await Promise.all([
      fetchEvents(),
      fetchAnnouncements()
    ]);
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filteredEvents = events.filter(event => 
      event.title?.toLowerCase().includes(searchTermLower) ||
      event.description?.toLowerCase().includes(searchTermLower) ||
      event.location?.toLowerCase().includes(searchTermLower) ||
      event.type?.toLowerCase().includes(searchTermLower)
    );
    
    const filteredAnnouncements = announcements.filter(announcement =>
      announcement.title?.toLowerCase().includes(searchTermLower) ||
      announcement.content?.toLowerCase().includes(searchTermLower) ||
      announcement.type?.toLowerCase().includes(searchTermLower)
    );
    
    return {
      events: filteredEvents,
      announcements: filteredAnnouncements
    };
  } catch (e) {
    console.error("Error searching content: ", e);
    throw e;
  }
};