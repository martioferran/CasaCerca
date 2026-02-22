// src/Components/Blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const BlogCard = ({ post }) => {
  return (
    <article className="h-full">
      <Link 
        to={`/blog/${post.slug}`}
        className="block h-full group"
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-transform duration-300 group-hover:transform group-hover:-translate-y-1">
          <figure>
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover"
              width="800"
              height="400"
              loading="lazy"
            />
          </figure>
          <div className="p-6">
            <header>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-blue-600 text-sm font-semibold">
                  {post.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-3">{post.title}</h2>
            </header>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <footer className="mt-auto pt-4">
              <time 
                dateTime={post.publishDate}
                className="text-sm text-gray-500"
              >
                {new Date(post.publishDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </footer>
          </div>
        </div>
      </Link>
    </article>
  );
};