import React from 'react';

import { gatherCustomColumns } from '@mpieva/psydb-common-lib';
import { withField } from '@cdxoo/formik-utils';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, schema } = ps;
    
    var customColumns = gatherCustomColumns({ schema });

    var sortableColumns = [
        { pointer: '/_id', label: 'ID' },
        { pointer: '/_sequenceNumber', label: 'ID Nr.' },
        { pointer: '/state/name', label: 'Studienname' },
        { pointer: '/state/shorthand', label: 'Kürzel' },
        { pointer: '/state/researchGroupIds', label: 'Forschungsgruppen' },
        { pointer: '/state/scientistIds', label: 'Wissenschaftler' },
        { pointer: '/state/studyTopicIds', label: 'Themengebiete' },
        ...customColumns
    ];

    var staticColumns = [
        { pointer: '/state/name', label: 'Studienname' },
        { pointer: '/state/shorthand', label: 'Kürzel' },
        { pointer: '/state/researchGroupIds', label: 'Forschungsgruppen' },
        { pointer: '/state/scientistIds', label: 'Wissenschaftler' },
        { pointer: '/state/studyTopicIds', label: 'Themengebiete' },
    ];

    var specialColumns = [];

    var allColumns = [
        { pointer: '/_id', label: 'ID' },
        { pointer: '/_sequenceNumber', label: 'ID Nr.' },
        ...staticColumns,
        ...customColumns,
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel='Ausgewählt'
                orderLabel='Anordnung'
                dataXPath='$.columns'
                columnBlocks={[
                    [
                        { pointer: '/_id', label: 'ID' },
                        { pointer: '/sequenceNumber', label: 'ID Nr.' },
                    ],
                    staticColumns,
                    customColumns,
                    //specialColumns,
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
