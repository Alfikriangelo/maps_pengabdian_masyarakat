// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from './authGuard';
import Login from './Pages/Login';
import Maps from './Pages/Maps';
import { AuthProvider } from './authContext'; 
import Surat from './Pages/Surat';
import TambahWarga from './Pages/TambahWarga';
import TambahAnak from './Pages/TambahAnak';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/maps" element={<AuthGuard element={<Maps />} />} />
          <Route path="/surat" element={<AuthGuard element={<Surat />} />}  />
          <Route path="/tambah-warga" element={<AuthGuard element={<TambahWarga />} />}  />
          <Route path="/tambah-anak" element={<AuthGuard element={<TambahAnak />} />}  />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
