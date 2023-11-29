import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const GraficasBarras = () => {
    const refActivos = useRef(null);
    const refNoActivos = useRef(null);

    useEffect(() => {
        const ctxActivos = refActivos.current.getContext('2d');
        const ctxNoActivos = refNoActivos.current.getContext('2d');

        new Chart(ctxActivos, {
            type: 'bar',
            data: {
                labels: ['Activos'],
                datasets: [{
                    label: 'Cantidad',
                    data: [15],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        new Chart(ctxNoActivos, {
            type: 'bar',
            data: {
                labels: ['No Activos'],
                datasets: [{
                    label: 'Cantidad',
                    data: [8],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <canvas ref={refActivos} />
                </div>
                <div className="col">
                    <canvas ref={refNoActivos} />
                </div>
            </div>
        </div>
    );
}

export default GraficasBarras;
