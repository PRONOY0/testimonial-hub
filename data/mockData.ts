import { Testimonial } from "@/types/types";

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    authorName: "Sarah Jenkins",
    authorTitle: "Product Designer",
    company: "Stripe",
    rating: 5,
    text: "TestimonialHub completely changed how I showcase my freelance work. Clients love the professional submission form, and I love how easy it is to manage.",
    isVerified: true,
    authorAvatar: "https://picsum.photos/100/100?random=1",
    date: "2023-10-15",
  },
  {
    id: "2",
    authorName: "David Chen",
    authorTitle: "Founder",
    company: "Nexus AI",
    rating: 5,
    text: "The best tool for social proof. We saw a 30% increase in conversion after embedding these verified testimonials on our landing page.",
    isVerified: true,
    authorAvatar: "https://picsum.photos/100/100?random=2",
    date: "2023-11-02",
  },
  {
    id: "3",
    authorName: "Elena Rodriquez",
    authorTitle: "Marketing Lead",
    company: "Vercel",
    rating: 4,
    text: "Simple, fast, and beautiful. It does one thing and does it perfectly. The dark mode dashboard is a joy to use.",
    isVerified: false,
    authorAvatar: "https://picsum.photos/100/100?random=3",
    date: "2023-11-10",
  },
];
