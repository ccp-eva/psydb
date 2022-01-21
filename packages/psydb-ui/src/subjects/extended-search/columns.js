import React from 'react';

import {
    gatherCustomColumns
} from '@mpieva/psydb-common-lib';

import { withField, withFieldArray } from '@cdxoo/formik-utils';
import { Icons } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';
import * as Controls from '@mpieva/psydb-ui-form-controls';

export const Columns = (ps) => {
    var { formData, schema } = ps;
    
    var customColumns = gatherCustomColumns({
        schema, subChannelKeys: [ 'gdpr', 'scientific' ]
    });

    var sortableColumns = [
        { pointer: '/_id', label: 'ID' },
        ...customColumns
    ];

    var specialColumns = [
        { pointer: '/_specialStudyParticipation', label: 'Studien' },
        { pointer: '/_specialUpcomingExperiments', label: 'Termine' },
    ];

    var allColumns = [
        { pointer: '/_id', label: 'ID' },
        ...customColumns,
        ...specialColumns,
    ];

    return (
        <div className='bg-light p-3 border border-top-0 d-flex'>
            
            <div className='w-50 pr-3'>
                <header className='mb-2 border-bottom'>
                    <b>Ausgewählt</b>
                </header>
                <div className='mb-3'>
                    <ColumnField
                        dataXPath='$.columns'
                        pointer='/_id'
                        label='ID'
                    />
                </div>

                <ColumnOptionBlock columns={ customColumns } />
                <ColumnOptionBlock columns={ specialColumns } />
            </div>

            <div className='w-50 pl-3'>
                <header className='mb-2 border-bottom'>
                    <b>Sortierung</b>
                </header>
                <Fields.GenericEnum
                    dataXPath='$.sort.column'
                    label='Spalte'
                    options={ sortableColumns.reduce((acc, it) => ({
                        ...acc,
                        [it.pointer]: it.label
                    }), {})}
                />
                <Fields.GenericEnum
                    dataXPath='$.sort.direction'
                    label='Richtung'
                    options={{
                        asc: 'Aufsteigend',
                        desc: 'Absteigend',
                    }}
                />

                <header className='mb-2 border-bottom'>
                    <b>Anordnung</b>
                </header>
                <ColumnOrder
                    labels={ allColumns.reduce((acc, it) => ({
                        ...acc,
                        [it.pointer]: it.label
                    }), {})}
                    dataXPath='$.columns'
                />
            </div>
        </div>
    )
}

const ColumnOptionBlock = (ps) => {
    var { columns } = ps;
    return (
        <div className='d-flex flex-wrap mb-3'>
            { columns.map(col => (
                <div key={ col.pointer} className='w-50'>
                    <ColumnField dataXPath='$.columns' { ...col } />
                </div>
            ))}
        </div>
    )
}

const ColumnField = withField({
    Control: (ps) => {
        var { dataXPath, pointer, label, formikField, formikForm } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        var hasPointer = value.includes(pointer);

        var onChange = (didSelect) => {
            if (didSelect === true) {
                setFieldValue(dataXPath, [ ...value, pointer ]);
            }
            else {
                setFieldValue(dataXPath, value.filter(it => it !== pointer))
            }
        }

        return (
            <div>
                <Controls.PlainCheckbox
                    id={ `${dataXPath}.${pointer}` }
                    label={ label }
                    value={ hasPointer }
                    onChange={ onChange }
                />
            </div>
        )
    },
    fakeDefault: [],
    DefaultWrapper: 'NoneWrapper'
})

const swap = (ary, a, b) => {
    [ ary[a], ary[b] ] = [ ary[b], ary[a] ];
    return ary;
};

const ColumnOrder = withField({
    Control: (ps) => {
        var { dataXPath, formikField, formikForm, labels } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        return (
            <div className='border bg-white'>
                <table className='table table-hover table-borderless table-sm table-selectable m-0'>
                    <tbody>
                        { value.map((it, index) => (
                            <tr key={ it }><td>
                                <ColumnOrderItem
                                    index={ index }
                                    lastIndex={ value.length - 1 }
                                    label={ labels[it] }
                                    onSwap={ (a, b) => {
                                        setFieldValue(
                                            dataXPath,
                                            swap([ ...value ], a, b)
                                        )
                                    }}
                                />
                            </td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    },
    DefaultWrapper: 'NoneWrapper',
});

const ColumnOrderItem = (ps) => {
    var { index, lastIndex, label, onSwap } = ps;

    var canMoveUp = index > 0;
    var canMoveDown = index < lastIndex;

    return (
        <div className='d-flex pr-3'>
            <div className='px-3 flex-grow-1'>
                { label }
            </div>
            <UpButton
                onClick={ () => onSwap(index, index - 1) }
                disabled={ !canMoveUp }
            />
            <DownButton
                onClick={ () => onSwap(index, index + 1) }
                disabled={ !canMoveDown }
            />
        </div>
    )
}

const UpButton = (ps) => {
    var { onClick, disabled } = ps;
    return (
        <span
            onClick={ disabled ? undefined : onClick }
            role={ disabled ? '' : 'button' }
            className={ disabled ? 'text-muted' : 'text-primary' }
        >
            <Icons.ArrowUpShort style={{
                width: '24px',
                height: '24px',
                marginTop: '1px'
            }} />
        </span>
    )
}
const DownButton = (ps) => {
    var { onClick, disabled } = ps;
    return (
        <span
            onClick={ disabled ? undefined : onClick }
            role={ disabled ? '' : 'button' }
            className={ disabled ? 'text-muted' : 'text-primary' }
        >
            <Icons.ArrowDownShort style={{
                width: '24px',
                height: '24px',
                marginTop: '1px'
            }} />
        </span>
    )
}
