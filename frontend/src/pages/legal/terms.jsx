import React from 'react';
import { Link } from "react-router-dom"; // Add this import

const Terms = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Términos de Servicio</h1>
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
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p className="text-gray-700">
            Al acceder y utilizar CasaCerca, aceptas estar sujeto a estos términos de servicio. 
            Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Descripción del Servicio</h2>
          <p className="text-gray-700">
            CasaCerca es una herramienta de búsqueda que ayuda a los usuarios a encontrar 
            viviendas basándose en el tiempo de desplazamiento. No somos una agencia inmobiliaria 
            y no participamos en transacciones inmobiliarias.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso del Servicio</h2>
          <p className="text-gray-700">
            Te comprometes a utilizar el servicio solo para fines legales y de acuerdo con estos términos.
            No puedes:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
            <li>Utilizar el servicio de manera que pueda dañarlo o afectar su disponibilidad</li>
            <li>Realizar scraping o automatizar el acceso al servicio</li>
            <li>Utilizar el servicio para fines ilegales o no autorizados</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitación de Responsabilidad</h2>
          <p className="text-gray-700">
            CasaCerca proporciona información basada en datos de terceros y no garantiza la 
            exactitud de los tiempos de desplazamiento o la disponibilidad de las viviendas.
            No somos responsables de las decisiones tomadas basándose en esta información.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Modificaciones</h2>
          <p className="text-gray-700">
            Nos reservamos el derecho de modificar o reemplazar estos términos en cualquier 
            momento. Es tu responsabilidad revisar los términos periódicamente.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;