import React from 'react';
import { Link } from "react-router-dom"; // Add this import

const Privacy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Política de Privacidad</h1>
        <Link 
          to="/" 
          className="flex items-center text-blue-600 hover:text-blue-700 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver al Inicio
        </Link>
      </div>

      <div className="prose max-w-none space-y-6">
        <p className="text-gray-600">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información que Recopilamos</h2>
          <p className="text-gray-700">
            En CasaCerca, recopilamos la siguiente información cuando utilizas nuestro servicio:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
            <li>Dirección de destino proporcionada para la búsqueda</li>
            <li>Preferencias de tiempo de desplazamiento</li>
            <li>Método de transporte seleccionado</li>
            <li>Tipo de vivienda de interés</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Uso de la Información</h2>
          <p className="text-gray-700">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
            <li>Proporcionar resultados de búsqueda precisos</li>
            <li>Mejorar nuestro servicio</li>
            <li>Personalizar la experiencia del usuario</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookies y Tecnologías Similares</h2>
          <p className="text-gray-700">
            Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario y 
            analizar el uso de nuestro servicio. Puedes configurar tu navegador para rechazar 
            las cookies, pero esto puede afectar la funcionalidad del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Compartición de Datos</h2>
          <p className="text-gray-700">
            No vendemos ni compartimos tu información personal con terceros, excepto cuando:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
            <li>Sea necesario para proporcionar el servicio (ej: servicios de mapas)</li>
            <li>Estemos obligados por ley</li>
            <li>Hayas dado tu consentimiento explícito</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contacto</h2>
          <p className="text-gray-700">
            Si tienes preguntas sobre nuestra política de privacidad, puedes contactarnos a través
            de nuestra página de contacto o por correo electrónico.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;