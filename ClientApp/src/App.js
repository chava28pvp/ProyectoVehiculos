// App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWrapper from './AppRoutes'; // Asegúrate de que la importación coincida con el nombre del archivo
import { Layout } from './components/Layout';
import './custom.css';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    
      <Layout>
        <AppRoutes />
      </Layout>
    
  );
}

