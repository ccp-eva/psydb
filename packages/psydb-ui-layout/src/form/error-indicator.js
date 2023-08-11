import React from 'react';
import { Form } from 'react-bootstrap';

export const ErrorIndicator = (ps) => {
    var { index, formikMeta = {} } = ps;
    var { error } = formikMeta;

    if (error && index >= 0) {
        error = error[index];
    }

    return (
        error && error['@@ERRORS']
        ? (
            <div className='text-danger' style={{ fontSize: '80%' }}>
                { error['@@ERRORS'].map((err, index) => (
                    <div key={ index }>
                        { createFriendlyMessage(err) }
                    </div>
                )) }
            </div>
        )
        : null
    );
}

const createFriendlyMessage = (err) => {
    var { keyword, params } = err;
    switch (keyword) {
        case 'type':
        case 'required':
            return 'Dies ist ein Plichtfeld. Bitte einen Wert eingeben.'
        case 'minLength':
            return (
                params.limit === 1
                ? 'Dies ist ein Plichtfeld. Bitte einen Wert eingeben.'
                : `Muss mindestens ${params.limit} Zeichen haben.`
            );
        case 'minItems':
            return (
                params.limit === 1
                ? 'Dies ist ein Plichtfeld. Bitte einen Wert eingeben.'
                : `Muss mindestens ${params.limit} Einträge haben.`
            );
        case 'minimum':
            return (
                params.exclusive
                ? `Muss größer als ${params.limit} sein.`
                : `Muss größer oder gleich ${params.limit} sein.`
            );
        case 'format':
            if (['mongodb-object-id'].includes(params.format)) {
                return 'Dies ist ein Plichtfeld. Bitte einen Wert eingeben.'
            }
            else {
                return err.message;
            }
        
        case 'uniqueItemProperties':
            // FIXME: this error message is basically useless
            // FIXME: also the original just says 'should pass
            // uniqteItemProperties' which is also useless
            return 'Enthält ungültige Duplikat-Daten';

        case 'FakeAjvError':
            return err.message;
        default:
            console.log(err);
            return err.message;
    }
    return message;
}
