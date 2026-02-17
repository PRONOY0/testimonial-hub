export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  avatarUrl?: string;

  feedback: string;
  audioUrl?: string;
  stars: number;
  
  socialLink: string;
  
  isVerifiedByOwner: boolean;
  
  date: string;
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