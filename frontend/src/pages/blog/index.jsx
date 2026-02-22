import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { BlogList } from '../../features/blog/components/BlogList';
import { MetaTags } from '../../components/SEO/MetaTags';
import { blogPosts } from '../../features/blog/data';
import { HiArrowLeft } from 'react-icons/hi';

export const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <MetaTags
          title="Blog Inmobiliario"
          description="Encuentra los mejores consejos y guías sobre el mercado inmobiliario español"
          canonicalUrl="/blog"
        />

        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <HiArrowLeft className="mr-2 text-xl" />
              <span>Volver a Inicio</span>
            </button>
          </div>

          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
                Nuestro Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Encuentra tu alojamiento ideal: guías de vivienda para estudiantes y jóvenes profesionales.
            </p>
          </header>

          <BlogList posts={blogPosts} />
        </div>
      </main>
    </>
  );
};