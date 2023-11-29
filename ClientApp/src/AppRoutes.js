
// AppRoutes.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from "./components/Login.js";
import CrudComponent from "./components/CrudComponent.js";
import NavBar from './NavBar.js';
import Servicios from "./components/Servicios.js";
import Refacciones from "./components/Refacciones.js";
import VistaServicioRefacciones from "./components/VistaServicioRefacciones.js";
import GraficasBarras from "./components/GraficasBarras.js";

const AppWrapper = () => {
  const location = useLocation();
 
  return (
<>
          {location.pathname !== "/" && <NavBar />}
<Routes>
<Route path="/" element={<Login />} />
<Route path="/registro-vehiculo" element={<CrudComponent />} />
<Route path="/servicios" element={<Servicios />} />
<Route path="/refacciones" element={<Refacciones />} />
<Route path="/serRef" element={<VistaServicioRefacciones />} />
<Route path="/graf" element={<GraficasBarras />} />
</Routes>

      </>
  );
}
const AppRoutes = () => {
  return (

<AppWrapper />

  );
}

export default AppRoutes; // Cambiado a exportar solo AppWrapper sin Router
