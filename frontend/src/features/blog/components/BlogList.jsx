// src/components/Blog/BlogList.jsx
import React from 'react';
import { BlogCard } from './BlogCard';

export const BlogList = ({ posts }) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      aria-label="Blog posts"
    >
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
};