import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { withField } from '@cdxoo/formik-utils';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import calculateAge from '@mpieva/psydb-ui-lib/src/calculate-age';
import { Pair } from '@mpieva/psydb-ui-layout';

import {
    DefaultForm,
    Fields,
} from '@mpieva/psydb-ui-lib';

const CommentField = withField({
    Control: Fields.FullText.Control,
    DefaultWrapper: 'FieldWrapperMultiline'
});

const ConfirmModal = ({
    show,
    onHide,
    modalPayloadData,
    studyId,
    locationRecord,
    selectedSubjectRecords,

    onSuccessfulUpdate
}) => {
    var { teamRecord, interval } = modalPayloadData;

    var wrappedOnSuccessfulUpdate = demuxed([
        onHide, onSuccessfulUpdate
    ]);

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
    }), { onSuccessfulUpdate: wrappedOnSuccessfulUpdate });

    var initialValues = {
        comment: ''
    };

    return (
        <Modal
            show={ show }
            onHide={ onHide }
            size='md'
        >
            <Modal.Header closeButton>
                <Modal.Title>Bestätigen</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                <DefaultForm
                    initialValues={ initialValues }
                    onSubmit={ send.exec }
                    useAjvAsync
                >
                    { (formikProps) => (
                        <>
                            <Pair label='Team'>
                                <span className='d-inline-block mr-2' style={{
                                    backgroundColor: teamRecord.state.color,
                                    height: '24px',
                                    width: '24px',
                                    verticalAlign: 'bottom',
                                }} />
                                { teamRecord.state.name }
                            </Pair>
                            <Pair label='Tag'>
                                { datefns.format(interval.start, 'cccc P')}
                            </Pair>
                            
                            <Pair label='Location'>
                                { locationRecord._recordLabel }
                            </Pair>

                            <CommentField
                                labelClassName='border-0 text-bold m-0 p-0'
                                label='Kommentar'
                                dataXPath='$.comment'
                                rows={ 3 }
                            />
                           
                            <Table size='sm' className='bg-white border mt-2'>
                                <thead>
                                    <tr>
                                        <th>Proband:in</th>
                                        <th>Alter am Tag</th>
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
                                    Bestätigen
                                </Button>
                            </div>
                        </>
                    )}
                </DefaultForm>
            </Modal.Body>
            
        </Modal>

    );
}

const WrappedConfirmModal = (ps) => {
    if (!ps.modalPayloadData) {
        return null;
    }
    return <ConfirmModal { ...ps } />
}

export default WrappedConfirmModal;
