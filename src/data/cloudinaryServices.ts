// cloudinaryServices.ts - Cloudinary operations only
import { 
  saveImageToFirestore, 
  deleteImageFromFirestore, 
  updateGalleryImage as updateFirebaseImage,
  fetchGalleryImages as fetchFromFirestore, 
  ImageData,
  UpdateFormData
} from './firebaseServices';

// ============================
// INTERFACES
// ============================
export interface UploadFormData {
  title: string;
  file: File;
  category: string;
  date: string;
}

// Use the same interface as Firebase services
export interface UpdateImageData {
  title: string;
  category: string;
  date: string;
}

// ============================
// CLOUDINARY CONFIGURATION
// ============================
const CLOUDINARY_CLOUD_NAME = 'djvyx2kt5';
const CLOUDINARY_UPLOAD_PRESET = 'sonar_gallery';
const GALLERY_FOLDER = 'Sonar_Gaon';

// ============================
// CLOUDINARY FUNCTIONS
// ============================

/**
 * Upload image to Cloudinary only
 */
export const uploadToCloudinary = async (file: File, publicId?: string): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  try {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    uploadData.append('folder', GALLERY_FOLDER);
    
    if (publicId) {
      uploadData.append('public_id', publicId);
    }
    
    // Add tags for better organization
    uploadData.append('tags', 'gallery,sonar-gaon');

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error(`Cloudinary upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    const result = await uploadResponse.json();
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete image from Cloudinary only
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const deleteResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: CLOUDINARY_UPLOAD_PRESET,
        }),
      }
    );

    if (!deleteResponse.ok) {
      console.warn(`Failed to delete from Cloudinary: ${deleteResponse.status}`);
      return false;
    }

    const result = await deleteResponse.json();
    return result.result === 'ok';
  } catch (error) {
    console.warn('Cloudinary deletion failed:', error);
    return false;
  }
};

// ============================
// COMBINED OPERATIONS (Cloudinary + Firebase)
// ============================

/**
 * Fetch gallery images from Firebase
 */
export const fetchGalleryImages = async (): Promise<ImageData[]> => {
  try {
    return await fetchFromFirestore();
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw new Error(`Failed to fetch images: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Upload image to Cloudinary and save metadata to Firebase
 */
export const uploadGalleryImage = async (formData: UploadFormData): Promise<ImageData> => {
  try {
    // Step 1: Upload to Cloudinary
    const timestamp = Date.now();
    const publicId = `${GALLERY_FOLDER}/${formData.category.toLowerCase()}_${timestamp}`;
    
    const cloudinaryResult = await uploadToCloudinary(formData.file, publicId);

    // Step 2: Save metadata to Firebase
    const imageData = await saveImageToFirestore({
      title: formData.title,
      url: cloudinaryResult.secure_url,
      category: formData.category,
      date: formData.date,
      publicId: cloudinaryResult.public_id,
    });

    return imageData;
  } catch (error) {
    console.error('Error in uploadGalleryImage:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update image metadata in Firebase (Cloudinary image stays the same)
 */
export const updateGalleryImage = async (imageId: string, updateData: UpdateImageData): Promise<void> => {
  try {
    // Use the Firebase update function which matches UpdateFormData interface
    const updateFormData: UpdateFormData = {
      title: updateData.title,
      category: updateData.category,
      date: updateData.date,
    };

    await updateFirebaseImage(imageId, updateFormData);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw new Error(`Failed to update image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete image from both Cloudinary and Firebase
 */
export const deleteGalleryImage = async (imageId: string): Promise<void> => {
  try {
    // Step 1: Get publicId and delete from Firebase
    const publicId = await deleteImageFromFirestore(imageId);

    // Step 2: Try to delete from Cloudinary (non-blocking)
    const cloudinaryDeleted = await deleteFromCloudinary(publicId);
    
    if (!cloudinaryDeleted) {
      console.warn(`Image deleted from database but may still exist in Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Generate Cloudinary transformation URL
 */
export const getTransformedImageUrl = (publicId: string, transformations: string): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

/**
 * Get optimized image URL with automatic format and quality
 */
export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number): string => {
  let transformations = 'f_auto,q_auto';
  
  if (width && height) {
    transformations += `,w_${width},h_${height},c_fill`;
  } else if (width) {
    transformations += `,w_${width}`;
  } else if (height) {
    transformations += `,h_${height}`;
  }
  
  return getTransformedImageUrl(publicId, transformations);
};

/**
 * Get thumbnail URL
 */
export const getThumbnailUrl = (publicId: string, size: number = 300): string => {
  return getTransformedImageUrl(publicId, `w_${size},h_${size},c_fill,f_auto,q_auto`);
};

// ============================
// UTILITY FUNCTIONS
// ============================

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }

  return { valid: true };
};

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicIdFromUrl = (url: string): string => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return '';
    
    // Get everything after 'upload/' and before file extension
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
    const publicIdWithExtension = pathAfterUpload.split('/').slice(1).join('/'); // Remove version if exists
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return '';
  }
};

// ============================
// CONFIGURATION HELPER
// ============================

/**
 * Test Cloudinary configuration
 */
export const testCloudinaryConfig = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create a small test canvas image
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 10, 10);
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, 'image/png');
    });

    const testFile = new File([blob], 'test.png', { type: 'image/png' });
    
    // Try to upload
    await uploadToCloudinary(testFile, `test_${Date.now()}`);
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Configuration test failed'
    };
  }
};