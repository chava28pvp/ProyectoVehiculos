import React, { useState,useEffect } from 'react';
import axios from 'axios';

const Servicios = () => {
    const [servicios, setServicios] = useState([]);
    const [servicioActual, setServicioActual] = useState({
        idServicio: '',
        idVehiculo: '',
        nombre: '',
        fecha: '',
        asignado: '',
        descripcion: '',
        costo: ''
    });
    const [modoEdicion, setModoEdicion] = useState(false);
 
    useEffect(() => {
        cargarServicios();
    }, []);

    const cargarServicios = () => {
        axios.get('http://localhost:44471/weatherforecast/GetServicios')
            .then(response => {
                setServicios(response.data);
            })
            .catch(error => {
                console.error('Error al cargar los servicios', error);
            });
    };

    const handleInputChange = (e) => {
        setServicioActual({ ...servicioActual, [e.target.name]: e.target.value });
    };

 
    const agregarServicio = () => {
        axios.post('http://localhost:44471/weatherforecast/AddServicio', servicioActual)
            .then(response => {
                setServicios([...servicios, response.data]);
                setServicioActual({
                    idServicio: '',
                    idVehiculo: '',
                    nombre: '',
                    fecha: '',
                    asignado: '',
                    descripcion: '',
                    costo: ''
                });
                cargarServicios();
            })
            .catch(error => {
                console.error('Error al agregar el servicio', error);
            });
    };

 
    const eliminarServicio = (id) => {
        axios.delete(`http://localhost:44471/weatherforecast/DeleteServicio/${id}`)
            .then(response => {
                setServicios(servicios.filter(servicio => servicio.idServicio !== id));
            })
            .catch(error => {
                console.error('Error al eliminar el servicio', error);
            });
    };
 
    const editarServicio = (id) => {
        const servicioAEditar = servicios.find(servicio => servicio.idServicio === id);
        setServicioActual(servicioAEditar);
        setModoEdicion(true);
    };

 
    const actualizarServicio = () => {
        const url = `http://localhost:44471/weatherforecast/UpdateServicio/${servicioActual.idServicio}`;
        
        axios.put(url, servicioActual)
            .then(response => {
                // Maneja la respuesta exitosa aquí
                // Por ejemplo, actualizar la lista de servicios si es necesario
    
                // Limpia los inputs reseteando el estado de servicioActual
                setServicioActual({
                    idServicio: '',
                    idVehiculo: '',
                    nombre: '',
                    fecha: '',
                    asignado: '',
                    descripcion: '',
                    costo: ''
                });
                cargarServicios();
    
                // Aquí también puedes gestionar el cambio de estado para salir del modo de edición
                setModoEdicion(false);
            })
            .catch(error => {
                console.error('Error al actualizar el servicio', error);
            });
    };
    return (
<div className="container mt-5">
<h2>Administración de Servicios</h2>
<div className="mb-3">
<input type="text" className="form-control" placeholder="Num Servicio" name="idServicio" value={servicioActual.idServicio} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Numero VIN" name="idVehiculo" value={servicioActual.idVehiculo} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Nombre" name="nombre" value={servicioActual.nombre} onChange={handleInputChange} />
<input type="date" className="form-control mt-2" placeholder="Fecha" name="fecha" value={servicioActual.fecha} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Asignado" name="asignado" value={servicioActual.asignado} onChange={handleInputChange} />
<textarea className="form-control mt-2" placeholder="Descripción" name="descripcion" value={servicioActual.descripcion} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Costo" name="costo" value={servicioActual.costo} onChange={handleInputChange} />
</div>
<div className="mb-3">
                {modoEdicion ? (
<button onClick={actualizarServicio} className="btn btn-warning">Actualizar</button>
                ) : (
<button onClick={agregarServicio} className="btn btn-primary">Agregar</button>
                )}
</div>
<table className="table">
<thead>
<tr>
<th>#</th>
<th>VIN</th>
<th>Nombre</th>
<th>Fecha</th>
<th>Asignado</th>
<th>Descripción</th>
<th>Costo</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
{servicios.map(servicio => (
<tr key={servicio.idServicio}>
<td>{servicio.idServicio}</td>
<td>{servicio.idVehiculo}</td>
<td>{servicio.nombre}</td>
<td>{servicio.fecha}</td>
<td>{servicio.asignado}</td>
<td>{servicio.descripcion}</td>
<td>{servicio.costo}</td>
<td>
<button onClick={() => editarServicio(servicio.idServicio)} className="btn btn-sm btn-outline-secondary">Editar</button>
<button onClick={() => eliminarServicio(servicio.idServicio)} className="btn btn-sm btn-outline-danger">Eliminar</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
    );
}
 
export default Servicios;