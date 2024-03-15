// BarraSuperior.tsx
import React from 'react';

const BarraSuperior: React.FC = () => {
  return (
    <div className="barra-superior">
      <div className="menu">
        {/* Aquí coloca tu contenido del menú, como enlaces a otras páginas */}
        <a href="/">Inicio</a>
        <a href="/pagina1">Página 1</a>
        <a href="/pagina2">Página 2</a>
      </div>
      <h1 className="titulo">SO1-PROYECTO1</h1>
      <img className="logo" src="src/img/docker.png" alt="Logo Docker" />
    </div>
  );
};

export default BarraSuperior;
