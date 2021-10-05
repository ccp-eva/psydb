import React, { useState, useEffect, useReducer } from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

import { DefaultArrayItem } from '../array-field-item-variants';
import * as wrappers from '../utility-components/wrappers';

const DefaultVariant = (ps) => {
    var {
        id,
        items,
        title,
        schema,
        formData,
        onAddClick,
        rawErrors = [],
    } = ps;

    var {
        systemType,
        systemProps = {}
    } = schema;

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.InlineArrayWrapper;
    }

    //console.log(ps);

    var hasErrors = !!rawErrors.length;
    var itemsCount = items.length;

    return (
        <Wrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false
        }) }>
            <div>
                { items && items.map((itemProps) => (
                    <DefaultArrayItem
                        { ...itemProps }
                        schema={ schema }
                        formData={ formData }
                        itemsCount={ itemsCount }
                        onAddClick={ onAddClick }
                    />
                ))}
                { itemsCount === 0 && (
                    <div className='border p-3' style={{
                        position: 'relative',
                    }}>
                        <div className='text-muted' style={{ paddingLeft: '15px' }}>
                            <i>Keine Einträge</i>
                        </div>
                    </div>
                )}
                <AddButtonWrapper>
                    <AddButton onClick={ onAddClick }>
                        <Icons.Plus />
                    </AddButton>
                </AddButtonWrapper>
            </div>
        </Wrapper>
    )
}

const AddButtonWrapper = ({ children }) => (
    <div
        role='button'
        className='d-flex mb-3'
        style={{ marginTop: '-1px' }}
    >
        <div className='bg-white'>
            { children }
        </div>
    </div>
);

const AddButton = ({ children, onClick, style }) => (
    <div
        onClick={ onClick }
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
            ...style,
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

export default DefaultVariant;
