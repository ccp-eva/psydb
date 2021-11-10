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

export const AccountFunctionDropdown = ({
    onClickForceResearchGroup,
    onClickChangePassword,
    
    disabled,
}) => {

    var style = calendarStyle;

    return (
        <Dropdown>
            <Dropdown.Toggle
                size='sm'
                variant={ 'other' }
                style={ style }
                bsPrefix='dropdown-toggle-no-caret'
                disabled={ disabled }
                align='end'
            >
                <Icons.GearFill className='text-primary' style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '-3px',
                }} />
            </Dropdown.Toggle>
            <Dropdown.Menu align='right'>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickForceResearchGroup }
                    onClick={ onClickForceResearchGroup }
                >
                    Forschungsgruppe wählen
                </Dropdown.Item>
                
                <Dropdown.Divider />

                <Dropdown.Item
                    as='button'
                    disabled={ !onClickChangePassword }
                    onClick={ onClickChangePassword }
                >
                    Passwort ändern
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
