import React from 'react';

import {
    useUIConfig,
    useUITranslation,
    useUILanguage
} from '@mpieva/psydb-ui-contexts';

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
    var config = useUIConfig();
    var [ language, setLanguage ] = useUILanguage();
    var translate = useUITranslation();

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
                    { translate('Functions') }
                </u>
            </Dropdown.Toggle>
            <Dropdown.Menu align='right'>
                <Dropdown.Item
                    as='button'
                    disabled={ !onClickForceResearchGroup }
                    onClick={ onClickForceResearchGroup }
                >
                    { translate('Select Research Group') }
                </Dropdown.Item>
                
                <Dropdown.Divider />

                { config.i18n.enableI18NSelect && (
                    <>
                        <Dropdown.Item
                            as='button'
                            onClick={ () => (
                                setLanguage(language === 'en' ? 'de' : 'en' )
                            )}
                        >
                            { translate(
                                'Language: ${lang}',
                                { lang: {
                                    'en': 'English',
                                    'de': 'Deutsch'
                                }[language] }
                            ) }
                        </Dropdown.Item>
                        
                        <Dropdown.Divider />
                    </>
                )}

                <Dropdown.Item
                    as='button'
                    disabled={ !onClickChangePassword }
                    onClick={ onClickChangePassword }
                >
                    { translate('Change Password') }
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}
