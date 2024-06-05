import React from "react";
import { useNavigate } from "react-router-dom";

// import "./tombolTambahWarga.css";
import Button from "@mui/material/Button";

const TombolTambahWarga = () => {
  const navigate = useNavigate();

  const handleWargaClick = () => {
    const isAuthenticated = true;

    if (isAuthenticated) {
      navigate("/tambah-warga");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="app-container">
      <div className="tombol-warga">
        <Button
          style={{
            textTransform: "none",
            color: "blue", // Warna teks (opsional)
            borderColor: "blue", // Warna pinggiran
            backgroundColor: "white", // Warna latar belakang
          }}
          variant="outlined" // Menggunakan outlined button
          onClick={handleWargaClick}
        >
          Warga
        </Button>
      </div>
    </div>
  );
};

export default TombolTambahWarga;
