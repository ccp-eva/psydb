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
    
    var customColumns = gatherCustomColumns({ schema });

    var sortableColumns = [
        ...(permissions.isRoot() ? [
            { pointer: '/_id', label: 'Interne ID' }
        ] : []),
        { pointer: '/sequenceNumber', label: 'ID Nr.' },
        { pointer: '/state/name', label: 'Studienname' },
        { pointer: '/state/shorthand', label: 'Kürzel' },

        { pointer: '/state/runningPeriod/start', label: 'Start' },
        { pointer: '/state/runningPeriod/end', label: 'Ende' },

        { pointer: '/state/researchGroupIds', label: 'Forschungsgruppen' },
        { pointer: '/state/scientistIds', label: 'Wissenschaftler:innen' },
        { pointer: '/state/studyTopicIds', label: 'Themengebiete' },
        ...customColumns
    ];

    var staticColumns = [
        { pointer: '/state/name', label: 'Studienname' },
        { pointer: '/state/shorthand', label: 'Kürzel' },

        { pointer: '/state/runningPeriod/start', label: 'Start' },
        { pointer: '/state/runningPeriod/end', label: 'Ende' },

        { pointer: '/state/researchGroupIds', label: 'Forschungsgruppen' },
        { pointer: '/state/scientistIds', label: 'Wissenschaftler:innen' },
        { pointer: '/state/studyTopicIds', label: 'Themengebiete' },
    ];

    var specialColumns = [];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel='Ausgewählt'
                orderLabel='Anordnung'
                dataXPath='$.columns'
                columnBlocks={[
                    [
                        { pointer: '/sequenceNumber', label: 'ID Nr.' },
                        ...(permissions.isRoot() ? [
                            { pointer: '/_id', label: 'Interne ID' }
                        ] : []),
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
