# TestimonialHub

Build trust through authentic client testimonials. The modern way to showcase your professional reputation.

## Overview

TestimonialHub is a SaaS platform that makes collecting and showcasing client testimonials effortless. Built for freelancers, agencies, and professionals who want to build credibility without the awkward back-and-forth.

### The Problem

- Asking clients for testimonials feels uncomfortable
- Email/text screenshots look unprofessional
- No easy way to verify authenticity
- Manual updates are time-consuming

### The Solution

- Unique submission link - Send once, collect forever
- No login required - Clients submit in seconds
- Social verification - LinkedIn/Twitter/Instagram validation
- Audio testimonials - Capture tone and authenticity
- Beautiful public profiles - Auto-generated, SEO-friendly pages
- Developer API - Embed anywhere with one request

## Features

Core Features:

- Multi-step submission form with animations
- Audio testimonials with browser recording
- Avatar uploads via Cloudinary
- Social verification (LinkedIn, Twitter, Instagram)
- Star ratings (1-5 scale)
- Public profile pages with masonry grid layout
- Dashboard with stats and analytics
- Email notifications via Resend
- Public API for developers
- Responsive design (mobile, tablet, desktop)

User Experience:

- Modern dark UI with glassmorphism effects
- Smooth animations with Framer Motion
- Lottie animations for visual feedback
- Firebase authentication with Google OAuth
- Mobile-first responsive design

Developer Features:

- RESTful API for testimonials
- Interactive API docs with live playground
- CORS enabled for cross-origin requests
- Rate limiting (100 req/min per IP)
- TypeScript for type safety

## Tech Stack

Frontend:

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React

Backend:

- Database: MongoDB via Prisma ORM
- Authentication: Firebase Auth
- File Storage: Cloudinary
- Email: Resend
- API Routes: Next.js API Routes

DevOps:

- Hosting: Vercel
- Version Control: Git + GitHub
- Package Manager: npm

## Getting Started

Prerequisites:

- Node.js 18.x or higher
- npm or yarn
- MongoDB database (MongoDB Atlas recommended)
- Firebase project
- Cloudinary account
- Resend API key

Installation:

1. Clone the repository

```bash
git clone https://github.com/yourusername/testimonialhub.git
cd testimonialhub
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your credentials (see Environment Variables section below)

4. Set up Prisma

```bash
npx prisma generate
npx prisma db push
```

5. Run development server

```bash
npm run dev
```

6. Open your browser

```
http://localhost:3000
```

## Project Structure

```
testimonialhub/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── testimonial/     # Testimonial CRUD
│   │   ├── user/            # User management
│   │   └── public/          # Public API
│   ├── dashboard/           # Dashboard page
│   ├── submit/              # Testimonial submission
│   ├── [username]/          # Public profile pages
│   └── api-docs/            # API documentation
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── submit/              # Form step components
│   └── layout/              # Layout components
├── lib/                     # Utilities and configs
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── public/                  # Static assets
├── prisma/                  # Database schema
└── .env.local              # Environment variables
```

## API Documentation

Base URL:

```
Production: https://testimonialhub.io/api
Development: http://localhost:3000/api
```

Endpoints:

GET /api/public/testimonials/:username

Fetch all testimonials for a user.

Response:

```json
{
  "user": {
    "name": "Alex Rivera",
    "userName": "alexrivera",
    "avatarUrl": "https://...",
    "tagLine": "Brand designer",
    "customUrl": "https://alexrivera.design"
  },
  "stats": {
    "totalTestimonials": 24,
    "averageRating": 4.9,
    "verifiedCount": 20
  },
  "testimonials": [
    {
      "id": "...",
      "name": "Sarah Jenkins",
      "company": "Stripe",
      "feedback": "Amazing work!",
      "stars": 5,
      "audioUrl": "https://...",
      "socialType": "linkedin",
      "socialLink": "https://linkedin.com/in/sarah",
      "isVerified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

Example:

```bash
curl https://testimonialhub.io/api/public/testimonials/alexrivera
```

## Environment Variables

Create a .env.local file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/testimonialhub"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-api-secret"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# App URL
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
```

Getting API Keys:

MongoDB Atlas:

1. Create account at mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string

Firebase:

1. Go to console.firebase.google.com
2. Create project
3. Enable Google Authentication
4. Get Web API credentials
5. Generate service account key (for admin)

Cloudinary:

1. Sign up at cloudinary.com
2. Dashboard → Account Details
3. Copy Cloud Name, API Key, API Secret

Resend:

1. Sign up at resend.com
2. Create API key
3. Verify domain (optional)

## Deployment

Deploy to Vercel (Recommended):

1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Import to Vercel

- Go to vercel.com
- Click "Import Project"
- Select your GitHub repo

3. Add environment variables

- In Vercel dashboard → Settings → Environment Variables
- Add all variables from .env.local

4. Deploy

- Vercel auto-deploys on push
- Or click "Deploy" manually

Custom Domain (Optional):

1. In Vercel → Settings → Domains
2. Add your domain
3. Update DNS records
4. SSL auto-configured

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

Code Style:

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Developer

Pronoy Roy

- Portfolio: devpronoy.com
- GitHub: github.com/pronoyroy
- LinkedIn: linkedin.com/in/pronoyroy
- Twitter: twitter.com/pronoyroy

## Roadmap

Future features:

- Email/password authentication
- Video testimonials
- Embeddable widgets
- Custom branding
- Analytics dashboard
- Zapier integration
- Slack notifications
- Export to PDF
- Multi-language support

## Known Issues

- Case-sensitive file paths on Linux (solved: use lowercase)
- Audio playback on iOS Safari (investigating)

Report bugs at: github.com/yourusername/testimonialhub/issues

## FAQ

Q: Is it free to use?
A: Yes, the platform is free for now. Pricing may be introduced later.

Q: Can I self-host?
A: Yes! Follow the installation guide and deploy anywhere.

Q: How do I verify testimonials?
A: Social links (LinkedIn/Twitter/Instagram) are verified by checking the URL format.

Q: Can clients edit testimonials?
A: No. Once submitted, testimonials are immutable for credibility.

Q: Is there a limit on testimonials?
A: No limit currently.

---

Built by Pronoy Roy

Report Bug | Request Feature
