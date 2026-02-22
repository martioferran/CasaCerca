import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import Logo from '../../common/Logo';  // Add this import (adjust path as needed)

const icons = [
  { icon: <FaFacebookF />, url: "#" },
  { icon: <AiOutlineInstagram />, url: "#" },
  { icon: <FaYoutube />, url: "#" },
];

function Footer() {
  return (
    <div className="bg-[#E8F1FE] lg:px-10 pt-10">
      <div className="max-w-5xl mx-auto border-b border-[#E3E3EA] pb-5">
        <div className="flex flex-col gap-y-10 lg:flex-row items-center justify-between">
          <h2 className="w-1/2 text-black flex justify-center lg:justify-start font-bold text-2xl">
            <Logo /> {/* Replaced Link and img with Logo component */}
          </h2>
          <div className="lg:w-2/3 flex items-center justify-between w-full px-10">
            <div>
              <ul className="flex items-center justify-center gap-x-6">
                <li>
                  <Link to="/contact" className="hover:text-blue-600">Contacto</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-blue-600">Privacidad</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-600">Términos</Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-between gap-x-10">
              {icons.map((item, index) => (
                <a key={index} href={item.url}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#959595] flex justify-center py-2">
        Copyright © {new Date().getFullYear()}
      </p>
    </div>
  );
}

export default Footer;