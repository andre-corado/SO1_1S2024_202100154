import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataSet, Graph2d } from 'vis-graph2d';
import 'vis-graph2d/dist/vis-graph2d.min.css';

const TimeGraph = ({ data }) => {
    useEffect(() => {
        const container = document.getElementById('time-graph-container');

        // Creamos un nuevo DataSet con los datos proporcionados
        const dataset = new DataSet(data);

        // Opciones predeterminadas para el gráfico
        const options = {
            start: data[0]?.x, // Utilizamos la primera fecha como inicio si hay datos
            end: data[data.length - 1]?.x, // Utilizamos la última fecha como fin si hay datos
            drawPoints: {
                style: 'circle', // Estilo de los puntos
                size: 6, // Tamaño de los puntos
            },
            shaded: {
                orientation: 'bottom' // Sombreado desde abajo
            }
        };

        // Creamos el gráfico de tiempo
        const graph2d = new Graph2d(container, dataset, options);

        // Limpieza al desmontar el componente
        return () => {
            graph2d.destroy();
        };
    }, [data]);

    return <div id="time-graph-container" style={{ height: '400px' }}></div>;
};

TimeGraph.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        y: PropTypes.number.isRequired,
    })).isRequired,
};

export default TimeGraph;
