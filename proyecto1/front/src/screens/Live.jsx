import React, { useState, useEffect } from "react";
import './Live.css';
import PieChart from '../components/PieChart';

const API_URL = 'http://localhost:3000/api/getLive';

const Live = () => {
    const [ramUsage, setRamUsage] = useState(null);
    const [cpuUsage, setCpuUsage] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setRamUsage(data.ram);
            setCpuUsage(data.cpu);
            console.log(data);
            console.log("ramUsage: ", data.ram , "cpuUsage: ", data.cpu);
        } catch (error) {
            console.error('Error fetching live data:', error);
            setRamUsage(null);
            setCpuUsage(null);
        }
    };

    useEffect(() => {
        fetchData(); // Ejecutar la primera vez al montar el componente

        const intervalId = setInterval(() => {
            fetchData(); // Ejecutar cada intervalo de milisegundos
        }, 1000);

        // Limpiar el intervalo cuando el componente se desmonte o actualice
        return () => clearInterval(intervalId);
    }, []);

    if (ramUsage === null || cpuUsage === null) {
        return <div className="container">
            <div className="chartContainer">
                <div className="chartLabel">Loading...</div>
            </div>
            <div className="chartContainer">
                <div className="chartLabel">Loading...</div>
            </div>
        </div>;
    }

    return (
        <div className="container"> {/* Usa la clase container del archivo CSS */}
            <div className="chartContainer"> {/* Usa la clase chartContainer */}
                {ramUsage !== null && (
                    <>
                        <PieChart value={ramUsage} label="RAM" />
                        <div className="chartLabel">RAM</div> {/* Usa la clase chartLabel */}
                    </>
                )}
            </div>

            <div className="chartContainer"> {/* Usa la clase chartContainer */}
                {cpuUsage !== null && (
                    <>
                        <PieChart value={cpuUsage} label="CPU" />
                        <div className="chartLabel">CPU</div> {/* Usa la clase chartLabel */}
                    </>
                )}
            </div>
        </div>
    );
    

};

export default Live;
