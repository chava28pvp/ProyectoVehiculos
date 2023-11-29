import React, { useState, useEffect } from "react";
import axios from "axios";

const Refacciones = () => {
  const [refacciones, setRefacciones] = useState([]);
  const [refaccionActual, setRefaccionActual] = useState({
    idRefacciones: '',
    nombre: '',
    descripcion: '',
    costo: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    cargarRefacciones();
  }, []);
  const cargarRefacciones = () => {
    axios
      .get("http://localhost:44471/weatherforecast/GetRefacciones")
      .then((response) => {
        setRefacciones(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las refacciones", error);
      });
  };
  const handleInputChange = (e) => {
    setRefaccionActual({ ...refaccionActual, [e.target.name]: e.target.value });
  };

  const agregarRefaccion = () => {
    axios
      .post("http://localhost:44471/weatherforecast/AddRefaccion", {
        idRefacciones: refaccionActual.idRefacciones, // Asegúrate de que estos campos coincidan con tu modelo en el backend
        Nombre: refaccionActual.nombre,
        Descripcion: refaccionActual.descripcion,
        Costo: refaccionActual.costo,
      })
      .then((response) => {
        setRefacciones([...refacciones, response.data]);
        setRefaccionActual({
          idRefacciones: '',
          nombre: '',
          descripcion: '',
          costo: '',
        });
        cargarRefacciones();
        
      })
      .catch((error) => {
        console.error("Error al agregar la refacción", error);
      });
  };
  const eliminarRefaccion = (id) => {
    axios
      .delete(`http://localhost:44471/weatherforecast/DeleteRefaccion/${id}`)
      .then((response) => {
        setRefacciones(
          refacciones.filter((refaccion) => refaccion.idRefacciones !== id)
        );
      })
      .catch((error) => {
        console.error("Error al eliminar la refacción", error);
      });
  };

  const editarRefaccion = (id) => {
    const refaccionAEditar = refacciones.find(
      refaccion => refaccion.idRefacciones === id
    );
    setRefaccionActual(refaccionAEditar);
    setModoEdicion(true);
  };

  const actualizarRefaccion = () => {
    const url = `http://localhost:44471/weatherforecast/UpdateRefaccion/${refaccionActual.idRefacciones}`;
    axios.put(url, refaccionActual)
            .then(response => {
              
                setRefaccionActual({
                    idRefacciones: '',
          nombre: '',
          descripcion: '',
          costo: '',
                });
                cargarRefacciones();
                 // Aquí también puedes gestionar el cambio de estado para salir del modo de edición
                 setModoEdicion(false);
                })
                .catch(error => {
                    console.error('Error al actualizar la refaccion', error);
                });
  };

  // Asumiendo que tienes 20 tipos de nombres y descripciones de refacciones
  const nombre = [
    "Filtro de Aceite",
    "Bujías",
    "Frenos",
    "Amortiguadores",
    "Llantas",
    "Batería",
    "Radiador",
    "Correa de Distribución",
    "Alternador",
    "Bomba de Agua",
    "Filtro de Aire",
    "Pastillas de Freno",
    "Discos de Freno",
    "Embrague",
    "Faros",
    "Espejos Laterales",
    "Limpiaparabrisas",
    "Escape",
    "Inyectores",
    "Aceite de Motor",
  ];

  const Refacciones = [
    "Filtro para purificar el aceite del motor",
    "Bujías para el encendido del motor",
    "Sistema de frenos para detener el vehículo",
    "Amortiguadores para la suspensión",
    "Llantas para tracción y manejo",
    "Batería para el sistema eléctrico",
    "Radiador para enfriar el motor",
    "Correa para sincronizar el motor",
    "Alternador para cargar la batería",
    "Bomba para el sistema de enfriamiento",
    "Filtro para el aire del motor",
    "Pastillas para el sistema de frenos",
    "Discos para el sistema de frenos",
    "Embrague para la transmisión",
    "Faros para la iluminación",
    "Espejos para la visibilidad",
    "Limpiaparabrisas para la visibilidad en lluvia",
    "Sistema de escape para los gases del motor",
    "Inyectores para el combustible",
    "Aceite para lubricar el motor",
  ];

  return (
    <div className="container mt-5">
      <h2>Administración de Refacciones</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="ID Refacción"
          name="idRefacciones"
          value={refaccionActual.idRefacciones}
          onChange={handleInputChange}
        />
        <select
          className="form-control mt-2"
          name="nombre"
          value={refaccionActual.nombre}
          onChange={handleInputChange}
        >
          <option value="">Seleccione un Nombre</option>
          {nombre.map((nombreItem, index) => (
            <option key={index} value={nombreItem}>
              {nombreItem}
            </option>
          ))}
        </select>
        <select
          className="form-control mt-2"
          name="descripcion"
          value={refaccionActual.descripcion}
          onChange={handleInputChange}
        >
          <option value="">Seleccione una Descripción</option>
          {Refacciones.map((descripcionItem, index) => (
            <option key={index} value={descripcionItem}>
              {descripcionItem}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Costo"
          name="costo"
          value={refaccionActual.costo}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        {modoEdicion ? (
          <button onClick={actualizarRefaccion} className="btn btn-warning">
            Actualizar
          </button>
        ) : (
          <button onClick={agregarRefaccion} className="btn btn-primary">
            Agregar
          </button>
        )}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID Refacción</th>
            <th>Nombre de la Refacción</th>
            <th>Descripción</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {refacciones.map((refaccion) => (
            <tr key={refaccion.idRefacciones}>
              <td>{refaccion.idRefacciones}</td>
              <td>{refaccion.nombre}</td>
              <td>{refaccion.descripcion}</td>
              <td>{refaccion.costo}</td>
              <td>
                <button
                  onClick={() => editarRefaccion(refaccion.idRefacciones)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarRefaccion(refaccion.idRefacciones)}
                  className="btn btn-sm btn-outline-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Refacciones;
