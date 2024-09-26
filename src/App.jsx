import React, { useState } from 'react';
import { Container } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import LoginSignup from './LoginSignup';
import Navbar from './Navbar';
import Productos_Servicios from './Productos_Servicio';
import Clientes from './Clientes';
import Dashboard from './components/Dashboard';
import Proveedores from './Proveedores';
import Compras from './Compras';
import Ventas from './Ventas';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import Person4Icon from '@mui/icons-material/Person4';
import DashboardIcon from '@mui/icons-material/Dashboard';


const App = () => {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navegationLinks = [
    { title: "Home", path: "/", icon: <InboxIcon />, element: <Home /> },
    { title: "Dashboard", path: "/dashboard",icon: <DashboardIcon />, element: <Dashboard /> },
    { title: "Clientes", path: "/clientes",icon: <Person4Icon />, element: <Clientes /> },
    { title: "Productos_Servicios", path: "/productos_servicios", icon: <ProductionQuantityLimitsIcon />, element: <Productos_Servicios /> },
    { title: "Proveedores", path: "/proveedores",icon: <PrecisionManufacturingIcon />, element: <Proveedores /> },
    { title: "Compras", path: "/compras",icon: <PrecisionManufacturingIcon />, element: <Compras /> },
    { title: "Ventas", path: "/ventas",icon: <Person4Icon />, element: <Ventas /> },
  ];

  return (
    <div className={`contenedor ${theme}`}>
      {/* Solo muestra el navbar si el usuario está autenticado */}
      {isAuthenticated && (
        <Navbar theme={theme} setTheme={setTheme} navegationLinks={navegationLinks} />
      )}
      
      <Container sx={{ mt: 5 }}>
        <Routes>
          {/* Ruta para inicio de sesión */}
          <Route path="/login" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
          
          {/* Mostrar solo el Home al principio si no está autenticado */}
          <Route path="/" element={<Home />} />

          {/* Si el usuario está autenticado, mostrar los demás módulos */}
          {isAuthenticated ? (
            navegationLinks.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))
          ) : (
            // Redirige a la página de inicio si no está autenticado
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Container>
    </div>
  );
};

export default App;