import { React, useState, useEffect } from 'react';
import { Sidebar } from 'react-pro-sidebar';
import { X, MapPin } from 'lucide-react';
import './SideBar.css'
import { Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';


const SideBar = ({ isOpen, selectedMarkerData, surat, onClose, hapus }) => {
  const navigate = useNavigate();

  const handleTambahAnakClick = () => {
    const isAuthenticated = true;

    if (isAuthenticated) {
      navigate('/tambah-anak');
    } else {
      navigate('/');
    }
  };

  return (
    <Sidebar collapsed={!isOpen} style={{ width: '80vh' }}>
      {selectedMarkerData && (
        <div className='container' style={{ padding: 0, height: '100vh', position: 'relative' }}>
          <button onClick={onClose} style={{
            right: 10,
            marginTop: '5px',
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: '36px',
            display: 'flex',
            padding: '3px'
          }}><X />
          </button>
          <img
            src={selectedMarkerData.image_url_Home}
            alt={selectedMarkerData.name}
            style={{ display: 'block', margin: '0 auto', height: '300px' }}
          />
          <div className='header1'>
            {selectedMarkerData.name}
          </div>
          <div className='alamat'>
            <MapPin className='pin' />{selectedMarkerData.address[0]}
          </div>
          <hr />
          <div className='detail-container'>
            <span className='detail'>Details</span>
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Kepala Keluarga</span>
            </div>
            <div className='row2-kepala'>
              <span className='warga-name'>Nama: {selectedMarkerData.name}</span>
              <span className='nik'>NIK: {selectedMarkerData.nik[0]}</span>
              <span className='pekerjaan'>Pekerjaan: {selectedMarkerData.job}</span>
              <span className='ttl'>Tempat Tanggal Lahir: {selectedMarkerData.ttl}</span>
              <span className='last-edu'>Pendidikan Terakhir: {selectedMarkerData.lastEdu}</span>
              <a className='see-photo' href={selectedMarkerData.image_url_Diri} target='_blank'>
      Lihat Foto Diri
    </a>
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Istri</span>
            </div>
            <div>
              {selectedMarkerData.istri ? (
                selectedMarkerData.istri.map((istriName, index) => {
                  const startIdxIstri = 1; // Indeks mulai untuk NIK istri
                  const midAnakLength = selectedMarkerData.anak.length - 1;
                  const endIdxIstri = selectedMarkerData.nik.length - midAnakLength; // Indeks akhir untuk NIK istri

                  const nikIstri = selectedMarkerData.nik.slice(startIdxIstri, endIdxIstri)[index];
                  const alamatIstri = selectedMarkerData.address.slice(startIdxIstri, endIdxIstri)[index];


                  return (
                    <div key={index} className='warga-name-container'>
                      <span className='warga-name'>Nama: {istriName} </span>
                      <span className='nik-istri'>NIK: {nikIstri}</span>
                      <span className='alamat-istri'>
                        {alamatIstri === selectedMarkerData.address[0] ? "Alamat sama dengan Kepala Keluarga" : `Alamat: ${alamatIstri}`}
                      </span>
                      {index !== selectedMarkerData.istri.length - 1 && <br />} {/* Menambahkan <br> jika bukan istri terakhir */}
                    </div>
                  );
                })
              ) : (
                <span className='warga-name'>Belum ada data istri</span>
              )}
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Anak</span>
            </div>
            <div>
              {selectedMarkerData.anak ? (
                selectedMarkerData.anak.map((anakName, index) => {
                  const startIdxAnak = selectedMarkerData.istri.length+1; // Indeks mulai untuk NIK anak

                  const nikAnak = selectedMarkerData.nik.slice(startIdxAnak)[index]; // Mengambil NIK anak menggunakan slicing
                  const pekerjaanAnak = selectedMarkerData.statusAnak[index] || "Belum diketahui"; // Mendapatkan pekerjaan anak sesuai indeks atau default "Belum diketahui"
                  const alamatAnak = selectedMarkerData.address.slice(startIdxAnak)[index];

                  return (
                    <div key={index} className='warga-name-container'>
                      <span className='warga-name'>Nama: {anakName} </span>
                      <span className='nik-anak'>NIK: {nikAnak}</span>
                      <span className='pekerjaan-anak'>Status: {pekerjaanAnak}</span>
                      <span className='alamat-anak'>
                        {alamatAnak === selectedMarkerData.address[0] ? "Alamat sama dengan Kepala Keluarga" : `Alamat: ${alamatAnak}`}
                      </span>
                      {index !== selectedMarkerData.anak.length - 1 && <br />}
                    </div>
                  );
                })
              ) : (
                <span className='warga-name'>Belum ada data anak</span>
              )}
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Informasi Keluarga</span>
            </div>
            <div className='row2-keluarga'>
              <span className='warga-name'>No. PBB: {selectedMarkerData.pbb}</span>
              <span className='nik'>No. BPJS: {selectedMarkerData.bpjs}</span>
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Data Kendaraan</span>
            </div>
            <div>
              {selectedMarkerData.platNomor ? (
                <div className='warga-name-container'>
                  <span className='warga-name'>Jumlah Kendaraan: {selectedMarkerData.platNomor.length}</span>
                  <span className='nik-anak'>
                    {selectedMarkerData.platNomor.map((plat, index) => (
                      <div key={index}>
                        Plat Nomor {index + 1}: {plat}
                      </div>
                    ))}
                  </span>
                </div>
              ) : (
                <span className='warga-name'>Belum ada data kendaraan</span>
              )}
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Riwayat Surat</span>
            </div>
            <div>
              {surat && surat[selectedMarkerData.name] && surat[selectedMarkerData.name].fileNames.length > 0 ? (
                surat[selectedMarkerData.name].fileNames.map((fileName, index) => (
                  <div key={index} className='warga-name-container'>
                    <span className='warga-name'>{fileName}</span>
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada data surat</span>
              )}
            </div>
            <hr className='container-line' />
          </div>
          
          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Keterangan</span>
            </div>
            <div>
              {selectedMarkerData.comment ? (
                selectedMarkerData.comment.map((ket, index) => {

                  return (
                    <div key={index} className='warga-name-container'>
                      <span className='warga-name'>{ket} </span>
                      {index !== selectedMarkerData.comment.length - 1 && <br />}
                    </div>
                  );
                })
              ) : (
                <span className='warga-name'>Belum ada data keterangan</span>
              )}
            </div>
            <hr className='container-line' />
          </div>
          
          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Foto Rumah</span>
            </div>
            <div className='row2-keluarga'>
              <span className='warga-name'>Tampak Depan: <img
                      src={selectedMarkerData.image_url_Home}
                      alt={`Tampak Depan`}
                      style={{ display: 'block', margin: '0 auto', height: '300px', marginTop: 10 }}
                    /></span>
              <span className='nik'>Tampak Samping: <img
                      src={selectedMarkerData.image_url_Home2}
                      alt={`Tampak Samping`}
                      style={{ display: 'block', margin: '0 auto', height: '300px', marginTop: 10 }}
                    /></span>
            </div>
            <hr className='container-line' />
          </div>
          
          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Foto KK</span>
            </div>
            <div>
              {Array.isArray(selectedMarkerData.statusKTP) ? (
                selectedMarkerData.statusKTP.map((ktp, index) => (
                  <div key={index} className='warga-name-container'>
                    {ktp}
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada foto KK</span>
              )}
            </div>
            <hr className='container-line' />
          </div>

          <div className='container-isi'>
            <div className='row1'>
              <span className='nama'>Foto KTP</span>
            </div>
            <div>
              {Array.isArray(selectedMarkerData.statusKK) ? (
                selectedMarkerData.statusKK.map((kk, index) => (
                  <div key={index} className='warga-name-container'>
                    {kk}
                  </div>
                ))
              ) : (
                <span className='warga-name'>Belum ada foto KTP</span>
              )}
            </div>
            <hr className='container-line' />
          </div>
          {/* <Button
            style={{ width: 'calc(100% - 20px)', margin: '5px 5px 5px 10px', textAlign: 'center', textTransform: 'none' }}
            className='update'
            variant="outlined"
            color='primary'
            onClick={handleTambahAnakClick}
          >
            Tambah Anak
          </Button> */}

          <Button style={{ width: 'calc(100% - 20px)', margin: '5px 5px 5px 10px', textAlign: 'center', textTransform: 'none' }} className='delete' variant="contained" color='error' onClick={() => { hapus(selectedMarkerData.name); onClose(); }}>Hapus</Button>
        </div>
      )}

    </Sidebar>
  );
};

export default SideBar;