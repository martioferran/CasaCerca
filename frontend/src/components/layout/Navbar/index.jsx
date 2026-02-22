import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineCloseCircle, AiFillInstagram } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Logo from '../../common/Logo';

// Updated MenuItems JSON
const menuItems = [
  { text: "Sobre Nosotros", url: "/sobre" },
  { text: "Servicios Adicionales", url: "/addition" },
  { text: "Blog", url: "/blog" }, // Added Blog menu item
  { text: "Contáctanos", url: "/contact" },
];

const iconComponents = [
  { Icon: BsDiscord, color: "text-indigo-500", url: "#" },
  { Icon: AiFillInstagram, color: "text-rose-500", url: "#" },
  { Icon: FaTwitter, color: "text-sky-600", url: "#" },
  { Icon: MdEmail, color: "text-teal-500", url: "#" },
];

const IconList = () => (
  <div className="header-follow absolute bottom-5 left-0 right-0">
    <div className="flex items-center justify-evenly space-x-2 px-6 py-4">
      {iconComponents.map(({ Icon, color, url }) => (
        <a key={color} href={url}>
          <Icon className={`text-2xl ${color}`} />
        </a>
      ))}
    </div>
  </div>
);

function MobileMenu({ onClose }) {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".main-nav-menu-mobile")) {
        onClose();
      }
    };
    document.body.addEventListener("click", handleOutsideClick);
    return () => {
      document.body.removeEventListener("click", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="main-nav-menu-mobile z-50 bg-transparent shadow-sm lg:shadow-none absolute left-0 top-0 bottom-0 right-0 border-r border-slate-400/30 border-dashed w-[270px] md:w-[300px] lg:flex lg:w-[300px] lg:flex-col">
      <button>
        <div className="header-logo flex items-center space-x-2">
          <Logo /> {/* Replace the img tag with Logo component */}
        </div>
      </button>
      <div className="header-menu lg:hidden">
        <ul className="flex-col space-y-5 px-8 py-5 pb-8 text-[1.1rem] font-bold text-black">
          {menuItems.map((menuItem, index) => (
            <li key={index}>
              <Link to={menuItem.url}>
                <button onClick={onClose}>{menuItem.text}</button>
              </Link>
            </li>
          ))}
        </ul>
        <div className="header-button space-y-2">
        </div>
      </div>
      <IconList />
    </div>
  );
}

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = (event) => {
    event.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="navbar-home top-0 py-2 lg:py-5 w-full bg-transparent lg:relative z-50">
      <nav className="z-10 sticky top-0 left-0 right-0 max-w-4xl xl:max-w-5xl mx-auto px-5 py-2.5 lg:border-none lg:py-4">
        <div className="flex items-center justify-between">
          <div className="header-logo flex items-center space-x-2">
            <Logo /> {/* Replaced img with Logo component */}
          </div>
          <div className="header-menu hidden lg:flex items-center gap-x-10">
            <ul className="flex space-x-10 text-base font-bold text-black/80">
              {menuItems.map((menuItem, index) => (
                <li key={index}>
                  <Link to={menuItem.url}>
                    <button>{menuItem.text}</button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center lg:hidden">
            <button
              className={`advanced-setting-toggle focus:outline-none ${
                isMobileMenuOpen
                  ? "rounded-full bg-slate-200 text-slate-800"
                  : "text-slate-200"
              }`}
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? (
                <AiOutlineCloseCircle className="text-2xl focus:outline-none active:scale-110 active:text-slate-200" />
              ) : (
                <HiMenuAlt3 className="text-2xl text-slate-800 focus:outline-none active:scale-110 active:text-red-500" />
              )}
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="main-nav-menu fixed inset-0 z-50 transform overflow-auto bg-transparent transition duration-150 lg:hidden">
          <MobileMenu onClose={handleMobileMenuClose} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
