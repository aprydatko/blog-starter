// app/api/robots/route.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow Googlebot full access to everything except the '/private/' directory
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },

      // Block Applebot and Bingbot from crawling anything on the site
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'], // Block all paths
      },

      // Allow Googlebot access to everything, but block pages with query parameters (e.g., '?')
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/?*', // Block query parameter pages (e.g., '/page?query=search')
      },

      // Block all bots from crawling the /admin/ and /checkout/ pages
      {
        userAgent: '*', // All bots
        disallow: ['/admin/', '/checkout/', '/cart/', '/user/', '/user-profile', '/register', '/login'],
        allow: ['/api/og/'],
      },

      // Allow Bingbot to crawl the blog but block the checkout page
      {
        userAgent: 'Bingbot',
        allow: ['/blog/', '/articles/'],
        disallow: ['/checkout/'],
      },

      // Block all bots from crawling a specific file
      {
        userAgent: '*',
        disallow: '/confidential.html', // Block the 'confidential.html' page from being indexed
      },

      // Allow all bots to crawl images but not private images
      {
        userAgent: '*',
        allow: ['/images/'],
        disallow: ['/private/images/'],
      },

      // Implement a crawl delay for all bots (10 seconds between requests)
      {
        userAgent: '*',
        crawlDelay: 10,
      },

      // Allow Googlebot to crawl specific folder (e.g., 'public')
      {
        userAgent: 'Googlebot',
        allow: ['/public/'],
      },

      // Block a bot only from crawling a specific path with a hash fragment (#)
      {
        userAgent: 'Googlebot',
        disallow: '/page/#someFragment',
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`, // Sitemap URL for better indexing
  }
}
