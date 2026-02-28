export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  avatarUrl?: string;

  feedback: string;
  audioUrl?: string | null;
  stars: number;

  socialLink: string;

  isVerifiedByOwner: boolean;

  createdAt: string;
}

export interface Stats {
  total: number;
  averageRating: number;
  verifiedCount: number;
}

export interface User {
  name: string;
  username: string;
  stats: Stats;
}

export interface unAuthorizedError {
  status: number;
}

export interface CustomLink {
  id: string;
  label: string;
  url: string;
  order: number;
}
