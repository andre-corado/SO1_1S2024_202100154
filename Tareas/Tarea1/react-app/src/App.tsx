import React, { useState } from 'react';
import './App.css'

interface StudentData {
  name: string;
  student_id: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<StudentData | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8080/api/data');
      const jsonData: StudentData = await response.json();
      setData(jsonData);

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
        {data && <p>{data.name} - {data.student_id}</p>}
      </main>
    </div>
  );
};

export default App;
