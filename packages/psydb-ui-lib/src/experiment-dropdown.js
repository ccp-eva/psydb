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

var ExperimentDropdown = ({
    detailsLink,
    onClickFollowUp,
    onClickMove,
    onClickChangeTeam,
    onClickCancel,
    
    disabled,
    variant,

    experimentType,
}) => {
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
                <LinkContainer to={ detailsLink }>
                    <Dropdown.Item disabled={ !detailsLink } >
                        Details
                    </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider />
            
                <Dropdown.Item
                    as='button'
                    disabled={ !canChangeOpsTeam || !onClickChangeTeam }
                    onClick={ onClickChangeTeam }
                >
                    Team ändern
                </Dropdown.Item>

                { experimentType === 'away-team' && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canCreateFollowUp || !onClickFollowUp }
                        onClick={ onClickFollowUp }
                    >
                        Folgetermin
                    </Dropdown.Item>
                )}

                <Dropdown.Item
                    as='button'
                    disabled={ !canMove || !onClickMove }
                    onClick={ onClickMove }
                >
                    Verschieben
                </Dropdown.Item>
                
                { experimentType === 'away-team' && (
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
