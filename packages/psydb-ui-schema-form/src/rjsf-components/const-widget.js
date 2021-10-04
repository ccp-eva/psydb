import React, { useState, useEffect } from 'react';

import withFormDecorations from './with-form-decorations';

const ConstWidget = (ps) => {
    const {
        value
    } = ps;

    return (
        <div
            className='form-control'
            style={{ border: 0 }}
        ><b>{ value }</b></div>
    )
}

const WrappedConstWidget = withFormDecorations(ConstWidget);
export default WrappedConstWidget;
