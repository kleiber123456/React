import React, { useState } from "react";
import axios from "axios";

// Material UI Imports
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
  Stack,
} from "@mui/material";

// Material UI Icon Imports
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

// Validations
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email); // Validación simple para correo electrónico

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // Inputs
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Inputs Errors
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Overall Form Validity
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();

  // Handles Display and Hide Password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Validation for onBlur Email
  const handleEmail = () => {
    if (!isValidEmail(emailInput)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
  };

  // Validation for onBlur Password
  const handlePassword = () => {
    if (!passwordInput || passwordInput.length < 5 || passwordInput.length > 20) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    setSuccess(null);

    if (emailError || !emailInput) {
      setFormValid("Email is invalid. Please re-enter.");
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid("Password is Invalid. Please Re-Enter");
      return;
    }
    setFormValid(null);

    // Limpiamos las entradas para evitar espacios en blanco
    const cleanedEmail = emailInput.trim().toLowerCase();
    const cleanedPassword = passwordInput.trim();

    // Request to API
    try {
      const response = await axios.get("https://apigym-a0zk.onrender.com/api/login");
      console.log("Full response:", response);
      const users = response.data;

      // Comprobación si existe el usuario y la contraseña
      const user = users.find(
        (u) => u.email === cleanedEmail && u.password === cleanedPassword
      );

      if (user) {
        setSuccess("Login successful!");
        // Aquí puedes agregar el redireccionamiento o lo que necesites hacer después del login.
      } else {
        setFormValid("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setFormValid("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <TextField
          error={emailError}
          label="Email"
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          value={emailInput}
          onChange={(event) => setEmailInput(event.target.value)}
          onBlur={handleEmail}
        />
      </div>

      <div style={{ marginTop: "5px" }}>
        <FormControl sx={{ width: "100%" }} variant="standard">
          <InputLabel error={passwordError}>Password</InputLabel>
          <Input
            error={passwordError}
            onBlur={handlePassword}
            type={showPassword ? "text" : "password"}
            onChange={(event) => setPasswordInput(event.target.value)}
            value={passwordInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>

      <div style={{ marginTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={handleSubmit}
        >
          LOGIN
        </Button>
      </div>

      {formValid && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="error" size="small">
            {formValid}
          </Alert>
        </Stack>
      )}

      {success && (
        <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
          <Alert severity="success" size="small">
            {success}
          </Alert>
        </Stack>
      )}
    </div>
  );
}
 