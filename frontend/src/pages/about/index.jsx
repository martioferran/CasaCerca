import React from 'react';
import Navbar from "../../components/layout/Navbar";

const SobreNosotros = () => {
  return (
    <>
    <Navbar className=""/>
    <div className="relative min-h-screen  bg-cover bg-center" style={{ backgroundImage: 'url(https://ucarecdn.com/a7e2f9bf-5226-4d2a-89ba-71434619ad21/patrickperkins3wylDrjxHEunsplash.jpg)' }}>
      <div className="flex items-center justify-center h-full  ">
        <div className="bg-white mt-16 max-w-3xl p-8 rounded-lg shadow-lg text-gray-800">
          <h2 className="text-3xl font-bold mb-4">Sobre Nosotros</h2>
          <p className="mb-2 text-lg">Bienvenidos a CasaCerca</p>
          <p className="mb-4 text-gray-700">
            En CasaCerca, nuestra misión es ayudarte a ahorrar tiempo en tu día a día al encontrar el hogar perfecto cerca de tus desplazamientos diarios. Sabemos que el tiempo es valioso y que pasar menos tiempo en el tráfico puede hacer una gran diferencia en tu calidad de vida. Por eso, hemos creado una plataforma diseñada para hacer que encontrar un apartamento cercano a tu lugar de trabajo, universidad, o cualquier otro destino cotidiano sea más fácil y rápido.
          </p>
          <h3 className="text-2xl font-bold mb-2">¿Quiénes Somos?</h3>
          <p className="mb-4 text-gray-700">
            Somos un equipo comprometido con la idea de que la búsqueda de vivienda no debería ser una tarea estresante. Con nuestra experiencia en el mercado inmobiliario y nuestra pasión por la tecnología, hemos desarrollado una herramienta que te permite encontrar opciones de vivienda cercanas a tus rutas diarias. Nuestro objetivo es simplificar tu búsqueda y permitirte disfrutar de más tiempo libre y menos tiempo de viaje.
          </p>
          <h3 className="text-2xl font-bold mb-2">Nuestra Visión</h3>
          <p className="mb-4 text-gray-700">
            Creemos en un futuro donde la búsqueda de un hogar se adapte a tu estilo de vida, no al revés. Queremos que cada persona pueda encontrar un lugar que no solo cumpla con sus expectativas, sino que también le permita optimizar su tiempo y reducir los desplazamientos innecesarios. Al ofrecerte opciones de vivienda que se alineen con tus necesidades diarias, buscamos hacer de tu vida algo más sencillo y placentero.
          </p>
          <a 
            href="mailto:admin@casacerca.es?subject=Sugerencia para mejorar" 
            className="block mt-4 text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Contáctanos si tienes alguna sugerencia para mejorar
          </a>
        </div>
      </div>
    </div>
    </>
  );
}

export default SobreNosotros;
