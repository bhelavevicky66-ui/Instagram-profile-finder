
export interface InstagramProfile {
  name: string;
  bio: string;
  url: string;
  username: string;
  profilePic?: string;
}

export interface SearchResult {
  text: string;
  profiles: InstagramProfile[];
}

export interface AppState {
  query: string;
  isLoading: boolean;
  result: SearchResult | null;
  error: string | null;
}
