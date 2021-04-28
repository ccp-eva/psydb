import React, { useState, useEffect, useReducer } from 'react';
import { ArrowUpShort, ArrowDownShort } from 'react-bootstrap-icons';

const ArrayFieldTemplate = (ps) => {
    var {
        schema
    } = ps;
    console.log(ps);

    var Variant = subTemplates[schema.systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    }

    return (
        <Variant { ...ps } />
    )
}

const DefaultArrayItem = ({ children, ...other }) => {
    console.log(other);
    return (
        <div className='border p-3 mb-3' style={{ position: 'relative' }}>
            { children }
            <MoveButtonWrapper>
                <MoveButton>
                    <ArrowUpShort />
                </MoveButton>
                <MoveButton>
                    <ArrowDownShort />
                </MoveButton>
            </MoveButtonWrapper>
        </div>
    )
}

const MoveButtonWrapper = ({ children }) => (
    <div
        role='button'
        className='d-flex'
        style={{
            //background: '#006066',
            bottom: -1,
            right: -1,
            position: 'absolute',
        }}
    >
        { children }
    </div>
);

const MoveButton = ({ children }) => (
    <div 
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

const Plain = ({
    items,
    title,
    schema,
}) => {
    return (
        <div className='row mr-0 ml-0'>
            <header className='col-sm-3'>
                <b>{ title }</b>
            </header>
            <div className='col-sm-9 p-0'>
                { items && items.map(itemProps => (
                    <DefaultArrayItem { ...itemProps } schema={ schema } />
                ))}
            </div>
        </div>
    )
}

const subTemplates = {
    Plain,
};

export default ArrayFieldTemplate;
