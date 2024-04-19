import React, { useState, useRef, useEffect } from 'react';
import Isi from '../Components/Surat/Isi';
import Pembuka from '../Components/Surat/Pembuka';
import Header from '../Components/Surat/Header';
import Judul from '../Components/Surat/Judul';
import Penutup from '../Components/Surat/Penutup';
import { TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import SignatureCanvas from 'react-signature-canvas';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import './Surat.css'; // Importing CSS


const Surat = () => {
  const navigate = useNavigate();
  const [showInvoice, setShowInvoice] = useState(false);
  const [nomorSurat, setNomorSurat] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedData, setSelectedData] = useState({
    ttl: '',
    pekerjaan: '',
    pendidikanTerakhir: '',
    blok: '',
    noRumah: '',
    tanggal: [dayjs(), dayjs()],
  });
  const [keteranganSurat, setKeteranganSurat] = useState('');
  const [data, setData] = useState([]);

  const componentRef = useRef();
  const signatureRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const handleDownload = () => {
    const content = componentRef.current;
    const pdfConfig = {
      margin: 5,
      padding: 10,
    };

    const fileName = 'surat_${nomorSurat}_${selectedName}.pdf';

    // Kirim file name dan "nama" ke backend
    fetch('http://127.0.0.1:5000/save_file_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nama: selectedName, fileName }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Setelah mengirim file name dan "nama" ke backend, generate dan unduh PDF
        html2pdf().from(content).set(pdfConfig).save(fileName);
      })
      .catch((error) => {
        console.error('Error sending file name and "nama" to the backend:', error);
      });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios.get('http://127.0.0.1:5000/get_saved_data');
        setData(responseData.data.savedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleNameChange = (event, newValue) => {
    const selectedPerson = data.find((item) => item.name === newValue);
    setSelectedName(newValue);
    setSelectedData({
      ttl: selectedPerson?.ttl || '',
      pekerjaan: selectedPerson?.job || '',
      pendidikanTerakhir: selectedPerson?.lastEdu || '',
      blok: selectedPerson?.blok || '',
      noRumah: selectedPerson?.no || '',
      tanggal: selectedPerson?.tanggal || [dayjs(), dayjs()],
    });
  };

  return (
    <>
      
      <div style={{ marginTop: '-80px' }}>

      <main className='main-container'>
        {showInvoice ? (
          <>
          <div className='button-top'>
    <Button onClick={() => navigate('/maps')} style={{ textTransform: 'none' }}>
      Kembali
    </Button>
    <Button variant='outlined' onClick={handleDownload} style={{ textTransform: 'none'}}>
      Download
    </Button>
  </div>
  <div ref={componentRef} className='p-5'>
    <Header handlePrint={handlePrint} />
    <Judul nomorSurat={nomorSurat} />
    <Pembuka />
    <Isi
      nama={selectedName}
      ttl={selectedData.ttl}
      pekerjaan={selectedData.pekerjaan}
      pendidikanTerakhir={selectedData.pendidikanTerakhir}
      blok={selectedData.blok}
      noRumah={selectedData.noRumah}
      keteranganSurat={keteranganSurat}
      tanggal={selectedData.tanggal}
    />
    <Penutup />
    <p className='text-right mt-10 mr-2'>Ketua Rukun Tetangga 05</p>
    <div className='text-right mt-10'>
      <SignatureCanvas
        ref={signatureRef}
        canvasProps={{ width: 400, height: 200, className: 'signature-canvas' }}
      />
    </div>
  </div>
  <div className='button-bottom'>
    <Button className='red-button' onClick={clearSignature}>
      Hapus
    </Button>
    <Button onClick={() => setShowInvoice(false)} className='blue-button'>
      Edit
    </Button>
    </div>
          </>
        ) : (
          <>
            
            <p className='font-bold text-3xl mb-3 text-left margin-top 30px' style={{marginTop: '30px', marginRight : '30px'}} >Layanan Surat</p>

            <div className='flex flex-col justify-center'>
              <label htmlFor='nomorSurat' className='mb-2'>
                Nomor Surat
              </label>
              <TextField
                type='text'
                name='text'
                id='nomorSurat'
                placeholder=''
                autoComplete='off'
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
              />
              <label htmlFor='namaWarga' className='mb-2 mt-2'>
                Nama Warga
              </label>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={data.map((item) => item.name)}
                value={selectedName}
                onChange={handleNameChange}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label='Nama Warga' />}
              />
              <label htmlFor='ttl' className='mb-2 mt-2'>
                Tempat / Tanggal Lahir
              </label>
              <TextField
                type='text'
                name='text'
                id='ttl'
                placeholder=''
                autoComplete='off'
                value={selectedData.ttl}
                onChange={(e) => setSelectedData({ ...selectedData, ttl: e.target.value })}
              />
              <label htmlFor='pekerjaan' className='mb-2 mt-2'>
                Pekerjaan
              </label>
              <TextField
                type='text'
                name='text'
                id='pekerjaan'
                placeholder=''
                autoComplete='off'
                value={selectedData.pekerjaan}
                onChange={(e) => setSelectedData({ ...selectedData, pekerjaan: e.target.value })}
              />
              <label htmlFor='pendidikanTerakhir' className='mb-2 mt-2'>
                Pendidikan Terakhir
              </label>
              <TextField
                type='text'
                name='text'
                id='pendidikanTerakhir'
                placeholder=''
                autoComplete='off'
                value={selectedData.pendidikanTerakhir}
                onChange={(e) =>
                  setSelectedData({ ...selectedData, pendidikanTerakhir: e.target.value })
                }
              />
              <label htmlFor='Blok' className='mb-2 mt-2'>
                Blok
              </label>
              <TextField
                type='text'
                name='text'
                id='blok'
                placeholder=''
                autoComplete='off'
                value={selectedData.blok}
                onChange={(e) => setSelectedData({ ...selectedData, blok: e.target.value })}
              />
              <label htmlFor='noRumah' className='mb-2 mt-2'>
                Nomor Rumah
              </label>
              <TextField
                type='text'
                name='text'
                id='noRumah'
                placeholder=''
                autoComplete='off'
                value={selectedData.noRumah}
                onChange={(e) => setSelectedData({ ...selectedData, noRumah: e.target.value })}
              />
              <label htmlFor='notes' className='mb-2 mt-2'>
                Isi Surat
              </label>
              <textarea
                className='mt-2 mb-2'
                name='keterangan'
                id='notes'
                cols='20'
                rows='10'
                placeholder='Beri Keterangan Surat Secara Singkat'
                value={keteranganSurat}
                onChange={(e) => setKeteranganSurat(e.target.value)}></textarea>
              <div className='mt-5 mb-5'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateRangePicker']}>
                    <DateRangePicker
                      localeText={{ start: 'Dari', end: 'Sampai' }}
                      value={selectedData.tanggal}
                      onChange={(date) => setSelectedData({ ...selectedData, tanggal: date })}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
              <div className='flex' style={{ justifyContent: 'space-between', marginTop : '30px'}}>
                <Button variant='outlined' onClick={() => navigate('/maps')}>
                  Kembali
                </Button>
                <Button variant='contained' onClick={() => setShowInvoice(true)}>
                  Kirim
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
      </div>
    </>
  );
};

export default Surat;