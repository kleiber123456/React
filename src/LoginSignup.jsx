import React, { useState } from 'react';
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import Paper from "@mui/material/Paper";
import LockIcon from "@mui/icons-material/Lock";
import Switch from "@mui/material/Switch";
import Login from "./formControl/login";
import Signup from "./formControl/signup";
import { Navigate } from 'react-router-dom'; // Para redirigir si no está autenticado

function LoginSignup({ setIsAuthenticated }) {
  const [checked, setChecked] = useState(true);
  const [isAuthenticated, setIsAuthenticatedState] = useState(false); // Estado de autenticación

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // Redirigir o mostrar contenido si está autenticado
  if (isAuthenticated) {
    return <Navigate to="/" />; // Redirige a la página de inicio
  }

  return (
    <center>
      <div className="LoginSignup">
        <Paper elevation={3} style={{ width: 500, padding: 10, paddingBottom: 20 }}>
          <div align="center">
            {checked ? (
              <Chip icon={<LockIcon />} label="Iniciar Sesión" variant="outlined" color="info" />
            ) : (
              <Chip icon={<FaceIcon />} label="Registrarse" variant="outlined" color="info" />
            )}
            <br />
            <Switch checked={checked} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} />
          </div>

          {checked ? (
            <Login setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Signup setIsAuthenticated={setIsAuthenticated} />
          )}
        </Paper>
      </div>
    </center>
  );
}

export default LoginSignup;
