import React from 'react';
import isSubset from 'is-subset';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import { createSend } from '@mpieva/psydb-ui-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

const defaultValues = {
    subjectsPerExperiment: 1,
    subjectFieldRequirements: [],
    locations: [],
}

export const AgeFrameForm = (ps) => {
    var {
        op,
        subjectTypeKey,
        studyId,
        selectorId,
        ageFrameRecord,

        onSuccessfulUpdate
    } = ps;

    var ageFrameId, lastKnownEventId, ageFrameState;
    if (ageFrameRecord) {
        ({
            _id: ageFrameId,
            _lastKnownEventId: lastKnownEventId,
            state: ageFrameState,
        } = ageFrameRecord)
    }
    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    var handleSubmit = createSend((formData, formikProps) => {
        var type = `ageFrame/${op}`;
        var message;
        switch (op) {
            case 'create':
                message = { type, payload: {
                    studyId,
                    subjectSelectorId: selectorId,
                    props: formData['$']
                } };
                break;
            case 'patch':
                message = { type, payload: {
                    id: ageFrameId,
                    lastKnownEventId,
                    props: formData['$']
                }};
                break;
            default:
                throw new Error(`unknown op "${op}"`);
        }
        return message;
    }, { onSuccessfulUpdate });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { customRecordTypes } = fetched.data;

    customRecordTypes = keyBy({
        items: customRecordTypes,
        byProp: 'type',
    });

    return (
        <div>
            <DefaultForm
                onSubmit={ handleSubmit }
                initialValues={ ageFrameState || defaultValues }
            >
                {(formikProps) => {
                    var subjectScientificFields = (
                        customRecordTypes[subjectTypeKey].state
                        .settings.subChannelFields.scientific
                    );

                    return (
                        <>
                            <Fields.AgeFrameBoundary
                                label='Start'
                                dataXPath='$.interval.start'
                            />
                            <Fields.AgeFrameBoundary
                                label='Ende'
                                dataXPath='$.interval.end'
                            />

                            <Fields.SubjectFieldCondition { ...({
                                dataXPath: '$.cond',
                                subjectScientificFields
                            })} />

                            <Button type='submit'>
                                Speichern
                            </Button>
                        </>
                    );
                }}
            </DefaultForm>
        </div>
    )
};
