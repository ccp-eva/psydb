import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, crtSettings, schema } = ps;
    
    var [ language ] = useUILanguage();
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    var crt = CRTSettings({ data: crtSettings });
    var customColumns = (
        crt.allCustomFields()
        .filter(it => !it.isRemoved)
        .map(it => {
            var { pointer, displayName, displayNameI18N = {} } = it;
            return {
                pointer,
                label: displayNameI18N[language] || displayName
            }
        })
    );

    var sortableColumns = [
        { pointer: '/sequenceNumber', label: translate('ID No.') },
        ...(permissions.isRoot() ? [
            { pointer: '/_id', label: translate('Internal ID') }
        ] : []),
        { pointer: '/state/name', label: translate('Name') },
        { pointer: '/state/shorthand', label: translate('Shorthand') },

        { pointer: '/state/runningPeriod/start', label: translate('Start') },
        { pointer: '/state/runningPeriod/end', label: translate('End') },

        { pointer: '/state/researchGroupIds', label: translate('Research Groups') },
        { pointer: '/state/scientistIds', label: translate('Scientists') },
        { pointer: '/state/studyTopicIds', label: translate('Study Topics') },
        ...customColumns
    ];

    var staticColumns = [
        { pointer: '/state/name', label: translate('Name') },
        { pointer: '/state/shorthand', label: translate('Shorthand') },

        { pointer: '/state/runningPeriod/start', label: translate('Start') },
        { pointer: '/state/runningPeriod/end', label: translate('End') },

        { pointer: '/state/researchGroupIds', label: translate('Research Groups') },
        { pointer: '/state/scientistIds', label: translate('Scientists') },
        { pointer: '/state/studyTopicIds', label: translate('Study Topics') },
    ];

    var specialColumns = [];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={[
                    [
                        { pointer: '/sequenceNumber', label: translate('ID No.') },
                        ...(permissions.isRoot() ? [
                            { pointer: '/_id', label: translate('Internal ID') }
                        ] : []),
                    ],
                    staticColumns,
                    customColumns,
                    //specialColumns,
                ]}
            >
                <header className='mb-2 border-bottom'>
                    <b>{ translate('Sort Order') }</b>
                </header>
                <Fields.GenericEnum
                    dataXPath='$.sort.column'
                    label={ translate('Column') }
                    options={ sortableColumns.reduce((acc, it) => ({
                        ...acc,
                        [it.pointer]: it.label
                    }), {})}
                />
                <Fields.GenericEnum
                    dataXPath='$.sort.direction'
                    label={ translate('_sort_direction') }
                    options={ translate.options({
                        asc: '_sort_direction_asc',
                        desc: '_sort_direction_desc',
                    })}
                />
            </ColumnSelect>
            <div>
                <Button type='submit'>
                    { translate('Next') }
                </Button>
            </div>
        </div>
    );
}
