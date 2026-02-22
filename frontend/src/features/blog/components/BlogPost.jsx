import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Navbar from '../../../components/layout/Navbar';
import { MetaTags } from '../../../components/SEO/MetaTags';
import { blogPosts } from '../data';
import { HiArrowLeft } from 'react-icons/hi';

// Configure DOMPurify to properly handle multiple maps
DOMPurify.addHook('beforeSanitizeElements', function(node) {
  // Preserve map and area elements
  if (node.tagName === 'MAP' || node.tagName === 'AREA') {
    return node;
  }
});

DOMPurify.addHook('afterSanitizeAttributes', function(node) {
  if (node.tagName === 'IMG') {
    // Ensure usemap attribute is preserved and properly formatted
    if (node.hasAttribute('usemap')) {
      const usemapValue = node.getAttribute('usemap');
      // Ensure the # is present in the usemap reference
      node.setAttribute('usemap', usemapValue.startsWith('#') ? usemapValue : `#${usemapValue}`);
    }
  }
  if (node.tagName === 'MAP') {
    // Ensure map name is preserved
    if (node.hasAttribute('name')) {
      const nameValue = node.getAttribute('name');
      node.setAttribute('name', nameValue);
    }
  }
  if (node.tagName === 'AREA') {
    // Preserve all area attributes
    const areaAttrs = ['shape', 'coords', 'href', 'alt', 'title', 'target', 'rel', 'style'];
    areaAttrs.forEach(attr => {
      if (node.hasAttribute(attr)) {
        const value = node.getAttribute(attr);
        if (value !== 'null' && value !== '') {
          node.setAttribute(attr, value);
        }
      }
    });
  }
});

// Configure marked options
marked.setOptions({
  headerIds: true,
  mangle: false,
  headerPrefix: 'section-',
  gfm: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: true,
  xhtml: true, // Changed to true to ensure proper self-closing tags
  html: true,
  renderer: new marked.Renderer()
});

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    navigate('/blog');
    return null;
  }

  const htmlContent = DOMPurify.sanitize(marked(post.content), {
    ADD_TAGS: ['map', 'area', 'img', 'style'],  // Added 'style' here
    ADD_ATTR: [
      'usemap',
      'name',
      'shape', 
      'coords', 
      'href', 
      'alt', 
      'title', 
      'target', 
      'rel', 
      'style',
      'width',
      'height'
    ]
  });

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
      <MetaTags
        title={post.seo.title}
        description={post.seo.description}
        image={post.image}
        article={true}
        publishDate={post.publishDate}
        modifiedDate={post.modifiedDate}
        canonicalUrl={`/blog/${post.slug}`}
        keywords={post.seo.keywords.join(', ')}
        author={post.seo.author}
        type="article"
        additionalTags={[
          {
            property: 'article:tag',
            content: post.seo.articleTags.join(', ')
          },
          {
            property: 'article:section',
            content: post.seo.articleSection
          },
          {
            name: 'robots',
            content: 'index, follow'
          },
          {
            property: 'og:locale',
            content: 'es_ES'
          }
        ]}
      />

        <article className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <HiArrowLeft className="mr-2 text-xl" />
              <span>Volver al Blog</span>
            </button>
          </div>

          <header className="mb-12">
            <span className="text-blue-600 font-semibold">{post.category}</span>
            <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-500 text-sm">
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.tags.join(', ')}</span>
                </>
              )}
            </div>
            
            {post.image && (
              <div className="mt-6">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </header>

          <div 
            className="prose prose-lg max-w-none
                       prose-headings:text-gray-800 prose-headings:font-bold
                       prose-p:text-gray-600 prose-p:leading-relaxed
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-ul:list-disc prose-ol:list-decimal [&_.map-container]:relative [&_.map-container_img]:w-full [&_.map-container_img]:h-auto"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <HiArrowLeft className="mr-2 text-xl" />
              <span>Volver al Blog</span>
            </button>
          </div>
        </article>
      </main>
    </>
  );
};