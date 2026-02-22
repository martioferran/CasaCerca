import React, { useState, useEffect } from "react";
import Navbar from "../../../components/layout/Navbar";
import FormSection from "./FormSection";

// Change the function parameters to include initialData
function HeroSection({ onResultData, initialData }) {  // Add initialData here
  const words = ["del trabajo", "de la universidad", "del gimnasio", "del colegio"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Your existing useEffect and getRandomColor remain the same
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <section className="relative before:absolute before:h-full before:w-full before:-top-20 before:bg-cover before:bg-no-repeat before:bg-[url('https://ucarecdn.com/a7e2f9bf-5226-4d2a-89ba-71434619ad21/patrickperkins3wylDrjxHEunsplash.jpg')]">
      <Navbar />
      <div className="main-hero-section relative py-14 px-7 md:px-10 xl:px-0">
        <div className="main-hero-container max-w-5xl pb-3 lg:pb-24 mx-auto text-center flex flex-col gap-y-5 justify-center items-center">
          {/* Hero text inside a white card on mobile */}
          <div className="bg-white p-4 rounded-lg sm:bg-transparent sm:p-0 sm:rounded-none">
            <h2 className="font-bold text-black text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto">
              Encuentra tu piso ideal cerca <span className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`} style={{ color: getRandomColor() }}>{words[currentWordIndex]}</span>
            </h2>
            <p className="max-w-lg text-sm lg:text-lg mx-auto text-black">
              Busca apartamentos según tu tiempo de desplazamiento. Más tiempo viviendo, menos tiempo parado en el semáforo.
            </p>
          </div>
        </div>

        <div className="form-section-container relative lg:mt-16 max-w-5xl mx-auto">
          {/* Pass initialData to FormSection */}
          <FormSection onResultData={onResultData} initialData={initialData} />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;