// firebaseServices.ts - Firebase operations only
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  serverTimestamp, 
  query,
  orderBy,
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';

// ============================
// GALLERY IMAGE INTERFACES
// ============================
export interface ImageData {
  id: string;
  title: string;
  url: string;
  category: string;
  date: string;
  publicId: string;
  createdAt?: Date;
}

export interface UpdateFormData {
  title: string;
  category: string;
  date: string;
}

const GALLERY_COLLECTION = 'gallery_images';

// ============================
// GALLERY IMAGE FIRESTORE FUNCTIONS
// ============================

/**
 * Save image metadata to Firestore after Cloudinary upload
 */
export const saveImageToFirestore = async (imageData: {
  title: string;
  url: string;
  category: string;
  date: string;
  publicId: string;
}): Promise<ImageData> => {
  try {
    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      ...imageData,
      createdAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...imageData,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Error saving image metadata to Firestore:', error);
    throw new Error('Failed to save image metadata to database');
  }
};

/**
 * Fetch all gallery images from Firestore
 */
export const fetchGalleryImages = async (): Promise<ImageData[]> => {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    const images: ImageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        title: data.title,
        url: data.url,
        category: data.category,
        date: data.date,
        publicId: data.publicId,
        createdAt: data.createdAt?.toDate(),
      });
    });

    return images;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error('Failed to fetch images from database');
  }
};

/**
 * Fetch gallery images by category
 */
export const fetchGalleryImagesByCategory = async (category: string): Promise<ImageData[]> => {
  try {
    const q = query(
      collection(db, GALLERY_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    const images: ImageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        title: data.title,
        url: data.url,
        category: data.category,
        date: data.date,
        publicId: data.publicId,
        createdAt: data.createdAt?.toDate(),
      });
    });

    return images;
  } catch (error) {
    console.error('Error fetching images by category:', error);
    throw new Error('Failed to fetch images by category');
  }
};

/**
 * Update image metadata in Firestore
 */
export const updateGalleryImage = async (imageId: string, updateData: UpdateFormData): Promise<void> => {
  try {
    const imageRef = doc(db, GALLERY_COLLECTION, imageId);
    
    await updateDoc(imageRef, {
      title: updateData.title,
      category: updateData.category,
      date: updateData.date,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating image:', error);
    throw new Error('Failed to update image metadata');
  }
};

/**
 * Delete image metadata from Firestore
 */
export const deleteImageFromFirestore = async (imageId: string): Promise<string> => {
  try {
    const imageRef = doc(db, GALLERY_COLLECTION, imageId);
    const imageDoc = await getDoc(imageRef);
    
    if (!imageDoc.exists()) {
      throw new Error('Image not found in database');
    }

    const imageData = imageDoc.data();
    const publicId = imageData.publicId;

    // Delete from Firestore
    await deleteDoc(imageRef);
    
    return publicId; // Return publicId for Cloudinary deletion
  } catch (error) {
    console.error('Error deleting image from Firestore:', error);
    throw new Error('Failed to delete image from database');
  }
};

/**
 * Get a single image by ID from Firestore
 */
export const getGalleryImageById = async (imageId: string): Promise<ImageData | null> => {
  try {
    const imageRef = doc(db, GALLERY_COLLECTION, imageId);
    const imageDoc = await getDoc(imageRef);
    
    if (!imageDoc.exists()) {
      return null;
    }

    const data = imageDoc.data();
    return {
      id: imageDoc.id,
      title: data.title,
      url: data.url,
      category: data.category,
      date: data.date,
      publicId: data.publicId,
      createdAt: data.createdAt?.toDate(),
    };
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    throw new Error('Failed to fetch image');
  }
};

/**
 * Search images by title
 */
export const searchGalleryImages = async (searchTerm: string): Promise<ImageData[]> => {
  try {
    // Firestore doesn't support full-text search natively
    const querySnapshot = await getDocs(collection(db, GALLERY_COLLECTION));
    
    const images: ImageData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = data.title?.toLowerCase() || '';
      
      if (title.includes(searchTerm.toLowerCase())) {
        images.push({
          id: doc.id,
          title: data.title,
          url: data.url,
          category: data.category,
          date: data.date,
          publicId: data.publicId,
          createdAt: data.createdAt?.toDate(),
        });
      }
    });

    // Sort by creation date (newest first)
    return images.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } catch (error) {
    console.error('Error searching images:', error);
    throw new Error('Failed to search images');
  }
};

/**
 * Get images count by category
 */
export const getImageCountByCategory = async (): Promise<Record<string, number>> => {
  try {
    const querySnapshot = await getDocs(collection(db, GALLERY_COLLECTION));
    
    const categoryCounts: Record<string, number> = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const category = data.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return categoryCounts;
  } catch (error) {
    console.error('Error getting category counts:', error);
    throw new Error('Failed to get category counts');
  }
};

// ============================
// EVENT FUNCTIONS
// ============================

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

export const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events: any[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
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

export const fetchAnnouncements = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "announcements"));
    const announcements: any[] = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() });
    });
    
    announcements.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
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
// CONTACT FUNCTIONS
// ============================

export const fetchContacts = async () => {
  try {
    const contactsCollection = collection(db, 'contacts');
    const snapshot = await getDocs(contactsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const createContact = async (contactData: any) => {
  try {
    const contactsCollection = collection(db, 'contacts');
    const docRef = await addDoc(contactsCollection, {
      ...contactData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const updateContact = async (contactId: string, contactData: any) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await updateDoc(contactRef, {
      ...contactData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

export const deleteContact = async (contactId: string) => {
  try {
    const contactRef = doc(db, 'contacts', contactId);
    await deleteDoc(contactRef);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};

// ============================
// UTILITY FUNCTIONS
// ============================

export const getEventsByType = async (type: string) => {
  try {
    const events = await fetchEvents();
    return events.filter(event => event.type === type);
  } catch (e) {
    console.error("Error fetching events by type: ", e);
    throw e;
  }
};

export const getAnnouncementsByType = async (type: string) => {
  try {
    const announcements = await fetchAnnouncements();
    return announcements.filter(announcement => announcement.type === type);
  } catch (e) {
    console.error("Error fetching announcements by type: ", e);
    throw e;
  }
};

export const getAnnouncementsByPriority = async (priority: string) => {
  try {
    const announcements = await fetchAnnouncements();
    return announcements.filter(announcement => announcement.priority === priority);
  } catch (e) {
    console.error("Error fetching announcements by priority: ", e);
    throw e;
  }
};

export const getUpcomingEvents = async () => {
  try {
    const events = await fetchEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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