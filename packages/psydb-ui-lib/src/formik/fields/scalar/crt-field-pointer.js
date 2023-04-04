import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const CRTFieldPointer = withField({ Control: (ps) => {
    var { collection, recordType, ...pass } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        (collection && recordType)
        ? agent.readCRTSettings({ collection, recordType })
        : undefined
    ), [ collection, recordType ]);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }

    if (fetched.data === undefined) {
        return (
            <GenericEnum.Control
                options={{}}
                { ...pass }
            />
        );
    }

    var { hasSubChannels, fieldDefinitions } = fetched.data;
    var options = {};
    if (hasSubChannels) {
        for (var subChannel of Object.keys(fieldDefinitions)) {
            for (var it of fieldDefinitions[subChannel]) {
                if (
                    // TODO: enable ForeignId make sure backend handles change
                    // in 1:1 correctly i.e. remove references from
                    // other targetting source records
                    ['ForeignIdList'].includes(it.type)
                    && it.props.collection === collection
                    && it.props.recordType === recordType
                    && it.props.readOnly === true // TODO
                ) {
                    options[it.pointer] = it.displayName;
                }
            }
        } 
    }
    else {
        for (var it of fieldDefinitions) {
            if (
                // TODO: enable ForeignId make sure backend handles change
                // in 1:1 correctly i.e. remove references from
                // other targetting source records
                ['ForeignIdList'].includes(it.type)
                && it.props.collection === collection
                && it.props.recordType === recordType
                && it.props.readOnly === true // TODO
            ) {
                options[it.pointer] = it.displayName;
            }
        }
    }
    
    return (
        <GenericEnum.Control
            options={ options }
            { ...pass }
        />
    );
}})
