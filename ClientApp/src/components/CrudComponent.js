import { useEffect, useState } from "react";
import React from "react";
import axios from 'axios';


//CrudComponent
    const CrudComponent = () => {
        const [vehiculos, setVehiculos] = useState([]);
        const [vehiculoActual, setVehiculoActual] = useState({ idVehiculos: '', Marca: '', Modelo: '', Anio: '', Kilometraje: '', idCliente: '' });
        const [modoEdicion, setModoEdicion] = useState(false);
    
    
        const handleInputChange = (e) => {
            
            setVehiculoActual({ ...vehiculoActual, [e.target.name]: e.target.value });
        };
    const cargarVehiculos = () => {
        axios.get('http://localhost:44471/weatherforecast/GetVehiculos')
            .then(response => {
                setVehiculos(response.data); // Actualiza el estado con los datos recibidos
            })
            .catch(error => {
                console.error('Error al cargar los vehículos', error);
            });
    };

    // Llamada a la API cuando el componente se monta
    useEffect(() => {
        cargarVehiculos();
    }, []); 
 
    const agregarVehiculo = () => {
        const url = 'http://localhost:44471/weatherforecast/AddVehiculo'; // Adjust this URL as needed
        axios.post(url, {
            idVehiculos: parseInt(vehiculoActual.idVehiculos), // Make sure this is a number
            Marca: vehiculoActual.Marca,
            Modelo: vehiculoActual.Modelo,
            Anio: vehiculoActual.Anio, // Make sure this is a number
            Kilometraje: vehiculoActual.Kilometraje, // Make sure this is a number
            idCliente: vehiculoActual.idCliente, // Send null if empty
        },
        {
            headers: {
                'Content-Type': 'application/json' // This line is important!
            }
        })
        
        .then(response => {
            // Supongamos que la API devuelve el vehículo recién creado en la respuesta
            setVehiculos([...vehiculos, response.data]);
            // Resetea el estado de vehiculoActual para limpiar el formulario
            setVehiculoActual({ idVehiculos: '', Marca: '', Modelo: '', Anio: '', Kilometraje: '', idCliente: '' });
            console.log('Vehículo agregado con éxito', response.data);
            cargarVehiculos();
        })
        
        .catch(error => {
            // handle error
            console.error('Error al agregar el vehículo', error);
        });
    };
 
    const eliminarVehiculo = (id) => {
        const url = `http://localhost:44471/weatherforecast/DeleteVehiculo/${id}`;
        axios.delete(url)
        .then(response => {
            // Elimina el vehículo del estado vehiculos
            setVehiculos(vehiculos.filter(vehiculo => vehiculo.idVehiculos !== id));
        })
        .catch(error => {
            console.error('Error al eliminar el vehículo', error);
        });
    };
 
    const editarVehiculo = (id) => {
        const vehiculoAEditar = vehiculos.find(vehiculo => vehiculo.idVehiculos === id);
        if (vehiculoAEditar) {
            setVehiculoActual({
                idVehiculos: vehiculoAEditar.idVehiculos || '',
                Marca: vehiculoAEditar.marca || '', // Cambiado a minúscula
                Modelo: vehiculoAEditar.modelo || '', // Cambiado a minúscula
                Anio: vehiculoAEditar.anio || '', // Cambiado a minúscula
                Kilometraje: vehiculoAEditar.kilometraje || '', // Cambiado a minúscula
                idCliente: vehiculoAEditar.idCliente || ''
            });
            setModoEdicion(true);
        } else {
            console.log(`No se encontró el vehículo con ID: ${id}`);
            setVehiculoActual({ idVehiculos: '', Marca: '', Modelo: '', Anio: '', Kilometraje: '', idCliente: '' });
        }
    };
    const actualizarVehiculo = () => {
        const url = `http://localhost:44471/weatherforecast/UpdateVehiculo/${vehiculoActual.idVehiculos}`;
        axios.put(url, vehiculoActual, {
            headers: {
                'Content-Type': 'application/json'
            }
            
        })
        .then(response => {
            // Actualiza la lista de vehículos con el vehículo actualizado
            setVehiculos(vehiculos.map(vehiculo => (vehiculo.idVehiculos === vehiculoActual.idVehiculos ? vehiculoActual : vehiculo)));
            setModoEdicion(false);
            setVehiculoActual({ idVehiculos: '', Marca: '', Modelo: '', Anio: '', Kilometraje: '', idCliente: '' });
            cargarVehiculos();
        })
        .catch(error => {
            console.error('Error al actualizar el vehículo', error);
        });
    };

    
    return (
<div className="container mt-5">
<h2>Administración de Vehículos</h2>
<div className="mb-3">
<input type="text" className="form-control" placeholder="Numero VIN" name="idVehiculos" value={vehiculoActual.idVehiculos} onChange={handleInputChange} />
<select className="form-control mt-2" name="Marca" value={vehiculoActual.Marca} onChange={handleInputChange}>
<option value="">Seleccione una Marca</option>
<option value="Toyota">Toyota</option>
<option value="Ford">Ford</option>
<option value="Chevrolet">Chevrolet</option>
<option value="Honda">Honda</option>
<option value="Nissan">Nissan</option>
<option value="BMW">BMW</option>
<option value="Mercedes-Benz">Mercedes-Benz</option>
<option value="Volkswagen">Volkswagen</option>
<option value="Hyundai">Hyundai</option>
<option value="Audi">Audi</option>
</select>
<input type="text" className="form-control mt-2" placeholder="Línea" name="Modelo" value={vehiculoActual.Modelo} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Modelo" name="Anio" value={vehiculoActual.Anio} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Kilometraje" name="Kilometraje" value={vehiculoActual.Kilometraje} onChange={handleInputChange} />
<input type="text" className="form-control mt-2" placeholder="Número de Cliente" name="idCliente" value={vehiculoActual.idCliente} onChange={handleInputChange} />
</div>
<div className="mb-3">
                {modoEdicion ? (
<button onClick={actualizarVehiculo} className="btn btn-warning">Actualizar</button>
                ) : (
<button onClick={agregarVehiculo} className="btn btn-primary">Insertar</button>
                )}
</div>
<table className="table">
<thead>
<tr>
<th>#</th>
<th>Marca</th>
<th>Línea</th>
<th>Modelo</th>
<th>Kilometraje</th>
<th>Cliente</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
{vehiculos.map((vehiculo) => (
    <tr key={vehiculo.idVehiculos}>
      <td>{vehiculo.idVehiculos}</td>
      <td>{vehiculo.marca}</td>
      <td>{vehiculo.modelo}</td>
      <td>{vehiculo.anio}</td>
      <td>{vehiculo.kilometraje}</td>
      <td>{vehiculo.idCliente}</td>
      <td>
      <button onClick={() => editarVehiculo(vehiculo.idVehiculos)} className="btn btn-sm btn-outline-secondary">Editar</button>
        <button onClick={() => eliminarVehiculo(vehiculo.idVehiculos)} className="btn btn-sm btn-outline-danger">Eliminar</button>
      </td>
    </tr>
  ))}
</tbody>
</table>
</div>
    );
}
 
export default CrudComponent;
