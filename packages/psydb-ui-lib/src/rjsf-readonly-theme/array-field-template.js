import React, { useState, useEffect, useReducer } from 'react';

const ArrayFieldTemplate = (ps) => {
    var {
        items,
        title,
        schema,
        formData,
    } = ps;
    //console.log(ps);

    /*var Variant = subTemplates[schema.systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    }*/

    return (
        //<Variant { ...ps } />
        <div className='row mr-0 ml-0'>
            <header className='col-sm-3'>
                { title }
            </header>
            <div className='col-sm-9 p-0'>
                { items.map(itemProps => (
                    <ArrayItem { ...({
                        ...itemProps,
                        schema,
                        formData,
                    })} />
                ))}
            </div>
        </div>
    )
}

const ArrayItem = ({
    children
}) => {
    return (
        <>
            { children }
        </>
    );
}

export default ArrayFieldTemplate;
