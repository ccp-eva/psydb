import React from 'react';
import { withField } from '@cdxoo/formik-utils';

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
        columnBlocks,
        dataXPath,
        required,
        enableColumnOrder = true,
        children
    } = ps;

    columnBlocks = columnBlocks || [ columns ];
    var allOptions = columnBlocks.reduce((acc, block) => ({
        ...acc,
        ...toOptions(block, { value: 'pointer' })
    }), {});

    var leftClassName = 'w-50 pr-3';
    var rightClassName = 'w-50 pl-3';

    if (!enableColumnOrder) {
        leftClassName = '';
    }

    return (
        <>
            <div className='d-flex'>
                <div className={ leftClassName }>
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
                { enableColumnOrder && (
                    <div className={ rightClassName }>
                        { children }

                        <header className='mb-2 border-bottom'>
                            <b>{ orderLabel }</b>
                        </header>
                        <ColumnOrder
                            dataXPath={ dataXPath }
                            allOptions={ allOptions }
                        />
                    </div>
                )}
            </div>
        </>
    )
}});

