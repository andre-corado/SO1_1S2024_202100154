import React from 'react';
import { Link } from 'react-router-dom';

const links = [  
  {
    name: 'Live',
    href: '/'
  },
  {
    name: 'History',
    href: '/history'
  }
];

const BarraSuperior = () => {
  return (
    <div className="barra-superior">
      <div className="menu">
        {links.map((x) => (
          <Link to={x.href}>{x.name}</Link>
        ))}
      </div>
      <h1 className="titulo">SO1-PROYECTO1</h1>
      <img className="logo" src="src/img/docker.png" alt="Logo Docker" />
    </div>
  );
};

export default BarraSuperior;
