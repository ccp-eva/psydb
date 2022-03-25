import React from 'react';
import isSubset from 'is-subset';
import keyBy from '@mpieva/psydb-common-lib/src/key-by';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';
import { Button, LoadingIndicator } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields
} from '@mpieva/psydb-ui-lib/src/formik';

const defaultValues = {
    interval: { 
        start: { years: 0, months: 0, days: 0 },
        end: { years: 0, months: 0, days: 0 },
    },
    conditions: [],
}

export const AgeFrameForm = (ps) => {
    var {
        op,
        subjectTypeKey,
        studyId,
        selectorId,
        ageFrameRecord,
        ageFrameRelated,

        onSuccessfulUpdate
    } = ps;

    var ageFrameId, ageFrameState;
    if (ageFrameRecord) {
        ({
            _id: ageFrameId,
            state: ageFrameState,
        } = ageFrameRecord)
    }
    if (![ 'create', 'patch' ].includes(op)) {
        throw new Error(`unknown op "${op}"`);
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCustomRecordTypeMetadata()
    }, [])

    var send = useSend((formData, formikProps) => {
        var type = `ageFrame/${op}`;
        var message;
        switch (op) {
            case 'create':
                message = { type, payload: {
                    subjectTypeKey,
                    studyId,
                    subjectSelectorId: selectorId,
                    props: formData
                } };
                break;
            case 'patch':
                message = { type, payload: {
                    id: ageFrameId,
                    props: formData
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
                onSubmit={ send.exec }
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
                            
                            <div className='pl-3'>
                                <header className='border-bottom pb-1 mb-2'>
                                    <b>Bedingungen</b>
                                </header>
                                <Fields.SubjectFieldConditionList { ...({
                                    dataXPath: '$.conditions',
                                    subjectScientificFields,
                                    noWrapper: true
                                })} />
                            </div>

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
