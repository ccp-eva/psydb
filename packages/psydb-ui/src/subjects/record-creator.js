import React from 'react';
import jsonpointer from 'jsonpointer';
import { range } from '@mpieva/psydb-core-utils';
import { gatherCustomFieldSchemas } from '@mpieva/psydb-common-lib';

import {
    useFetch,
    useSendCreate,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordCreator } from '@mpieva/psydb-ui-lib';
import { MainForm } from './main-form';


const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};
const CustomFieldDefault = (options) => {
    var { schema } = options;
    var { systemType } = schema;
    
    systemType = fixSystemType(systemType);

    console.log(systemType);
    switch (systemType) {
        case 'SaneString':
            return '';
        case 'DateOnlyServerSide':
            return undefined;
        case 'DateTime':
            return undefined;

        case 'ExtBool':
            return undefined;
        case 'DefaultBool':
            return false;
        case 'BiologicalGender':
            return undefined;

        case 'ForeignId':
        case 'HelperSetItemId':
            return undefined;

        case 'EmailWithPrimaryList':
        case 'PhoneWithTypeList':
            var { minItems } = schema;
            return range(minItems || 0).map(() => ({}));

        case 'HelperSetItemIdList':
        case 'ForeignIdList':
            var { minItems } = schema;
            return range(minItems || 0).map(() => '');
        default:
            throw new Error(`unknown systemType "${systemType}"`)
    }
}

const Defaults = (options) => {
    var { schema, permissions } = options;
    var subChannels = [ 'gdpr', 'scientific' ];
    var fieldSchemas = gatherCustomFieldSchemas({
        schema, subChannels, asPointers: true
    });

    var {
        forcedResearchGroupId,
        researchGroupIds,
    } = permissions.raw;

    var firstResearchGroupId = undefined;
    if (Array.isArray(researchGroupIds)) {
        firstResearchGroupId = researchGroupIds[0];
    }
    var presetResearchGroupId = (
        forcedResearchGroupId ||
        firstResearchGroupId ||
        undefined
    );
    
    var defaults = {
        scientific: {
            testingPermissions: [],
            systemPermissions: {
                accessRightsByResearchGroup: [{
                    researchGroupId: presetResearchGroupId,
                    permission: presetResearchGroupId ? 'write' : undefined,
                }],
                isHiddenForResearchGroupIds: [],
            },
            comment: '',
        }
    };

    for (var pointer of Object.keys(fieldSchemas)) {
        jsonpointer.set(
            defaults, pointer,
            CustomFieldDefault({ schema: fieldSchemas[pointer] })
        );
    }

    return defaults;
}

const CreateForm = (ps) => {
    var { collection, recordType, onSuccessfulUpdate } = ps;
    var permissions = usePermissions();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecordSchema({ collection, recordType })
    ), [ collection, recordType ])

    var send = useSendCreate({
        collection,
        recordType,
        onSuccessfulUpdate
    })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var schema = fetched.data;
    var initialValues = Defaults({ schema, permissions });

    return (
        <MainForm
            title='Neuer Probanden-Datensatz'
            schema={ schema }
            initialValues={ initialValues }
            onSubmit={ send.exec }
            permissions={ permissions }
        />
    )
}

export const RecordCreator = withRecordCreator({ CreateForm });

