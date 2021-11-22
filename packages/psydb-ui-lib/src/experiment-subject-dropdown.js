import React, { useCallback } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

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

    experimentType,
}) => {

    var {
        _id: subjectId,
        type: subjectType
    } = subjectRecord;

    var sharedPayload = {
        subjectId,
        subjectType,
        subjectRecord
    };

    var wrappedOnClickComment = useCallback(() => (
        onClickComment(sharedPayload)
    ), [ onClickComment, subjectRecord ]);

    var wrappedOnClickMove = useCallback(() => (
        onClickMove(sharedPayload)
    ), [ onClickMove, subjectRecord ]);

    var wrappedOnClickRemove = useCallback(() => (
        onClickRemove(sharedPayload)
    ), [ onClickRemove, subjectRecord ]);

    var wrappedOnClickConfirm = useCallback(() => (
        onClickConfirm(sharedPayload)
    ), [ onClickConfirm, subjectRecord ]);

    var wrappedOnClickMailbox = useCallback(() => (
        onClickMailbox(sharedPayload)
    ), [ onClickMailbox, subjectRecord ]);

    var wrappedOnClickContactFailed = useCallback(() => (
        onClickContactFailed(sharedPayload)
    ), [ onClickContactFailed, subjectRecord ]);

    var permissions = usePermissions();
    var canComment = permissions.hasSomeLabOperationFlags({
        types: [ experimentType ],
        flags: [
            'canSelectSubjectsForExperiments',
            'canMoveAndCancelExperiments',
            'canConfirmSubjectInvitation',
        ]
    });
    var canConfirm = permissions.hasLabOperationFlag(
        'inhouse', 'canConfirmSubjectInvitation'
    )
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments',
    );

    var style = (
        variant === 'calendar'
        ? calendarStyle
        : listStyle
    )

    if (variant === 'calendar') {
        style = { ...style, }
    }

    if (!canConfirm && !canMove && !canComment) {
        return null;
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
                    disabled={ !canComment || !onClickComment }
                    onClick={ wrappedOnClickComment }
                >
                    Kommentar
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickMove }
                    onClick={ wrappedOnClickMove }
                >
                    Verschieben
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickRemove }
                    onClick={ wrappedOnClickRemove }
                >
                    Entfernen
                </Dropdown.Item>

                <Dropdown.Divider />
                
                <Dropdown.Item
                    as='button'
                    disabled={ !canConfirm || !onClickConfirm }
                    onClick={ wrappedOnClickConfirm }
                >
                    Bestätigen
                </Dropdown.Item>

                <Dropdown.Item
                    as='button'
                    disabled={ !canConfirm || !onClickMailbox }
                    onClick={ wrappedOnClickMailbox }
                >
                    Anrufbeantworter
                </Dropdown.Item>

                <Dropdown.Item
                    as='button'
                    disabled={ !canConfirm || !onClickContactFailed }
                    onClick={ wrappedOnClickContactFailed }
                >
                    Nicht Erreicht
                </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentSubjectDropdown;
