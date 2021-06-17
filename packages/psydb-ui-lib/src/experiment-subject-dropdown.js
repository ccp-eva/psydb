import React, { useCallback } from 'react';

import { Dropdown } from 'react-bootstrap';
import { GearFill } from 'react-bootstrap-icons';

var ExperimentSubjectDropdown = ({
    subjectRecord,
    onClickComment,
    onClickMove,
    onClickRemove,

    disabled
}) => {

    var {
        _id: subjectId,
        type: subjectType
    } = subjectRecord;

    var wrappedOnClickComment = useCallback(() => (
        onClickComment({ subjectId, subjectType })
    ), [ onClickComment ]);

    var wrappedOnClickMove = useCallback(() => (
        onClickMove({ subjectId, subjectType })
    ), [ onClickMove ]);

    var wrappedOnClickRemove = useCallback(() => (
        onClickRemove({ subjectId, subjectType })
    ), [ onClickRemove ]);

    return (
        <Dropdown>
            <Dropdown.Toggle
                size='sm'
                variant='outline-primary'
                style={{
                    borderRadius: '.2rem',
                    border: 0,
                }}
                bsPrefix='dropdown-toggle-no-caret'
                disabled={ disabled }
            >
                <GearFill style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '-3px',
                }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item as='button' onClick={ wrappedOnClickComment }>
                    Kommentar
                </Dropdown.Item>
                <Dropdown.Item as='button' onClick={ wrappedOnClickMove }>
                    Verschieben
                </Dropdown.Item>
                <Dropdown.Item as='button' onClick={ wrappedOnClickRemove }>
                    Entfernen
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentSubjectDropdown;
