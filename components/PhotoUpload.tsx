import React, { useState, useCallback } from 'react';
import { photoService } from '../services/photoService';
import { Upload, X, Image as ImageIcon, Star, StarOff } from 'lucide-react';
import type { Database } from '../types/database';

type Photo = Database['public']['Tables']['photos']['Row'];
type PhotoCategory = Photo['category'];

interface PhotoUploadProps {
  category: PhotoCategory;
  onPhotoUploaded?: (photo: Photo) => void;
  onPhotoDeleted?: (photoId: string) => void;
  maxFiles?: number;
  accept?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  category,
  onPhotoUploaded,
  onPhotoDeleted,
  maxFiles = 10,
  accept = "image/*"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string>('');

  // Load existing photos for this category
  React.useEffect(() => {
    const loadPhotos = async () => {
      try {
        const existingPhotos = await photoService.getPhotosByCategory(category);
        setPhotos(existingPhotos);
      } catch (err) {
        console.error('Error loading photos:', err);
      }
    };

    loadPhotos();
  }, [category]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check file count limit
    if (photos.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed for this category`);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        return photoService.uploadPhoto(file, category);
      });

      const uploadedPhotos = await Promise.all(uploadPromises);

      // Update local state
      setPhotos(prev => [...prev, ...uploadedPhotos]);

      // Notify parent component
      uploadedPhotos.forEach(photo => {
        onPhotoUploaded?.(photo);
      });

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  }, [category, photos.length, maxFiles, onPhotoUploaded]);

  const handleDeletePhoto = useCallback(async (photoId: string) => {
    try {
      await photoService.deletePhoto(photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      onPhotoDeleted?.(photoId);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete photo');
    }
  }, [onPhotoDeleted]);

  const handleToggleFeatured = useCallback(async (photo: Photo) => {
    try {
      if (photo.is_featured) {
        // Unset featured
        await photoService.updatePhoto(photo.id, { is_featured: false });
        setPhotos(prev => prev.map(p =>
          p.id === photo.id ? { ...p, is_featured: false } : p
        ));
      } else {
        // Set as featured (this will unset others in same category)
        await photoService.setFeaturedPhoto(photo.id, category);
        setPhotos(prev => prev.map(p => ({
          ...p,
          is_featured: p.id === photo.id
        })));
      }
    } catch (err) {
      console.error('Featured toggle error:', err);
      setError('Failed to update featured status');
    }
  }, [category]);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-wedding-gold transition-colors">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={`photo-upload-${category}`}
        />
        <label
          htmlFor={`photo-upload-${category}`}
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className={`w-8 h-8 ${isUploading ? 'text-gray-400' : 'text-wedding-gold'}`} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isUploading ? 'Uploading...' : 'Click to upload photos'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG ({photos.length}/{maxFiles})
            </p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={photo.thumbnail_url || photo.url}
                  alt={photo.alt_text || photo.original_name}
                  className="w-full h-full object-cover"
                />
                {/* Featured Badge */}
                {photo.is_featured && (
                  <div className="absolute top-2 left-2 bg-wedding-gold text-white p-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleFeatured(photo)}
                      className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                      title={photo.is_featured ? 'Remove featured' : 'Set as featured'}
                    >
                      {photo.is_featured ? (
                        <StarOff className="w-4 h-4 text-white" />
                      ) : (
                        <Star className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 bg-red-500 bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                      title="Delete photo"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Photo Info */}
              <div className="mt-2">
                <p className="text-xs text-gray-600 truncate" title={photo.original_name}>
                  {photo.original_name}
                </p>
                {photo.caption && (
                  <p className="text-xs text-gray-500 truncate" title={photo.caption}>
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;