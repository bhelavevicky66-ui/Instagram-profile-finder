const INSTAGRAM_APP_ID = '936619743392459';

const isValidInstaUsername = (str: string): boolean => {
  return /^[a-zA-Z0-9._]{1,30}$/.test(str);
};

const normalizeQuery = (query: string): string => {
  const cleaned = String(query || '').trim();

  if (!cleaned) return '';

  if (cleaned.startsWith('@')) {
    return cleaned.slice(1).trim();
  }

  const instaUrlMatch = cleaned.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
  if (instaUrlMatch?.[1]) {
    return instaUrlMatch[1];
  }

  return cleaned;
};

const fetchInstagramJson = async (path: string) => {
  const response = await fetch(`https://www.instagram.com${path}`, {
    method: 'GET',
    headers: {
      'x-ig-app-id': INSTAGRAM_APP_ID,
      'x-requested-with': 'XMLHttpRequest',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
    },
  });

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
  const data = await fetchInstagramJson(`/web/search/topsearch/?query=${encodeURIComponent(query)}`);
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

const getProfileByUsername = async (username: string) => {
  const data = await fetchInstagramJson(`/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);
  const user = data?.data?.user;

  if (!user) {
    throw new Error('User not found');
  }

  const profilePic =
    user.profile_pic_url_hd ||
    user.profile_pic_url ||
    user.hd_profile_pic_url_info?.url ||
    `https://unavatar.io/instagram/${encodeURIComponent(user.username)}`;

  return {
    name: user.full_name || user.username,
    bio: user.biography || 'Instagram profile found.',
    url: `https://www.instagram.com/${user.username}/`,
    username: user.username,
    profilePic,
    followers: user.edge_followed_by?.count,
    following: user.edge_follow?.count,
    posts: user.edge_owner_to_timeline_media?.count,
    isPrivate: user.is_private,
  };
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const normalizedQuery = normalizeQuery(req.query?.query || '');

    if (!normalizedQuery) {
      return res.status(400).json({ error: 'Please enter a valid Instagram username.' });
    }

    let usernameToLookup = normalizedQuery;

    if (!isValidInstaUsername(usernameToLookup)) {
      const discovered = await findUsernameFromSearch(normalizedQuery);
      if (!discovered) {
        return res.status(404).json({ error: 'User not found on Instagram.' });
      }
      usernameToLookup = discovered;
    }

    const profile = await getProfileByUsername(usernameToLookup);

    return res.status(200).json({
      text: 'Live profile data fetched from Instagram.',
      profiles: [profile],
    });
  } catch (error: any) {
    const status = String(error?.message || '').toLowerCase();

    if (status.includes('not found') || status.includes('404')) {
      return res.status(404).json({ error: 'User not found on Instagram.' });
    }

    return res.status(502).json({ error: 'Live Instagram data could not be fetched right now. Try again.' });
  }
}
