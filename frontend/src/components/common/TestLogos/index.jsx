// TestLogos.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LogoBase = ({ className, style, children }) => (
  <Link to="/">
    <div className="flex items-center">
      <span className={`text-3xl font-['Leckerli_One'] ${className}`} style={style}>
        CasaCerca
      </span>
    </div>
  </Link>
);

const LogoVariations = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Logo Variations</h1>

      {/* Test against different backgrounds */}
      <div className="space-y-8">
        {/* Light Background */}
        <div className="p-6 rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">On Light Background</h2>
          <div className="space-y-6">
            {/* Original */}
            <div>
              <p className="text-sm text-gray-500 mb-2">1. Original Gradient</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text" />
            </div>

            {/* With Shadow */}
            <div>
              <p className="text-sm text-gray-500 mb-2">2. With Drop Shadow</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
            </div>

            {/* With Background */}
            <div>
              <p className="text-sm text-gray-500 mb-2">3. With Light Background</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text px-3 py-1 rounded-lg bg-gray-50" />
            </div>

            {/* With Outline */}
            <div>
              <p className="text-sm text-gray-500 mb-2">4. With Outline</p>
              <LogoBase 
                className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text"
                style={{
                  WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Dark Background */}
        <div className="p-6 rounded-lg bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-white">On Dark Background</h2>
          <div className="space-y-6">
            {/* Original */}
            <div>
              <p className="text-sm text-gray-400 mb-2">1. Original Gradient</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text" />
            </div>

            {/* With Shadow */}
            <div>
              <p className="text-sm text-gray-400 mb-2">2. With Drop Shadow</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]" />
            </div>

            {/* With Background */}
            <div>
              <p className="text-sm text-gray-400 mb-2">3. With Light Background</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm" />
            </div>

            {/* With Outline */}
            <div>
              <p className="text-sm text-gray-400 mb-2">4. With Outline</p>
              <LogoBase 
                className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text"
                style={{
                  WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                  textShadow: '0 2px 4px rgba(255,255,255,0.1)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Image Background */}
        <div className="p-6 rounded-lg bg-cover bg-center" style={{backgroundImage: 'url("https://source.unsplash.com/random/1200x800?interior")'}}>
          <h2 className="text-lg font-semibold mb-4 text-white">On Image Background</h2>
          <div className="space-y-6">
            {/* Same variations as above */}
            {/* Original */}
            <div>
              <p className="text-sm text-white mb-2">1. Original Gradient</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text" />
            </div>

            {/* With Shadow */}
            <div>
              <p className="text-sm text-white mb-2">2. With Drop Shadow</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
            </div>

            {/* With Background */}
            <div>
              <p className="text-sm text-white mb-2">3. With Light Background</p>
              <LogoBase className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text px-3 py-1 rounded-lg bg-white/70 backdrop-blur-sm" />
            </div>

            {/* With Outline */}
            <div>
              <p className="text-sm text-white mb-2">4. With Outline</p>
              <LogoBase 
                className="bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text"
                style={{
                  WebkitTextStroke: '1px rgba(255,255,255,0.5)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoVariations;