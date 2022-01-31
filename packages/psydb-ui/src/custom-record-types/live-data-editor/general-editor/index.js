import React from 'react';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend, useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';

const reservationTypes = {
    'inhouse': 'Reservierbar (z.B. Instituts-Räume)',
    'away-team': 'Terminierbar (t.B. Kindergärten)',
    'no-reservation': 'Nein'
}

const GeneralEditor = (ps) => {
    var { record } = ps;
    var { collection, state: { label, reservationType }} = record;

    var modal = useModalReducer();
    return (
        <>
            <div>
                Anzeigename: { label }
            </div>
            { collection === 'location' && (
                <div>
                    Reservierung/Terminierung:
                    {' '}
                    { reservationTypes[reservationType] }
                </div>
            )}
            <div className='mt-3'>
                <Button onClick={ modal.handleShow }>
                    Edit
                </Button>
            </div>
            <Modal
                { ...ps }
                { ...modal.passthrough }
            />
        </>
    )
}

const Modal = WithDefaultModal({
    title: 'Allgemeine Einstellungen',
    size: 'lg',
    Body: (ps) => {
        var { record, onHide, onSuccessfulUpdate } = ps;
        var {
            _id,
            _lastKnownEventId,
            collection,
            state: { label, reservationType }
        } = record;

        var send = useSend((formData) => ({
            type: 'custom-record-types/set-general-data',
            payload: {
                id: _id,
                lastKnownEventId: _lastKnownEventId,
                ...formData
            }
        }), {
            onSuccessfulUpdate: demuxed([ onSuccessfulUpdate, onHide ])
        })

        var initialValues = { label, reservationType };
        return (
            <Form
                colllection={ collection }
                initialValues={ initialValues }
                onSubmit={ send.exec }
            />
        )
    }
});

const Form = (ps) => {
    var { collection, initialValues, onSubmit } = ps;
    return (
        <DefaultForm
            initialValues={ initialValues }
            onSubmit={ onSubmit }
        >
            {(formikProps) => (
                <>
                    <Fields.SaneString
                        label='Anzeigename'
                        dataXPath='$.label'
                        required
                    />
                    { collection === 'location' && (
                        <Fields.GenericEnum
                            label='Reservierung/Terminierung'
                            dataXPath='$.reservationType'
                            options={ reservationTypes }
                            required
                        />
                    )}
                    <Button type='submit'>Speichern</Button>
                </>
            )}
        </DefaultForm>
    )
}

export default GeneralEditor;
