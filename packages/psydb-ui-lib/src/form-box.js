import React from 'react';
// FIXME: move to layout
const FormBox = ({
    title,
    children,
}) => {
    return (
        <div className='border p-3 bg-light'>
            <h5>
                { title }
            </h5>
            <hr />
            { children }
        </div>

    )
}

export default FormBox;
