import React from 'react';

import {
    gatherCustomColumns
} from '@mpieva/psydb-common-lib';

import {
    Fields
} from '@mpieva/psydb-ui-lib';

export const Columns = (ps) => {
    var { schema } = ps;
    
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

    return (
        <div className='bg-light p-3 border border-top-0'>
           
            <div className='mb-3'>
                <ColumnField
                    dataXPath='$.columns'
                    pointer='/_id'
                    label='ID'
                />
            </div>

            <ColumnOptionBlock columns={ customColumns } />
            <ColumnOptionBlock columns={ specialColumns } />

            <div className='d-flex'>
                <header className='w-50 mb-2 border-bottom'>
                    <b>Sortierung</b>
                </header>
            </div>
            <div className='d-flex'>
                <div className='w-25'>
                    <Fields.GenericEnum
                        dataXPath='$.sort.column'
                        label='Spalte'
                        options={ sortableColumns.reduce((acc, it) => ({
                            ...acc,
                            [it.pointer]: it.label
                        }), {})}
                    />
                </div>
                <div className='w-25'>
                    <Fields.GenericEnum
                        dataXPath='$.sort.direction'
                        label='Richtung'
                        options={{
                            asc: 'Aufsteigend',
                            desc: 'Absteigend',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

const ColumnOptionBlock = (ps) => {
    var { columns } = ps;
    return (
        <div className='d-flex flex-wrap mb-3'>
            { columns.map(col => (
                <div key={ col.pointer} className='w-25'>
                    <ColumnField dataXPath='$.columns' { ...col } />
                </div>
            ))}
        </div>
    )
}

const ColumnField = (ps) => {
    var { dataXPath, pointer, label } = ps;
    return (
        <div>
            <Fields.PlainCheckbox
                dataXPath={ `${dataXPath}.${pointer}` }
                label={ label }
            />
        </div>
    )
}
