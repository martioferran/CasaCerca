import React from 'react';
import Navbar from "../../components/layout/Navbar";

const Addition = () => {
  return (
    <>
    <Navbar className=""/>
    <div className="relative min-h-screen  bg-cover bg-center" style={{ backgroundImage: 'url(https://ucarecdn.com/a7e2f9bf-5226-4d2a-89ba-71434619ad21/patrickperkins3wylDrjxHEunsplash.jpg)' }}>
    <div className="flex items-center justify-center h-full ">
        <div className="bg-white  mt-16  max-w-3xl p-8 rounded-lg shadow-lg text-gray-800">
          <h2 className="text-3xl font-bold mb-4">Servicios Adicionales</h2>
          <p className="mb-4 text-lg">
            Soluciones Personalizadas para Agencias Inmobiliarias
          </p>
          <p className="mb-4 text-gray-700">
            En CasaCerca también ofrecemos servicios adicionales enfocados a potenciar la visibilidad y eficacia de las agencias inmobiliarias. Trabajamos estrechamente con nuestros socios en el sector para ofrecer soluciones personalizadas que optimizan la forma en que presentan sus propiedades y conectan con sus clientes.
          </p>
          <h3 className="text-2xl font-bold mb-2">Proyectos Personalizados</h3>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Presentación de Propiedades: Creación de portafolios de propiedades que capturen de manera efectiva las características y ventajas de cada inmueble.</li>
            <li>Herramientas de Matchmaking: Desarrollo de herramientas avanzadas que ayudan a las agencias a conectar a los clientes con las propiedades que mejor se ajusten a sus necesidades y preferencias.</li>
            <li>Herramientas de Pricing: Pricing inteligente de propiedades basado en ubicación, superficie, número de habitaciones, etc.</li>
          </ul>
          <a 
            href="mailto:admin@casacerca.es" 
            className="block mt-4 text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
    </>
  );
}

export default Addition;
