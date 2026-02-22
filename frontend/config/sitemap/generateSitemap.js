// generateSitemap.js
import { SitemapStream } from 'sitemap';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { blogPosts } from '../../src/features/blog/data/index.js';  // Add this import

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '../../');

// Get all your routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/sobre', changefreq: 'weekly', priority: 0.8 },
  { url: '/addition', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'weekly', priority: 0.8 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.5 },
  { url: '/terms', changefreq: 'monthly', priority: 0.5 },
  { url: '/blog', changefreq: 'daily', priority: 0.9 }  // Add blog index page
];

// Add blog post routes
const blogRoutes = blogPosts.map(post => ({
  url: `/blog/${post.slug}`,
  changefreq: 'weekly',
  priority: 0.7,
  lastmod: post.modifiedDate
}));

const BASE_URL = 'https://www.casacerca.es';

async function generateSitemap() {
  try {
    const smStream = new SitemapStream({ hostname: BASE_URL });
    
    const data = await new Promise((resolve, reject) => {
      let sitemap = '';
      
      smStream.on('data', chunk => {
        sitemap += chunk;
      });
      
      smStream.on('end', () => resolve(sitemap));
      smStream.on('error', reject);
      
      routes.forEach(route => {
        smStream.write({
          url: route.url,
          changefreq: route.changefreq,
          priority: route.priority,
          lastmod: new Date().toISOString()
        });
      });

      blogRoutes.forEach(route => {
        smStream.write({
          url: route.url,
          changefreq: route.changefreq,
          priority: route.priority,
          lastmod: route.lastmod
        });
      });
      
      smStream.end();
    });
    
    // Write sitemap to both public and dist folders
    writeFileSync(join(projectRoot, 'public', 'sitemap.xml'), data);
    writeFileSync(join(projectRoot, 'dist', 'sitemap.xml'), data);

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error.message);
    console.error(error.stack);
    process.exit(1); // Exit with error code to stop the build
  }
}

generateSitemap();