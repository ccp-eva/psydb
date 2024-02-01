import React from 'react';
import classnames from 'classnames';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Form, InputGroup, PaddedText } from '@mpieva/psydb-ui-layout';
import { EditButton, ClearButton } from './buttons';

var collectionUIMapping = {
    'subject': 'subjects',
    'subjectGroup': 'subject-groups',
    'researchGroup': 'research-groups',
    'location': 'locations',
    'study': 'studies',
    'personnel': 'personnel',
    'externalPerson': 'external-persons',
    'externalOrganization': 'external-organizations',
    'systemRole': 'system-roles',
}

export const PickerInput = (ps) => {
    var {
        collection,
        recordType,
        recordId,
        displayValue,
        disabled,
        readOnly,
        hasErrors,
        hasInvalidRecord,
        canClear,

        onEdit,
        onClear,
    } = ps;
    
    var translate = useUITranslation();

    var className = classnames([
        'pl-3',
        !readOnly && 'border',
        !disabled && !readOnly && 'bg-white',
        hasErrors && 'border-danger',
        hasInvalidRecord && 'text-danger',
    ]);

    var buttonProps = {
        hasErrors,
        disabled,
    };

    var collectionUI = collectionUIMapping[collection];
    return (
        <InputGroup>
            { readOnly ? (
                <PaddedText>
                    { recordId && collectionUI ? (
                        <a href={
                            recordType
                            ? `#/${collectionUI}/${recordType}/${recordId}`
                            : `#/${collectionUI}/${recordId}`
                        }>
                            <b style={{ fontWeight: 600 }}>{ displayValue }</b>
                        </a>
                    ) : (
                        recordId ? displayValue : translate('Not Specified')
                    )}
                </PaddedText>
            ) : (
                <Form.Control
                    className={ className }
                    value={ displayValue }
                    placeholder={ translate('_record_picker_placeholder') }
                    plaintext
                    readOnly
                    onClick={ onEdit }
                    disabled={ disabled }
                />
            )}
            { !readOnly && (
                <>
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
                </>
            )}
        </InputGroup>
    );
}
