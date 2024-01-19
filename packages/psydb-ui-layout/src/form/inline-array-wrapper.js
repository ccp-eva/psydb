import React from 'react';
import { NBSP } from '../nbsp';

export const InlineArrayWrapper = (ps) => {
    var {
        label,
        labelClassName,
        valueClassName,
        children,
        required,
        uiSplit = [3,9],
    } = ps;

    return (
        <div className='row mr-0 ml-0'>
            <header
                className={ `col-sm-${uiSplit[0]} col-form-label ${labelClassName}`}
            >
                { label }
                <NBSP />
                { label && required ? '*' : null }
            </header>
            <div className={`col-sm-${uiSplit[1]} pl-0 pr-0 ${valueClassName}`}>
                { children }
            </div>
        </div>
    );
}
