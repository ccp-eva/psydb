import React, { useCallback } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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
        enableChangeLocation = true,
        enableCancel = true,

        onClickFollowUp,
        onClickMove,
        onClickChangeTeam,
        onClickChangeLocation,
        onClickCancel,
        
        disabled,
        size='sm',
        variant = 'outline-primary',

        experimentType,
        label
    } = ps;

    var translate = useUITranslation();
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
    // TODO
    //var canChangeLocation = permissions.hasLabOperationFlag(
    //    experimentType, 'canChangeLocation'
    //);
    var canChangeLocation = permissions.isRoot();


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
                    label
                    ? undefined
                    : 'dropdown-toggle-no-caret'
                }
                disabled={ disabled }
                title={ translate('Appointment Functions') }
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
                        { translate('Appointment Details') }
                    </Dropdown.Item>
                </LinkContainer>

                <Dropdown.Divider />
            
                { enableChangeTeam && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canChangeOpsTeam || !onClickChangeTeam }
                        onClick={ onClickChangeTeam }
                    >
                        { translate('Change Team') }
                    </Dropdown.Item>
                )}
                {
                    enableChangeLocation && ['inhouse', 'online-video-call'].includes(experimentType) && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canChangeLocation || !onClickChangeLocation }
                        onClick={ onClickChangeLocation }
                    >
                        { translate('Change Room') }
                    </Dropdown.Item>
                )}

                { enableFollowUp && experimentType === 'away-team' && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canCreateFollowUp || !onClickFollowUp }
                        onClick={ onClickFollowUp }
                    >
                        { translate('Follow-Up Appointment') }
                    </Dropdown.Item>
                )}

                { enableMove && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canMove || !onClickMove }
                        onClick={ onClickMove }
                    >
                        { translate('Reschedule') }
                    </Dropdown.Item>
                )}
                
                { enableCancel && experimentType === 'away-team' && (
                    <Dropdown.Item
                        as='button'
                        disabled={ !canCancel || !onClickCancel }
                        onClick={ onClickCancel }
                    >
                        { translate('Cancel') }
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentDropdown;
