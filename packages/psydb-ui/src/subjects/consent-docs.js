import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import * as StudyConsentDoc from '../study-consent-doc';
import Header from './details/header';

const SubjectConsentDocs = (ps) => {
    var { subjectId } = ps;

    return (
        <StudyConsentDoc.Routing
            subjectId={ subjectId }
            ListWrapper={ ListWrapper }
        />
    )
}

const ListWrapper = (ps) => {
    var { children } = ps;
    var translate = useUITranslation();

    return (
        <div className='border pl-3 bg-light'>
            <Header title={ translate('Consent Docs') } />
            <hr />
            <div className='pr-3 pb-3'>
                { children }
            </div>
        </div>
    )
}

export default SubjectConsentDocs;
