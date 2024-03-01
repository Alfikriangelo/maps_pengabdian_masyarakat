import React from 'react'

const Judul = ({nomorSurat}) => {
  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  return (
    <div className='text-center'>
      <h1 className='text-xl'>Surat Keterangan</h1>
      <div className='border-t-2 border-gray-800 w-1/5 mx-auto my-2'></div>
      <h3>Nomor : {nomorSurat} SK/RT-05/{currentMonth}/{currentYear}</h3>
    </div>

  )
}

export default Judul