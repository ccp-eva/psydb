import React from 'react';
import isSubset from 'is-subset';
import { keyBy } from '@mpieva/psydb-core-utils';
import { CRTSettings } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.readCRTSettings({
            collection: 'subject', recordType: subjectTypeKey
        })
    }, []);

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
    
    var crt = CRTSettings({ data: fetched.data });

    return (
        <div>
            <DefaultForm
                onSubmit={ send.exec }
                initialValues={ ageFrameState || defaultValues }
                useAjvAsync
            >
                {(formikProps) => {
                    return (
                        <>
                            <Fields.AgeFrameBoundary
                                label={ translate('Start') }
                                dataXPath='$.interval.start'
                            />
                            <Fields.AgeFrameBoundary
                                label={ translate('End') }
                                dataXPath='$.interval.end'
                            />
                            
                            <div className='pl-3'>
                                <header className='border-bottom pb-1 mb-2'>
                                    <b>{ translate('Conditions') }</b>
                                </header>
                                <Fields.SubjectFieldConditionList { ...({
                                    dataXPath: '$.conditions',
                                    crt,
                                    noWrapper: true
                                })} />
                            </div>

                            <Button type='submit'>
                                { translate('Save') }
                            </Button>
                        </>
                    );
                }}
            </DefaultForm>
        </div>
    )
};
