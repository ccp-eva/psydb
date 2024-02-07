import React from 'react';
import {
    useUITranslation,
    useUILanguage
} from '@mpieva/psydb-ui-contexts';

const LanguageSelection = () => {
    var translate = useUITranslation();
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
    var [ language, setLanguage ] = useUILanguage();
    
    var isActive = ( language === code );

    var className = (
        isActive
        ? 'ml-2 text-primary text-bold cursor-default'
        : 'ml-2 text-primary cursor-pointer'
    );

    var onClick = (
        isActive
        ? undefined
        : () => setLanguage(code)
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
