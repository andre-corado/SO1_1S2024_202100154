import React, { useState } from 'react';
import './App.css'

const App: React.FC = () => {
  const [data, setData] = useState<string>('');

  const fetchData = async () => {
    try {
      const response = await fetch('URL_DE_TU_API'); // Reemplaza 'URL_DE_TU_API' con la URL real de tu API
      const jsonData = await response.json();
      setData(JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  return (
    <div>
      <header>
        <h1>TAREA 1 - SO1 - 1S2024</h1>
      </header>
      <main>
        <button onClick={fetchData}>Mostrar Datos</button>
        {data && <p>{data}</p>}
      </main>
    </div>
  );
};

export default App;
