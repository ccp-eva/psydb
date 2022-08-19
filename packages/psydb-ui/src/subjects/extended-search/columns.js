import React from 'react';

import { gatherCustomColumns } from '@mpieva/psydb-common-lib';
import { withField } from '@cdxoo/formik-utils';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, schema } = ps;
    var permissions = usePermissions();
    
    var customColumns = gatherCustomColumns({
        schema, subChannelKeys: [ 'gdpr', 'scientific' ]
    });

    var sortableColumns = [
        { pointer: '/sequenceNumber', label: 'ID Nr.' },
        { pointer: '/onlineId', label: 'Online ID Code' },
        ...(permissions.isRoot() ? [
            { pointer: '/_id', label: 'Interne ID' }
        ] : []),
        ...customColumns
    ];

    var specialColumns = [
        { pointer: '/_specialStudyParticipation', label: 'Studien' },
        { pointer: '/_specialUpcomingExperiments', label: 'Termine' },
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel='Ausgewählt'
                orderLabel='Anordnung'
                dataXPath='$.columns'
                columnBlocks={[
                    [
                        { pointer: '/sequenceNumber', label: 'ID Nr.' },
                        { pointer: '/onlineId', label: 'Online ID Code' },
                        ...(permissions.isRoot() ? [
                            { pointer: '/_id', label: 'Interne ID' }
                        ] : []),
                    ],
                    customColumns,
                    specialColumns,
                ]}
            >
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
            </ColumnSelect>
            <div>
                <Button type='submit'>
                    Weiter
                </Button>
            </div>
        </div>
    );
}
