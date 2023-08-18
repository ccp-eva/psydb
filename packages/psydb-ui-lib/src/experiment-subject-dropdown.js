import React, { useCallback } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

var labelStyle = {
    borderRadius: 0,
    border: 0,
}

var ExperimentSubjectDropdown = (ps) => {
    var {
        subjectRecord,
        enableStatusChanges = true,

        onClickComment,
        onClickMove,
        onClickFollowUp,
        onClickRemove,

        onClickConfirm,
        onClickMailbox,
        onClickContactFailed,

        enableSubjectDetailsLink = true,
        disabled,
        size='sm',
        variant = 'outline-primary',

        experimentType,
        label,
    } = ps;

    var {
        _id: subjectId,
        type: subjectType
    } = subjectRecord;

    var sharedPayload = {
        subjectId,
        subjectType,
        subjectRecord,
        experimentType,
    };

    var wrappedOnClickComment = useCallback(() => (
        onClickComment(sharedPayload)
    ), [ onClickComment, subjectRecord ]);

    var wrappedOnClickMove = useCallback(() => (
        onClickMove(sharedPayload)
    ), [ onClickMove, subjectRecord ]);

    var wrappedOnClickFollowUp = useCallback(() => (
        onClickFollowUp(sharedPayload)
    ), [ onClickFollowUp, subjectRecord ]);

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

    var translate = useUITranslation();
    var permissions = usePermissions();
    var canViewSubject = permissions.hasCollectionFlag(
        'subject', 'read'
    );
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
    var canFollowUp = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments',
    );

    var style = (
        label ? labelStyle : (
            variant === 'calendar'
            ? calendarStyle
            : listStyle
        )
    );

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
                variant={ variant === 'calendar' ? 'other' : variant }
                style={ style }
                bsPrefix={
                    label
                    ? undefined
                    : 'dropdown-toggle-no-caret'
                }
                disabled={ disabled }
                title={ translate('Subject Functions for Appointment') }
            >
                { 
                    label 
                    ? (
                        <span className='d-inline-block mr-1'>
                            { label }
                        </span>
                    )
                    : (
                        <Icons.GearFill style={{
                            width: '18px',
                            height: '18px',
                            marginTop: '-3px',
                        }} />
                    )
                }
            </Dropdown.Toggle>
            <Dropdown.Menu>
                { enableSubjectDetailsLink && (
                    <>
                        <Dropdown.Item
                            as='a'
                            disabled={ !canViewSubject }
                            href={`#/subjects/${subjectType}/${subjectId}`}
                        >
                            { translate('Subject Details') }
                        </Dropdown.Item>
                        <Dropdown.Divider />
                    </>
                )}
                <Dropdown.Item
                    as='button'
                    disabled={ !canComment || !onClickComment }
                    onClick={ wrappedOnClickComment }
                >
                    { translate('Comment') }
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickMove }
                    onClick={ wrappedOnClickMove }
                >
                    { translate('Reschedule') }
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickFollowUp }
                    onClick={ wrappedOnClickFollowUp }
                >
                    { translate('Follow-Up Appointment') }
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickRemove }
                    onClick={ wrappedOnClickRemove }
                >
                    { translate('Remove') }
                </Dropdown.Item>

                { enableStatusChanges && (
                    <>
                        <Dropdown.Divider />
                        
                        <Dropdown.Item
                            as='button'
                            disabled={ !canConfirm || !onClickConfirm }
                            onClick={ wrappedOnClickConfirm }
                        >
                            { translate('Confirm') }
                        </Dropdown.Item>

                        <Dropdown.Item
                            as='button'
                            disabled={ !canConfirm || !onClickMailbox }
                            onClick={ wrappedOnClickMailbox }
                        >
                            { translate('Mailbox') }
                        </Dropdown.Item>

                        <Dropdown.Item
                            as='button'
                            disabled={ !canConfirm || !onClickContactFailed }
                            onClick={ wrappedOnClickContactFailed }
                        >
                            { translate('Failed to Contact') }
                        </Dropdown.Item>
                    </>
                )}

            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentSubjectDropdown;
