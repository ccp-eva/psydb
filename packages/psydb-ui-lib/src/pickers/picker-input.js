import React from 'react';
import classnames from 'classnames';

import { Form, InputGroup } from '@mpieva/psydb-ui-layout';
import { EditButton, ClearButton } from './buttons';

export const PickerInput = (ps) => {
    var {
        displayValue,
        disabled,
        hasErrors,
        hasInvalidRecord,
        canClear,

        onEdit,
        onClear
    } = ps;
    
    var className = classnames([
        'border pl-3',
        !disabled && 'bg-white',
        hasErrors && 'border-danger',
        hasInvalidRecord && 'text-danger',
    ]);

    var buttonProps = {
        hasErrors,
        disabled,
    };

    return (
        <InputGroup>
            <Form.Control
                className={ className }
                value={ displayValue }
                placeholder='Bitte Datensatz wählen'
                plaintext
                readOnly
                onClick={ onEdit }
                disabled={ disabled }
            />
            <InputGroup.Append>
                <EditButton
                    { ...buttonProps }
                    onClick={ onEdit }
                />
            </InputGroup.Append>
            { canClear && (
                <InputGroup.Append>
                    <ClearButton
                        { ...buttonProps }
                        onClick={ onClear }
                    />
                </InputGroup.Append>
            )}
        </InputGroup>
    );
}
