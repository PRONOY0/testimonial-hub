import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://testimonial-hub-five.vercel.app',
      lastModified: new Date(),
    },
  ]
}
