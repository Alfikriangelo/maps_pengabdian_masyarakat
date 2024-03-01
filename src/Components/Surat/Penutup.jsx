import React from 'react';
import dayjs from 'dayjs';

const Penutup = () => {
    const currentDate = dayjs();

    const formattedDate = currentDate.format('DD MMM YYYY');

    return (
        <div className='mt-10'>
            <p className='text-right pr-4'>Baleendah, {formattedDate}</p>
        </div>
    );
}

export default Penutup;
