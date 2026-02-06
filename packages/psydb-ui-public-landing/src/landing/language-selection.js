import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';

const LanguageSelection = () => {
    var [{ translate }] = useI18N();
    return (
        <div className='mt-1 d-flex justify-content-end'>
            <span>{ translate('Language') }:</span>
            <LangButton code='en' />
            <LangButton code='de' />
        </div>
    )
}

const LangButton = (ps) => {
    var { code } = ps;
    var [ i18n, setI18N ] = useI18N();
    
    var isActive = ( i18n.language === code );

    var className = (
        isActive
        ? 'ml-2 text-primary text-bold cursor-default'
        : 'ml-2 text-primary cursor-pointer'
    );

    var onClick = (
        isActive
        ? undefined
        : () => setI18N({ language: code })
    );

    var bag = {
        className,
        onClick
    }

    return (
        <span { ...bag  }>{ code.toUpperCase() }</span>
    )
}

export default LanguageSelection;
