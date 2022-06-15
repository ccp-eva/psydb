import React, { useCallback } from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';

import {
    LinkContainer,
    Dropdown,
    Icons
} from '@mpieva/psydb-ui-layout';

var calendarStyle = {
    background: 'transparent',
    color: 'inherit',
}

var listStyle = {
    borderRadius: '.2rem',
    border: 0,
}

var labelStyle = {
    borderRadius: 0,
    border: 0,
}

var ExperimentDropdown = (ps) => {
    var {
        detailsLink,

        enableFollowUp = true,
        enableMove = true,
        enableChangeTeam = true,
        enableCancel = true,

        onClickFollowUp,
        onClickMove,
        onClickChangeTeam,
        onClickCancel,
        
        disabled,
        size='sm',
        variant = 'primary',

        experimentType,
        label
    } = ps;

    var permissions = usePermissions();

    
    var canCreateFollowUp = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canMove = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canCancel = permissions.hasLabOperationFlag(
        experimentType, 'canMoveAndCancelExperiments'
    );
    var canChangeOpsTeam = permissions.hasLabOperationFlag(
        experimentType, 'canChangeOpsTeam'
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

    return (
        <Dropdown>
            <Dropdown.Toggle
                size={ size }
                variant={ variant === 'calendar' ? 'other' : variant }
                style={ style }
                bsPrefix={
                    variant === 'calendar'
                    ? 'dropdown-toggle-no-caret'
                    : undefined
                }
                disabled={ disabled }
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
                <LinkContainer to={ detailsLink }>
                    <Dropdown.Item disabled={ !detailsLink } >
                        Details
                    </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider />
            
                { enableChangeTeam && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canChangeOpsTeam || !onClickChangeTeam }
                        onClick={ onClickChangeTeam }
                    >
                        Team ändern
                    </Dropdown.Item>
                )}

                { enableFollowUp && experimentType === 'away-team' && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canCreateFollowUp || !onClickFollowUp }
                        onClick={ onClickFollowUp }
                    >
                        Folgetermin
                    </Dropdown.Item>
                )}

                { enableMove && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canMove || !onClickMove }
                        onClick={ onClickMove }
                    >
                        Verschieben
                    </Dropdown.Item>
                )}
                
                { enableCancel && experimentType === 'away-team' && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canCancel || !onClickCancel }
                        onClick={ onClickCancel }
                    >
                        Absagen
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentDropdown;
