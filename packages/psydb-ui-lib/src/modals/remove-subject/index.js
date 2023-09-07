import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    LoadingIndicator,
    Split,
    SplitPartitioned,
    Button,
} from '@mpieva/psydb-ui-layout';

import { DefaultForm, Fields, useFormikContext } from '../../formik';
import ExperimentIntervalSummary from '../../experiment-interval-summary';


const UnscheduleSubjectModalBody = (ps) => {
    var {
        onHide,

        shouldFetch,
        experimentId,
        experimentType,

        experimentData,
        subjectDataByType,
        payloadData, // FIXME: make obsolete
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    modalPayloadData = modalPayloadData || payloadData;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => {
        if (shouldFetch) {
            return agent.fetchExtendedExperimentData({
                experimentType,
                experimentId,
            })
        }
    }, [ experimentId ]);

    var send = useSend((formData) => ({
        type: 'experiment/remove-subject',
        payload: {
            experimentId,
            subjectId,
            ...formData
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    if (shouldFetch && !didFetch) {
        return null;
    }

    experimentData = experimentData || fetched.data.experimentData;
    subjectDataByType = subjectDataByType || fetched.data.subjectDataByType;

    var {
        subjectId,
        subjectType
    } = modalPayloadData;

    var subjectData = experimentData.record.state.subjectData.find(it => (
        it.subjectId === subjectId
    ));

    var subjectRecord = subjectDataByType[subjectType].records.find(it => (
        it._id === subjectId
    ));

    var initialValues = {
        unparticipateStatus: 'canceled-by-participant',
        blockSubjectFromTesting: { shouldBlock: false },
        subjectComment: subjectRecord.scientific.state.comment,
    };

    return (
        <>
            <SplitPartitioned
                partitions={[ 3, 9 ]}
                extraClassName='mb-3'
            >
                <b className='d-block py-2 pl-3'>
                    { translate('Subject') }
                </b>
                <div className='py-2 px-3 bg-white border'>
                    { subjectRecord._recordLabel }
                </div>
            </SplitPartitioned>
            <SplitPartitioned
                partitions={[ 3, 9 ]}
                extraClassName='mb-3'
            >
                <b className='d-block py-2 pl-3'>
                    { translate('Appointment') }
                </b>
                <div className='bg-white border py-2'>
                    <SplitPartitioned partitions={[ 1, 1 ]}>
                        <ExperimentIntervalSummary
                            experimentRecord={ experimentData.record }
                        />
                        <div style={{
                            paddingTop: 'calc(0.375rem + 1px)',
                            paddingBottom: 'calc(0.375rem + 1px)',
                        }}>
                            <header>
                                <b><u>{ translate('Comment') }</u></b>
                            </header>
                            <div className=''><i>{
                                subjectData.comment || translate('No Comment')
                            }</i></div>
                        </div>
                    </SplitPartitioned>
                </div>
            </SplitPartitioned>
            
            <hr />

            <DefaultForm
                onSubmit={ send.exec }
                initialValues={ initialValues }
                useAjvAsync={ true }
                ajvErrorInstancePathPrefix='/payload'
            >
                { () => (
                    <>
                        <FormFields />
                        
                        <div className='d-flex justify-content-end mt-3'>
                            <Button type='submit'>
                                { translate('Save') }
                            </Button>
                        </div>
                    </>
                )}
            </DefaultForm>
        </>
    )
}

const FormFields = (ps) => {
    var translate = useUITranslation();
    var { getFieldProps } = useFormikContext();
    
    var shouldBlock = getFieldProps(
        '$.blockSubjectFromTesting.shouldBlock'
    ).value;

    return (
        <>
            <Fields.GenericEnum
                label={ translate('Reason') }
                dataXPath='$.unparticipateStatus'
                options={
                    enums.unparticipationStatus.keys
                    .reduce((acc, key) => ({
                        ...acc,
                        [key]: translate('_participationStatus_' + key)
                    }), {})
                }
            />
            <Fields.GenericEnum
                label={ translate('Block Subject') }
                dataXPath='$.blockSubjectFromTesting.shouldBlock'
                enum={{
                    keys: [ false, true ],
                    names:[
                        translate('No'),
                        translate('Yes')
                    ]
                }}
            />

            { shouldBlock && (
                <Fields.DateOnlyServerSide
                    label={ translate('Block Until') }
                    dataXPath='$.blockSubjectFromTesting.blockUntil'
                />
            )}

            <Fields.FullText
                label={ translate('Subject Comment') }
                dataXPath='$.subjectComment'
            />    
        </>
    )
}

const UnscheduleSubjectModal = WithDefaultModal({
    Body: UnscheduleSubjectModalBody,

    size: 'lg',
    title: 'Unschedule Subject',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default UnscheduleSubjectModal;
