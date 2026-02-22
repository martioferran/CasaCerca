import React from 'react';
import { Link } from 'react-router-dom';

// Main Logo Component (Gradient version)
const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-center">
        <span className="text-3xl font-['Leckerli_One'] bg-gradient-to-r from-[#1A78F2] to-[#a855f7] text-transparent bg-clip-text">
          CasaCerca
        </span>
      </div>
    </Link>
  );
};

export default Logo;

// Named exports for test page
export const TextLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-center">
        <span className="text-[#1A78F2] font-bold text-2xl font-['Leckerli_One']">
          Casa<span className="text-[#a855f7]">Cerca</span>
        </span>
      </div>
    </Link>
  );
};

export const TextLogoGradient = Logo; // Export the gradient logo as a named export too