import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { FormBox, Icons } from '@mpieva/psydb-ui-layout';

export const DefaultRecordRemoverSuccessInfo = (ps) => {
    var { title, blurp, successInfoBackLink } = ps;
    var [{ translate }] = useI18N();
    return (
        <FormBox titleClassName='text-success' title={ title }>
            <i>{ blurp }</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>{ translate('Back to List') }</b>
                    </a>
                </>
            )}
        </FormBox>
    )
}
