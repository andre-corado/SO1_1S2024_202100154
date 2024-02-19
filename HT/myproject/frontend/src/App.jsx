// Importa useState y useEffect si aún no lo has hecho
import { useState, useEffect } from 'react';
import './App.css';
import { GetRam } from "../wailsjs/go/main/App";
import Chart from 'chart.js/auto';

function App() {
    const [resultText, setResultText] = useState("Conectando...");
    const [usedPercentage, setUsedPercentage] = useState("0%");

    // Función para obtener la información de RAM
    function getRam() {
        GetRam()
            .then(resultText => {
                // Actualizar el estado con el resultado recibido
                setResultText(resultText);
                
                // Convertir el resultado a un objeto JSON
                let result = JSON.parse(resultText);
        
                // Separar el resultado en memoria usada y libre
                let usedPercentage = result.percentUsed;
        
                // Llamar a la función para crear o actualizar la gráfica de RAM
                updateRamChart(usedPercentage);
                setUsedPercentage(usedPercentage);
            })
            .catch(error => {
                // Manejar errores si la promesa es rechazada
                console.error("Error al obtener la información de RAM:", error);
            });
    }

    // Función para crear o actualizar la gráfica de RAM
    function updateRamChart(usedPercentage) {
        const ramChart = document.getElementById('myChart');
        new Chart(ramChart, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Free'],
                datasets: [{
                    label: 'RAM Usage',
                    data: [usedPercentage, 100 - usedPercentage],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'RAM Usage (%)'
                    }
                }
            }
        });
    }

    // Ejecuta getRam() periódicamente cada 500ms
    useEffect(() => {
        const intervalId = setInterval(getRam, 500);

        // Limpia el intervalo cuando el componente se desmonta o se actualiza
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div id="App">            
            <div id="result" className="result">{resultText}</div>
            <div id="myChartContainer">
            <canvas id="myChart" width="400" height="400"></canvas>
            </div>
            <div id="usedPercentage" height="900px" className="usedPercentage">{usedPercentage + "%" + "\n RAM UTILIZADA"}</div>

        </div>
    )
}

export default App;
