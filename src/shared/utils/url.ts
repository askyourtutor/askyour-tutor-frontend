/**
 * Constructs the full URL for an image path from the database
 * Handles both absolute URLs and relative paths
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If already an absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local asset path, return as is
  if (imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // Construct URL from relative path for API-served images
  const apiUrl = import.meta.env.VITE_API_URL as string || '/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  return `${baseUrl}/${imagePath}`;
}

/**
 * Gets the avatar URL or returns a default fallback
 */
export function getAvatarUrl(avatarPath: string | null | undefined, fallback = '/assets/img/course/author.png'): string {
  return getImageUrl(avatarPath) || fallback;
}
