import React from 'react';
import { Form } from 'react-bootstrap';

export const ErrorIndicator = (ps) => {
    var { formikMeta = {} } = ps;
    var { error } = formikMeta;

    return (
        error && error['@@ERRORS']
        ? (
            <div className='text-danger' style={{ fontSize: '80%' }}>
                { error['@@ERRORS'].map((err, index) => (
                    <div key={ index }>
                        { err.message }
                    </div>
                )) }
            </div>
        )
        : null
    );
}
