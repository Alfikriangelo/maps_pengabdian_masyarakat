import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TambahAnak() {
  const [formData, setFormData] = useState({
    anak: '',
    nik: '',
    ttl: ''
  });

  // State untuk menyimpan data yang diambil dari backend
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    // Ambil data awal dari backend saat komponen dimuat
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get_saved_data');
      setSavedData(response.data.savedData);  // Simpan seluruh data dari backend
      setFormData(response.data.savedData[0]);  // Ambil data pertama dari array savedData
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kirim data ke backend dengan metode PUT
    try {
      const response = await fetch('http://localhost:5000/update_data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data saved successfully');
        // Handle kesuksesan, misalnya redirect atau tindakan lainnya

        // Optional: Refresh data setelah penyimpanan berhasil
        fetchData();
      } else {
        console.error('Failed to save data');
        // Handle kegagalan, misalnya menampilkan pesan kesalahan kepada pengguna
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div>
      <h1>Form Tambah Anak</h1>
      <label>
        Anak:
        <input type="text" name="anak" value={formData.anak} onChange={handleChange} />
      </label>
      <br />
      <label>
        NIK:
        <input type="text" name="nik" value={formData.nik} onChange={handleChange} />
      </label>
      <br />
      <label>
        TTL:
        <input type="text" name="ttl" value={formData.ttl} onChange={handleChange} />
      </label>
      <br />
      <button onClick={handleSubmit}>Tambah Anak</button>
    </div>
  );
}

export default TambahAnak;
