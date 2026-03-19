
import { SearchResult, InstagramProfile } from "../types";

const INSTAGRAM_BASE = 'https://www.instagram.com';

const isLocalDev = (): boolean => {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
};

const toInstagramUrl = (path: string): string => {
  return isLocalDev() ? `/ig-api${path}` : `${INSTAGRAM_BASE}${path}`;
};

const isValidInstaUsername = (str: string): boolean => {
  return /^[a-zA-Z0-9\._]{1,30}$/.test(str);
};

const normalizeQuery = (query: string): string => {
  const cleaned = query.trim();

  if (!cleaned) return '';

  if (cleaned.startsWith('@')) {
    return cleaned.slice(1).trim();
  }

  const instaUrlMatch = cleaned.match(/instagram\.com\/([a-zA-Z0-9\._]+)/i);
  if (instaUrlMatch?.[1]) {
    return instaUrlMatch[1];
  }

  return cleaned;
};

const fetchInstagramJson = async (url: string) => {
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data?.status === 'fail') {
    throw new Error(data?.message || 'Instagram API failed');
  }

  return data;
};

const findUsernameFromSearch = async (query: string): Promise<string | null> => {
  const searchUrl = toInstagramUrl(`/web/search/topsearch/?query=${encodeURIComponent(query)}`);
  const data = await fetchInstagramJson(searchUrl);
  const users = data?.users || [];

  if (!Array.isArray(users) || users.length === 0) {
    return null;
  }

  const normalized = query.toLowerCase();
  const exact = users.find((item: any) => {
    const user = item?.user;
    const username = String(user?.username || '').toLowerCase();
    const fullName = String(user?.full_name || '').toLowerCase();
    return username === normalized || fullName === normalized;
  });

  return exact?.user?.username || users[0]?.user?.username || null;
};

const getProfileByUsername = async (username: string): Promise<InstagramProfile> => {
  const profileUrl = toInstagramUrl(`/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);
  const data = await fetchInstagramJson(profileUrl);
  const user = data?.data?.user;

  if (!user) {
    throw new Error('User not found');
  }

  return {
    name: user.full_name || user.username,
    bio: user.biography || 'Instagram profile found.',
    url: `https://www.instagram.com/${user.username}/`,
    username: user.username,
    profilePic: user.profile_pic_url_hd || user.profile_pic_url,
    followers: user.edge_followed_by?.count,
    following: user.edge_follow?.count,
    posts: user.edge_owner_to_timeline_media?.count,
    isPrivate: user.is_private,
  };
};

export const performInstaSearch = async (query: string): Promise<SearchResult> => {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    throw new Error('Please enter a valid Instagram username.');
  }

  try {
    let usernameToLookup = normalizedQuery;

    if (!isValidInstaUsername(usernameToLookup)) {
      const discovered = await findUsernameFromSearch(normalizedQuery);
      if (!discovered) {
        throw new Error('User not found');
      }
      usernameToLookup = discovered;
    }

    const profile = await getProfileByUsername(usernameToLookup);

    return {
      text: 'Live profile data fetched from Instagram.',
      profiles: [profile],
    };
  } catch (error: any) {
    console.error('Instagram search failed:', error);

    const status = String(error?.message || '').toLowerCase();
    if (status.includes('not found') || status.includes('404')) {
      throw new Error('User not found on Instagram.');
    }

    throw new Error('Live Instagram data could not be fetched right now. Try again.');
  }
};
