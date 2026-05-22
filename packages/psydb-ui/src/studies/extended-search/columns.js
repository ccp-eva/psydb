import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { keyBy } from '@mpieva/psydb-core-utils';
import { CRTSettings, SmartArray } from '@mpieva/psydb-common-lib';
import { useUIConfig, useI18N } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, crtSettings } = ps;
    
    var { dev_enableWKPRCPatches: IS_WKPRC } = useUIConfig();
    var [{ language, translate }] = useI18N();
    var permissions = usePermissions();
    
    var crt = CRTSettings({ data: crtSettings });
    var customColumns = (
        crt.findCustomFields({ 'isRemoved': { $ne: true }})
        .map(it => ({
            pointer: it.pointer,
            label: translate.fieldDefinition(it)
        }))
    );

    var sortableColumns = SmartArray([
        { pointer: '/sequenceNumber', label: translate('ID No.') },
        
        ( permissions.isRoot() && (
            { pointer: '/_id', label: translate('Internal ID') }
        )),

        { pointer: '/state/name', label: translate('Name') },

        ( !IS_WKPRC && (
            { pointer: '/state/shorthand', label: translate('Shorthand') }
        )),

        { pointer: '/state/runningPeriod/start', label: translate('Start') },
        { pointer: '/state/runningPeriod/end', label: translate('End') },

        { pointer: '/state/researchGroupIds', label: translate('Research Groups') },
        { pointer: '/state/scientistIds', label: translate('Scientists') },
        { pointer: '/state/studyTopicIds', label: translate('Study Topics') },
        ...customColumns
    ]);

    var idColumns = SmartArray([
        { pointer: '/sequenceNumber', label: translate('ID No.') },
        ( permissions.isRoot()  && (
            { pointer: '/_id', label: translate('Internal ID') }
        )),
    ])

    var staticColumns = SmartArray([
        { pointer: '/state/name', label: translate('Name') },
        
        ( !IS_WKPRC && (
            { pointer: '/state/shorthand', label: translate('Shorthand') }
        )),

        { pointer: '/state/runningPeriod/start', label: translate('Start') },
        { pointer: '/state/runningPeriod/end', label: translate('End') },

        { pointer: '/state/researchGroupIds', label: translate('Research Groups') },
        { pointer: '/state/scientistIds', label: translate('Scientists') },
        { pointer: '/state/studyTopicIds', label: translate('Study Topics') },
        
        ( IS_WKPRC && {
            pointer: '/state/experimentNames',
            label: translate('Experiment Name')
        }),
    ]);

    var specialColumns = [];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={[
                    idColumns,
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
                    options={ keyBy({
                        items: sortableColumns, byProp: 'pointer',
                        transform: it => it.label
                    })}
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
