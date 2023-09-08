import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

import {
    WithDefaultModal,
    LoadingIndicator,
    SplitPartitioned,
    PaddedText,
    Container,
} from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
    FormBox,
} from '@mpieva/psydb-ui-lib';

import StudyTeamListItem from '@mpieva/psydb-ui-lib/src/experiment-operator-team-list-item';

export const ChangeExperimentStudyContainer = (ps) => {
    var translate = useUITranslation();
    var modal = useModalReducer();

    return (
        <>
            <Button
                size='sm'
                className='mr-3'
                onClick={ modal.handleShow }
            >
                { translate('Change Study') }
            </Button>
            <ChangeExperimentStudyModal
                { ...modal.passthrough }
                { ...ps }
            />
        </>
    );
};

const ChangeExperimentStudyModalBody = (ps) => {
    var {
        onHide,
        experimentData,
        opsTeamData,
        onSuccessfulUpdate,
    } = ps;
    
    var translate = useUITranslation();

    var send = useSend((formData) => ({
        type: 'experiment/change-study',
        payload: {
            experimentId: experimentData.record._id,
            ...formData
        }
    }), { onSuccessfulUpdate: demuxed([
        onHide, onSuccessfulUpdate
    ]) });

    var studyLabel = (
        experimentData.relatedRecords.study[experimentData.record.state.studyId]._recordLabel
    )

    return (
        <div className='mt-3'>

            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border mb-3'>
                <Pair label={ translate('Study') }>
                    { studyLabel }
                </Pair>
                <Pair label='Team'>
                    <span className='d-inline-block mr-2' style={{
                        backgroundColor: opsTeamData.record.state.color,
                        height: '24px',
                        width: '24px',
                        verticalAlign: 'bottom',
                    }} />
                    { opsTeamData.record.state.name }
                </Pair>
            </div>

            <header className='pb-1'><b>
                { translate('Change To') }
            </b></header>
            <DefaultForm
                initialValues={{}}
                onSubmit={ send.exec }
                useAjvAsync
                ajvErrorInstancePathPrefix = '/payload'
            >
                {(formikProps) => {
                    var { values, setFieldValue } = formikProps;
                    var { studyId, labTeamId } = values['$'];
                    return <>
                        <div className='pt-3 bg-white border'>
                            <Fields.ForeignId
                                label={ translate('Study') }
                                dataXPath='$.studyId'
                                collection='study'
                                extraOnChange={(nextStudyId) => {
                                    setFieldValue('$.labTeamId', undefined)
                                }}
                            />
                            { studyId && (
                                <FormPair label={ translate('Team') }>
                                    <TeamList {...({
                                        studyId,
                                        selectedTeamId: labTeamId,
                                        onSelectTeam: (value) => (
                                            setFieldValue('$.labTeamId', value)
                                        ),
                                    }) } />
                                </FormPair>
                            )}
                        </div>
                        <div className='mt-3 d-flex justify-content-end'>
                            <Button
                                type='submit'
                                disabled={ !(studyId && labTeamId ) }
                            >
                                { translate('Save') }
                            </Button>
                        </div>
                    </>
                }}
            </DefaultForm>
        </div>
    );
}

// FIXME: make formik field
const TeamList = ({
    studyId,
    selectedTeamId,
    onSelectTeam,
}) => {

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentOperatorTeamsForStudy({
            studyId,
        });
    }, [ studyId ]);

    if (!didFetch) {
        return (
            <LoadingIndicator size='lg' />
        ) 
    }

    var { records } = fetched.data;

    return (
        <>
            { 
                records
                .filter(it => it.state.hidden !== true)
                .map(record => (
                    <StudyTeamListItem {...({
                        key: record._id,
                        studyId,
                        record,
                        //relatedRecordLabels,
                        onClick: onSelectTeam,
                        active: record._id === selectedTeamId
                        //onEditClick: handleShowEditModal,
                        //onDeleteClick,
                        //enableDelete
                    })} />
                ))
            }
        </>
    );
}

const FormPair = (ps) => {
    var { label, children } = ps;
    return (
        <div className='mb-3'>
            <SplitPartitioned partitions={[ 3, 9 ]}>
                <PaddedText style={{
                    paddingLeft: '15px',
                    paddingRight: '15px'
                }}>
                    { label }
                </PaddedText>
                <div>
                    { children }
                </div>
            </SplitPartitioned>
        </div>
    )
}

const Pair = (ps) => {
    var { label, children } = ps;
    return (
        <SplitPartitioned partitions={[ 3, 9 ]}>
            <PaddedText style={{
                paddingLeft: '15px',
                paddingRight: '15px'
            }}>
                { label }
            </PaddedText>
            <PaddedText>
                { children }
            </PaddedText>
        </SplitPartitioned>
    )
}

const ChangeExperimentStudyModal = WithDefaultModal({
    title: 'Change Study',
    size: 'lg',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: ChangeExperimentStudyModalBody,
});

