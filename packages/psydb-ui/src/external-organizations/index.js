import React from 'react';

import {
    withCollectionView,
    withRecordTypeView
} from '@mpieva/psydb-ui-lib/src/generic-views'

import { RecordListContainer } from '@mpieva/psydb-ui-lib';

import { RecordCreator } from './record-creator';
import { RecordDetails } from './record-details';
import { RecordRemover } from './record-remover';

import EditorContainer from './editor-container';

const ExternalOrganizationTypeView = withRecordTypeView({
    RecordList: (ps) => {
        var { url, collection, recordType } = ps;
        return (
            <RecordListContainer
                linkBaseUrl={ url }
                collection={ collection }
                recordType={ recordType }
                enableView={ false }
                enableCSVExport={ true }
                enableNew={ true }
                enableEdit={ false }
                enableRecordRowLink={ true }
                canSort={ true }
            />
        );
    },
    RecordDetails,
    RecordCreator,
    RecordEditor: EditorContainer,
    RecordRemover,
});

const ExternalOrganizationCollectionView = withCollectionView({
    collection: 'externalOrganization',
    RecordTypeView: ExternalOrganizationTypeView,
});

const ExternalOrganizations = () => {
    return (
        <ExternalOrganizationCollectionView />
    );
}


export default ExternalOrganizations;
