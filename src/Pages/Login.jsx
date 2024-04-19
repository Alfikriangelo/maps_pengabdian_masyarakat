// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import Button from "@mui/material/Button";
import "./Login.css";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import gov from "../icons/govern.png";

const Login = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Login berhasil", userData);
        setError(null);
        login();
        navigate("/maps");
      } else {
        console.error("Login gagal");
        const errorData = await response.json();
        setError(
          errorData.error ||
            "Login gagal. Periksa kembali nama pengguna dan kata sandi."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong during login.");
    }
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          container
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${gov})`, // Gunakan backtick (`) untuk string literal
            backgroundColor: "#3874cc",
            backgroundSize: "50%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* <Typography
            variant="h4"
            sx={{
              position: "absolute", // Atur posisi ke absolute agar tulisan dapat diposisikan di atas gambar
              marginTop: "30%", // Atur tinggi tulisa
              left: "29%", // Tempatkan tulisan di tengah
              transform: "translateX(-50%)", // Pusatkan tulisan secara horizontal
              color: "white", // Atur warna tulisan
            }}
          >
            Data Kependudukan Desa
          </Typography> */}
        </Grid>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              height: "80vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sistem Informasi RT 05 / RW 24
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="email"
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleLogin}
                sx={{ mt: 3, mb: 2 }}
              >
                MASUK
              </Button>
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
