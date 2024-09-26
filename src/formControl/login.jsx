import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

export default function Login({ setIsAuthenticated }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [formValid, setFormValid] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); 

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    setSuccess("");
    setFormValid("");

    if (!emailInput || !passwordInput) {
      setFormValid("Por favor ingresa todos los campos.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Login");
      const users = response.data;

      // Asegúrate de que users sea un array
      if (!Array.isArray(users)) {
        setFormValid("Error en la respuesta del servidor.");
        return;
      }

      const user = users.find(
        (u) => u.email === emailInput && u.password === passwordInput
      );

      if (user) {
        setSuccess("Login exitoso!");
        setIsAuthenticated(true);
        navigate("/"); // Redirigir a home después de iniciar sesión
      } else {
        setFormValid("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setFormValid("Error durante el login. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <TextField
        label="Email"
        variant="standard"
        value={emailInput}
        onChange={(event) => setEmailInput(event.target.value)}
      />
      <FormControl>
        <InputLabel>Contraseña</InputLabel>
        <Input
          type={showPassword ? "text" : "password"}
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button onClick={handleSubmit} variant="contained" startIcon={<LoginIcon />}>
        Iniciar Sesión
      </Button>
      {formValid && <Alert severity="error">{formValid}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
    </div>
  );
}
