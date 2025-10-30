// Feature flags for optional functionality
// This allows us to disable features that aren't implemented on the backend

interface FeatureFlags {
  savedCourses: boolean;
  notifications: boolean;
  userPreferences: boolean;
  courseReviews: boolean;
  liveSessions: boolean;
}

class FeatureFlagManager {
  private flags: FeatureFlags = {
    savedCourses: false, // Disabled until backend implementation
    notifications: false,
    userPreferences: true,
    courseReviews: true,
    liveSessions: false,
  };

  private detectedFeatures = new Set<string>();

  // Check if a feature is enabled
  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature];
  }

  // Enable a feature (useful when backend confirms it's available)
  enableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = true;
    this.detectedFeatures.add(feature);
  }

  // Disable a feature (useful when backend returns 404)
  disableFeature(feature: keyof FeatureFlags): void {
    this.flags[feature] = false;
  }

  // Auto-detect feature availability by trying the endpoint
  async detectFeature(feature: keyof FeatureFlags, testEndpoint: string): Promise<boolean> {
    if (this.detectedFeatures.has(feature)) {
      return this.flags[feature];
    }

    try {
      const response = await fetch(testEndpoint, { 
        method: 'HEAD', // Just check if endpoint exists
        credentials: 'include'
      });
      
      if (response.status !== 404) {
        this.enableFeature(feature);
        return true;
      } else {
        this.disableFeature(feature);
        return false;
      }
    } catch {
      this.disableFeature(feature);
      return false;
    }
  }

  // Get all feature states
  getAllFlags(): FeatureFlags {
    return { ...this.flags };
  }

  // Reset detection cache (useful for testing)
  resetDetection(): void {
    this.detectedFeatures.clear();
  }
}

export const featureFlags = new FeatureFlagManager();

// Environment-based feature overrides
if (import.meta.env.VITE_ENABLE_ALL_FEATURES === 'true') {
  // Force enable all features (useful for development)
  Object.keys(featureFlags.getAllFlags()).forEach(feature => {
    featureFlags.enableFeature(feature as keyof FeatureFlags);
  });
}

// Export feature detection helper
export const checkFeatureAvailability = async (feature: keyof FeatureFlags, testEndpoint: string) => {
  return await featureFlags.detectFeature(feature, testEndpoint);
};