
import { SearchResult, InstagramProfile } from "../types";

export const performInstaSearch = async (query: string): Promise<SearchResult> => {
  try {
    const response = await fetch(`/api/instagram?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      let message = 'Live Instagram data could not be fetched right now. Try again.';
      try {
        const errorJson = await response.json();
        if (errorJson?.error) {
          message = errorJson.error;
        }
      } catch {
        // ignore parse error
      }
      throw new Error(message);
    }

    const data = await response.json();
    const profile: InstagramProfile | undefined = data?.profiles?.[0];

    if (!profile) {
      throw new Error('User not found on Instagram.');
    }

    const withFallbackPic: InstagramProfile = {
      ...profile,
      profilePic: profile.profilePic || `https://unavatar.io/instagram/${encodeURIComponent(profile.username)}`,
    };

    return {
      text: data?.text || 'Live profile data fetched from Instagram.',
      profiles: [withFallbackPic],
    };
  } catch (error: any) {
    console.error('Instagram search failed:', error);
    throw new Error(error?.message || 'Live Instagram data could not be fetched right now. Try again.');
  }
};
