import React, { useCallback } from 'react';

import {
    Dropdown,
    Icons,
} from '@mpieva/psydb-ui-layout';

var calendarStyle = {
    background: 'transparent',
    color: 'inherit',
}

var listStyle = {
    borderRadius: '.2rem',
    border: 0,
    marginTop: '-3px',
}

var ExperimentSubjectDropdown = ({
    subjectRecord,
    
    onClickComment,
    onClickMove,
    onClickRemove,

    onClickConfirm,
    onClickMailbox,
    onClickContactFailed,

    disabled,
    variant,
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

    var wrappedOnClickConfirm = useCallback(() => (
        onClickConfirm({ subjectId, subjectType })
    ), [ onClickConfirm ]);

    var wrappedOnClickMailbox = useCallback(() => (
        onClickMailbox({ subjectId, subjectType })
    ), [ onClickMailbox ]);

    var wrappedOnClickContactFailed = useCallback(() => (
        onClickContactFailed({ subjectId, subjectType })
    ), [ onClickContactFailed ]);

    var style = (
        variant === 'calendar'
        ? calendarStyle
        : listStyle
    )

    if (variant === 'calendar') {
        style = { ...style, }
    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                size='sm'
                variant={ variant === 'calendar' ? 'other' : 'outline-primary' }
                style={ style }
                bsPrefix='dropdown-toggle-no-caret'
                disabled={ disabled }
            >
                <Icons.GearFill style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '-3px',
                }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickComment }
                    onClick={ wrappedOnClickComment }
                >
                    Kommentar
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickMove }
                    onClick={ wrappedOnClickMove }
                >
                    Verschieben
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickRemove }
                    onClick={ wrappedOnClickRemove }
                >
                    Entfernen
                </Dropdown.Item>

                <Dropdown.Divider />
                
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickConfirm }
                    onClick={ wrappedOnClickConfirm }
                >
                    Bestätigen
                </Dropdown.Item>

                <Dropdown.Item
                    as='button'
                    disabled={ !onClickMailbox }
                    onClick={ wrappedOnClickMailbox }
                >
                    Anrufbeantworter
                </Dropdown.Item>

                <Dropdown.Item
                    as='button'
                    disabled={ !onClickContactFailed }
                    onClick={ wrappedOnClickContactFailed }
                >
                    Nicht Erreicht
                </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentSubjectDropdown;
