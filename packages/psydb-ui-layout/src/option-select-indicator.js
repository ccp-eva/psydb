import React from 'react';
import * as Icons from './icons';

export const OptionSelectIndicator = (ps) => {
    return (
        <div className='text-primary'>
            <Icons.ChevronDoubleRight style={{
                marginTop: '-4px',
                width: '20px',
                height: '20px',
            }}/> 
        </div>
    )
}
