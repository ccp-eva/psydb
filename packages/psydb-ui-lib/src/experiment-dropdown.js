import React, { useCallback } from 'react';
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
    onClickMove,
    onClickChangeTeam,
    
    disabled,
    variant,
}) => {

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
                    disabled={ !onClickMove }
                    onClick={ onClickMove }
                >
                    Verschieben
                </Dropdown.Item>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickChangeTeam }
                    onClick={ onClickChangeTeam }
                >
                    Team ändern
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default ExperimentDropdown;
