import React from 'react';
import { useParams } from 'react-router-dom';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    SplitPartitioned,
    DetailsBox,
} from '@mpieva/psydb-ui-layout';

import * as Themes from '@mpieva/psydb-ui-lib/data-viewer-themes';
import { CSVImport } from '@mpieva/psydb-ui-lib/data-viewers';

import RelatedSubjects from './related-subjects';

const Details = (ps) => {
    var { id: csvImportId } = useParams();
    var translate = useUITranslation();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCSVSubjectImport({ id: csvImportId })
    ), [ csvImportId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, related } = fetched.data;
    var csvImportBag = {
        theme: Themes.HorizontalSplit,
        value: record,
        related
    }

    var title = translate('CSV Import Details')
    return (
        <>
            <CSVImport { ...csvImportBag }>
                <DetailsBox title={ title }>
                    <SplitPartitioned partitions={[ 1,1 ]}>
                        <div>
                            <CSVImport.SubjectType __useNewRelated />
                        </div>
                        <div>
                            <CSVImport.CreatedAt />
                            <CSVImport.CreatedBy __useNewRelated />
                        </div>
                    </SplitPartitioned>
                </DetailsBox>
            </CSVImport>
            
            <div className='mt-4'>
                <RelatedSubjects
                    csvImportId={ csvImportId }
                />
            </div>
        </>
    )
}

export default Details;
