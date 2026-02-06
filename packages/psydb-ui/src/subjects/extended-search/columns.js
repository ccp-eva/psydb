import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { CRTSettings, SmartArray } from '@mpieva/psydb-common-lib';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';
import { Fields } from '@mpieva/psydb-ui-lib';


const ColumnSelect = withField({
    Control: Fields.ColumnSelect.Control,
    DefaultWrapper: 'NoneWrapper'
})

export const Columns = (ps) => {
    var { formData, crtSettings, schema } = ps;
    
    var {
        showOnlineId,
        showSequenceNumber,
        requiresTestingPermissions,
    } = crtSettings;

    var [{ translate, language }] = useI18N();
    var { isRoot, hasFlag } = usePermissions();
    var {
        dev_enableWKPRCPatches = false,
        dev_enableSubjectDuplicatesSearch = false
    } = useUIConfig();

    var crt = CRTSettings({ data: crtSettings });
    var customColumns = (
        crt.findCustomFields({
            'isRemoved': { $ne: true },
            $or: [
                { 'props.isSensitive': { $ne: true }},
                { 'props.isSensitive': hasFlag('canAccessSensitiveFields') },
            ]
        })
        .map(it => ({
            pointer: it.pointer,
            label: translate.fieldDefinition(it),
        }))
    );

    // FIXME: generalzie the creation of the field parts
    // see extended search/subjects/index
    var addressFields = crt.findCustomFields({ type: 'Address' });
    var addressFieldExtraBlocks = [];
    if (addressFields.length > 0) {
        for (var it of addressFields) {
            addressFieldExtraBlocks.push([
                {
                    ...it,
                    pointer: it.pointer + '/city',
                    label: `${translate('_address_city')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/postcode',
                    label: `${translate('_address_postcode')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/street',
                    label: `${translate('_address_street')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/housenumber',
                    label: `${translate('_address_housenumber')} (${it.displayName})`
                },
                {
                    ...it,
                    pointer: it.pointer + '/affix',
                    label: `${translate('_address_affix')} (${it.displayName})`
                }
            ])
        }
    }

    var sortableColumns = SmartArray([
        ( showSequenceNumber && (
            { pointer: '/sequenceNumber', label: translate('ID No.') }
        )),
        ( showOnlineId && (
            { pointer: '/onlineId', label: translate('Online ID Code') }
        )),
        ( isRoot() &&  (
            { pointer: '/_id', label: translate('Internal ID') }
        )),
        ...customColumns,

        ...addressFieldExtraBlocks.reduce((acc, block) => ([
            ...acc, ...block
        ]), []),
    ]);

    var specialColumns = [
        ...(!dev_enableWKPRCPatches ? [
            { 
                pointer: '/_specialStudyParticipation',
                label: translate('Studies')
            },
            {
                pointer: '/_specialUpcomingExperiments',
                label: translate('Appointments')
            },
            {
                pointer: '/_specialHistoricExperimentLocations',
                label: translate('Historical Appointment Locations')
            },
            {
                pointer: '/_specialAgeToday',
                label: translate('Age Today')
            },
        ] : []),

        {
            pointer: '/scientific/state/comment',
            label: translate('Comment')
        }
    ];

    var columnBlocks = [
        SmartArray([
            ( showSequenceNumber && (
                { pointer: '/sequenceNumber', label: translate('ID No.') }
            )),
            ( showSequenceNumber && dev_enableSubjectDuplicatesSearch && (
                { 
                    pointer: '/_mergedDuplicateSequenceNumber',
                    label: translate('ID No. (from Duplicate)')
                }
            )),

            ( showOnlineId && (
                { pointer: '/onlineId', label: translate('Online ID Code') }
            )),
            ( showOnlineId && dev_enableSubjectDuplicatesSearch && (
                {
                    pointer: '/_mergedDuplicateOnlineId',
                    label: translate('Online ID Code (from Duplicate)')
                }
            )),

            ( isRoot() && (
                { pointer: '/_id', label: translate('Internal ID') }
            )),
            ( isRoot() && dev_enableSubjectDuplicatesSearch && (
                {
                    pointer: '/_mergedDuplicateId',
                    label: translate('Internal ID (from Duplicate)')
                }
            )),
        ]),

        customColumns,
        ...addressFieldExtraBlocks,
        specialColumns,
    ];

    return (
        <div className='bg-light p-3 border border-top-0'>
            <ColumnSelect
                columnLabel={ translate('Selected') }
                orderLabel={ translate('Column Order') }
                dataXPath='$.columns'
                columnBlocks={ columnBlocks }
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
