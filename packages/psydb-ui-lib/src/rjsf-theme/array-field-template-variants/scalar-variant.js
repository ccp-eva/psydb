import React from 'react';

import * as wrappers from '../utility-components/wrappers';

const ScalarVariant = (ps) => {
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

    var hasErrors = !!rawErrors.length;
    var itemsCount = items.length;

    return (
        <Wrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false
        }) }>
            <ol className='border p-3'>
                { items && items.map((itemProps, index) => {
                    var isLastItem = (index === items.length - 1);
                    return <li className={
                        `ml-3 pl-2 ${isLastItem ? '' : 'mb-3'}`
                    }>
                        <ArrayItem
                            { ...itemProps }
                            schema={ schema }
                            formData={ formData }
                            itemsCount={ itemsCount }
                            onAddClick={ onAddClick }
                        />
                    </li>
                })}
            </ol>
        </Wrapper>
    )
}

var ArrayItem = ({ children }) => {
    return (
        <div>{ children }</div>
    );
}

export default ScalarVariant;
