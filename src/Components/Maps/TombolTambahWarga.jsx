import React from 'react';
import { useNavigate } from 'react-router-dom';

// import "./tombolTambahWarga.css";
import Button from '@mui/material/Button';

const TombolTambahWarga = () => {
  const navigate = useNavigate();

  const handleWargaClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/tambah-warga');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="app-container">
      <div className="tombol-warga">
        <Button style={{textTransform: 'none'}} variant="contained" onClick={handleWargaClick}>
          Warga
        </Button>
      </div>
    </div>
  );
}

export default TombolTambahWarga;
