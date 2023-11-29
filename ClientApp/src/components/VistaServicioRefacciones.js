import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const VistaServicioRefacciones = () => {
    const [servicioRefacciones, setServicioRefacciones] = useState([]);
    const [idServicio, setIdServicio] = useState(''); // Asegúrate de inicializar el estado como un string vacío
    const [estatus, setEstatus] = useState(''); // Estado para el estatus

    const cargarServicioRefacciones = async () => {
        if (!idServicio) {
            alert('Por favor, ingrese un ID de servicio válido.');
            return;
        }

        try {
            // Actualiza la URL para que coincida con la ruta de tu API
            const response = await axios.get(`http://localhost:44471/weatherforecast/GetServicioConRefacciones/${idServicio}`);
            setServicioRefacciones(response.data);
        } catch (error) {
            console.error('Error al cargar las refacciones del servicio', error);
            setServicioRefacciones([]);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Vista de Servicio-Refacciones</h2>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese ID de Servicio..."
                    value={idServicio}
                    onChange={e => setIdServicio(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control ml-2"
                    placeholder="Ingrese Estatus..."
                    value={estatus}
                    onChange={e => setEstatus(e.target.value)}
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button" onClick={cargarServicioRefacciones}>
                        Buscar
                    </button>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID Servicio</th>
                        <th>Nombre Refacción</th>
                        <th>Descripción Refacción</th>
                        <th>Costo Refacción</th>
                        <th>Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    {servicioRefacciones
                        .filter(refaccion => refaccion.Estatus.includes(estatus)) // Filtra por estatus si se ha proporcionado uno
                        .map((refaccion, index) => (
                            <tr key={index}>
                                <td>{refaccion.idServicio}</td>
                                <td>{refaccion.NombreRefaccion}</td>
                                <td>{refaccion.DescripcionRefaccion}</td>
                                <td>{refaccion.CostoRefaccion}</td>
                                <td>{refaccion.Estatus}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default VistaServicioRefacciones;
