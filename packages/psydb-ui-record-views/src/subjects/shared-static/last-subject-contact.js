import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';

const LastSubjectContact = (ps) => {
    var { show, value, uiSplit=[ 3, 9 ], className='px-3' } = ps;
    var [{ translate, locale }] = useI18N();
    
    if (!show) {
        return null;
    }

    var [ wLeft, wRight ] = uiSplit;
    return (
        <Pair 
            label={ translate('Last Contact') }
            wLeft={ wLeft } wRight={ wRight } className={ className }
        >
            { value ? (
                <span>
                    { datefns.format(new Date(value.contactedAt), 'P p', { locale }) }
                    {' '}
                    ({ value.type })
                </span>
            ) : (
                <i className='text-lightgrey'>{ translate('Not Found') }</i>
            )}
        </Pair>
    );
}

export default LastSubjectContact;
