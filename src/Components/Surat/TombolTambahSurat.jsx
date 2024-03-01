import React from 'react';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "./tombolTambahSurat.css";
import Button from '@mui/material/Button';

const TombolTambahSurat = () => {
  const navigate = useNavigate();

  const handleSuratClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/surat');
    } else {
      navigate('/');
    }
  };

  return (
    <div className='tombol-surat'>
      <Button style={{textTransform: 'none'}} variant='contained' onClick={handleSuratClick}>
        Surat
      </Button>
    </div>
  );
}

export default TombolTambahSurat;
