import React from 'react'

const Isi = ({nama, ttl, pekerjaan, pendidikanTerakhir, blok, noRumah, keteranganSurat, tanggal}) => {
  const startDate = tanggal[0];


  const startDay = startDate.date();
 
  const kewarganegaraan = "Indonesia"

  return (
    <>
      <div className="flex">
        <div className="flex-1 p-4" style={{ textAlign: 'left' }}>
          {/* Isi kolom pertama */}
          <p>Nama</p>
          <p>Tempat / Tanggal Lahir</p>
          <p>Pekerjaan</p>
          <p>Kewarganegaraan</p>
          <p>Pendidikan Terakhir</p>
          <p>Alamat</p>
        </div>
        <div className="flex-1 p-4">
          <p>: {nama}</p>
          <p>: {ttl}</p>
          <p>: {pekerjaan}</p>
          <p>: {kewarganegaraan}</p>
          <p>: {pendidikanTerakhir}</p>
          <div className='flex'>: <p className="flex-1 ml-1">Komplek Mekar Sari Endah Blok {blok}, No {noRumah} RT 05 RW 24 Kel. Kec. Baleendah Kab. Bandung</p></div>
        </div>
      </div>

      <div className='mt-4'>
        <p>Orang tersebut diatas betul-betul penduduk kami dan sampai dikeluarkannya Surat Keterangan ini masih menetap di alamat tersebut di atas. Surat keterangan ini hanya dipergunakan untuk persyaratan:</p>
        <p className='mt-4'>{keteranganSurat}</p>
        <p className='mt-4'>Dan tidak berlaku untuk kepentingan lain serta berlaku dari tanggal {startDay} sd {tanggal[1].format('DD MMM YYYY')}. Demikian Keterangan ini kami buat dengan sebenarnya, dan yang berkepentingan menjadi maklum</p>
      </div>
    
    </>
  )
}

export default Isi