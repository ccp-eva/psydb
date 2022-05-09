import React from 'react';
import { NBSP } from '../nbsp';

export const InlineArrayWrapper = (ps) => {
    var {
        label,
        labelClassName,
        children,
        required,
    } = ps;

    return (
        <div className='row mr-0 ml-0'>
            <header className={ `col-sm-3 ${labelClassName}` }>
                { label }
                <NBSP />
                { label && required ? '*' : null }
            </header>
            <div className='col-sm-9 p-0'>
                { children }
            </div>
        </div>
    );
}
