import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { arrify } from '@mpieva/psydb-core-utils';

import { ColumnOptionBlock } from './column-option-block';
import { ColumnOrder } from './column-order';

const toOptions = (items, { value = 'key', label = 'label' } = {}) => (
    items.reduce((acc, it) => ({
        ...acc,
        [it[value]]: it[label]
    }), {})
)
export const ColumnSelect = withField({ Control: (ps) => {
    var {
        columnLabel = 'columnLabel',
        orderLabel = 'orderLabel',
        columns,
        dataXPath,
        required,
        children
    } = ps;

    var columnBlocks = arrify(columns);
    var allOptions = columnBlocks.reduce((acc, block) => ({
        ...acc,
        ...toOptions(block, { value: 'pointer' })
    }), {});

    console.log(allOptions);

    return (
        <>
            <div className='d-flex'>
                <div className='w-50 pr-3'>
                    <header className='mb-2 border-bottom'>
                        <b>{ columnLabel }</b>
                    </header>
                    { columnBlocks.map((columns, index) => (
                        <ColumnOptionBlock
                            key={ index }
                            index={ index }
                            dataXPath={ dataXPath }
                            columns={ columns }
                        />
                    ))}
                </div>
                <div className='w-50 pl-3'>
                    { children }

                    <header className='mb-2 border-bottom'>
                        <b>{ orderLabel }</b>
                    </header>
                    <ColumnOrder
                        dataXPath={ dataXPath }
                        allOptions={ allOptions }
                    />
                </div>
            </div>
        </>
    )
}});

