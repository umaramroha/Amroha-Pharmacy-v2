import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/kggg0b/', '/api/', '/checkout'],
    },
    sitemap: 'https://amrohapharmacy.vercel.app/sitemap.xml',
  };
}
