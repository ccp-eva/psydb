import React from 'react';
import { withField } from '@cdxoo/formik-utils';

import { calculateAge } from '@mpieva/psydb-common-lib';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import {
    WithDefaultModal,
    Table,
    Button,
    Pair,
    TeamLabel,
} from '@mpieva/psydb-ui-layout';

import {
    datefns,
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const CommentField = withField({
    Control: Fields.FullText.Control,
    DefaultWrapper: 'FieldWrapperMultiline'
});

const CreateExperimentModalBody = (ps) => {
    var {
        show,
        onHide,
        modalPayloadData,
        studyId,
        locationRecord,
        selectedSubjectRecords,

        onSuccessfulUpdate
    } = ps;

    var { teamRecord, interval } = modalPayloadData;

    var translate = useUITranslation();
    var locale = useUILocale();

    var send = useSend((formData) => ({
        type: 'experiment/create-from-awayteam-reservation',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId: teamRecord._id,
                interval,
                locationId: locationRecord._id,
                subjectIds: selectedSubjectRecords.map(it => it._id),
                comment: formData.comment
            }
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    var initialValues = {
        comment: ''
    };

    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ send.exec }
            useAjvAsync
        >
            { (formikProps) => (
                <>
                    <Pair label={ translate('Team') }>
                        <TeamLabel
                            className='text-bold'
                            { ...teamRecord.state }
                        />
                    </Pair>
                    <Pair label={ translate('Date')}>
                        { datefns.format(
                            interval.start, 'cccc P', { locale }
                        )}
                    </Pair>
                    
                    <Pair label={ translate('Location') }>
                        { locationRecord._recordLabel }
                    </Pair>

                    <CommentField
                        labelClassName='border-0 text-bold m-0 p-0'
                        label={ translate('Comment') }
                        dataXPath='$.comment'
                        rows={ 3 }
                    />
                   
                    <Table size='sm' className='bg-white border mt-2'>
                        <thead>
                            <tr>
                                <th>{ translate('Subject') }</th>
                                <th>{ translate('T-Age') }</th>
                            </tr>
                        </thead>
                        <tbody>
                            { selectedSubjectRecords.map(record => {
                                var isRed = (
                                    record._upcomingExperiments.length > 0
                                );
                                return <tr
                                    key={ record._id }
                                    className={ isRed ? 'bg-light-red' : '' }
                                >
                                    <td>
                                        { record._recordLabel }
                                    </td>
                                    <td>
                                        { calculateAge({
                                            base: record._ageFrameField,
                                            relativeTo: interval.start,
                                        })}
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </Table>

                    <div className='d-flex justify-content-end'>
                        <Button type='submit'>
                            { translate('Confirm') }
                        </Button>
                    </div>
                </>
            )}
        </DefaultForm>
    );
}

const CreateExperimentModal = WithDefaultModal({
    Body: CreateExperimentModalBody,

    size: 'md',
    title: 'Confirm',
    className: '',
    backdropClassName: '',
    bodyClassName: 'bg-light'
});

export default CreateExperimentModal;
