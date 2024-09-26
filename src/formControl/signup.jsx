import React, { useState } from "react";
import axios from "axios"; // Asegúrate de tener axios instalado

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
const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);

  // Inputs
  const [usernameInput, setUsernameInput] = useState(""); // Inicializa con cadena vacía
  const [emailInput, setEmailInput] = useState(""); // Inicializa con cadena vacía
  const [passwordInput, setPasswordInput] = useState(""); // Inicializa con cadena vacía

  // Inputs Errors
  const [usernameError, setUsernameError] = useState(false);
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

  // Validation for onBlur Username
  const handleUsername = () => {
    if (!usernameInput) {
      setUsernameError(true);
      return;
    }
    setUsernameError(false);
  };

  // Validation for onBlur Email
  const handleEmail = () => {
    if (!isEmail(emailInput)) {
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

    // Validation checks
    if (usernameError || !usernameInput) {
      setFormValid("Username is invalid. Please re-enter.");
      return;
    }

    if (emailError || !emailInput) {
      setFormValid("Email is Invalid. Please Re-Enter");
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid("Password is Invalid. Please Re-Enter");
      return;
    }
    setFormValid(null);

    // Request to API
    try {
      const response = await axios.post("http://localhost:3000/api/Login", {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      });

      console.log(response.data);
      setSuccess("Login successful!");
    } catch (error) {
      console.error("Error during login:", error);
      setFormValid("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <TextField
          error={usernameError}
          label="Username"
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          value={usernameInput}
          onChange={(event) => setUsernameInput(event.target.value)}
          onBlur={handleUsername}
        />
      </div>

      <div style={{ marginTop: "5px" }}>
        <TextField
          label="Email Address"
          fullWidth
          error={emailError}
          variant="standard"
          sx={{ width: "100%" }}
          size="small"
          value={emailInput}
          onBlur={handleEmail}
          onChange={(event) => setEmailInput(event.target.value)}
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
          Registrarse
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

