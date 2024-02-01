import React from 'react';

const DetailsBoxPlain = (ps) => {
    var { title, children } = ps;
    return (
        <div className='border p-3 bg-light'>
            <h5>{ title }</h5>
            <hr />
            <div className='px-3 pb-3'>
                { children }
            </div>
        </div>
    )
}

export default DetailsBoxPlain;
