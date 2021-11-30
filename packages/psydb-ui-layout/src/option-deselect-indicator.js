import React from 'react';
import * as Icons from './icons';

export const OptionDeselectIndicator = (ps) => {
    return (
        <div className='text-danger'>
            <Icons.ChevronDoubleLeft style={{
                marginTop: '-4px',
                width: '20px',
                height: '20px',
            }}/> 
        </div>
    )
}
