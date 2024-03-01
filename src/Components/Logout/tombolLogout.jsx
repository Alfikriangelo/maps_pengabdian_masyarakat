import React from 'react';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import "./tombolLogout.css";
import Button from '@mui/material/Button';

const TombolLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    const isAuthenticated = true; 

    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/maps');
    }
  };

  return (
      <div className="tombol-logout">
        <Button style={{textTransform: 'none'}} variant="contained" color='error' onClick={handleLogoutClick}>
          Logout
        </Button> 
    </div>
  );
}

export default TombolLogout;
