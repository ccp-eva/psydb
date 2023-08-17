import React, { useCallback } from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';

import {
    LinkContainer,
    Dropdown,
    Icons
} from '@mpieva/psydb-ui-layout';

var style = {
    background: 'transparent',
    color: 'inherit',
    padding: 0,
    marginTop: '1px',
    border: '1px solid transparent',
}

export const AccountFunctionDropdown = ({
    onClickForceResearchGroup,
    onClickChangePassword,
    
    disabled,
}) => {
    var [ language, setLanguage ] = useUILanguage();

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
                }} />
                <u
                    className='d-inline-block ml-1 align-middle text-primary'
                    style={{ fontSize: '1rem' }}
                >
                    Funktionen
                </u>
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
                    onClick={ () => (
                        setLanguage(language === 'en' ? 'de' : 'en' )
                    )}
                >
                    Sprache: {{ 'en': 'English', 'de': 'Deutsch' }[language]}
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
