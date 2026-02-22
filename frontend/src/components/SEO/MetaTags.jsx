// src/Components/SEO/MetaTags.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const MetaTags = ({ 
  title, 
  description, 
  image, 
  article = false, 
  publishDate,
  modifiedDate,
  author,
  canonicalUrl 
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://casacerca.com';
  const fullUrl = `${siteUrl}${canonicalUrl}`;
  const fullImageUrl = image ? `${siteUrl}${image}` : undefined;
  
  // Site name constants
  const SITE_NAME = 'CasaCerca';
  const BLOG_NAME = 'Blog Inmobiliario';
  
  // Create full title based on context
  const getFullTitle = () => {
    if (article) {
      return `${title} | ${BLOG_NAME} | ${SITE_NAME}`;
    }
    if (title.includes(BLOG_NAME)) {
      return `${title} | ${SITE_NAME}`;
    }
    return `${title} | ${SITE_NAME}`;
  };

  const fullTitle = getFullTitle();
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {fullImageUrl && <meta name="twitter:image" content={fullImageUrl} />}

      {/* Article Specific Schema.org JSON-LD */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": fullImageUrl,
            "author": author ? {
              "@type": "Person",
              "name": author.name
            } : undefined,
            "datePublished": publishDate,
            "dateModified": modifiedDate || publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullUrl
            },
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME,
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
              }
            }
          })}
        </script>
      )}
    </Helmet>
  );
};