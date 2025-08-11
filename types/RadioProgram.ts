export interface RadioProgram {
  id: string;
  type: string;
  title: string;
  desc: string;
  excerpt: string;
  "is-published": string;
  thumb: string;
  "app-cover": string;
  cover: string;
  "comments-count": number;
  "likes-count": number;
  "bookmarks-count": number;
  "is-verified": string;
  "published-at": string;
  "option-is-official": string;
  "option-is-focus-showcase": string;
  duration: number;
  "is-free": string;
  url: string;
}

export interface RadioProgramStats {
  totalPrograms: number;
  totalLikes: number;
  totalComments: number;
  totalBookmarks: number;
  averageDuration: number;
}
