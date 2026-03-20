import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';

import { convertCRTRecordToSettings, CRTSettings }
    from '@mpieva/psydb-common-lib';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';
import { Button } from '@mpieva/psydb-ui-layout';

// XXX
import FieldPointerList from '../live-data-editor/field-pointer-list';
import EditExtraIdFieldsModal from './edit-extra-id-fields-modal';

const ImportSettings = (ps) => {
    var { record, onSuccessfulUpdate } = ps;
    var { _id } = record;

    var [{ translate }] = useI18N();
    var modal = useModalReducer();

    var crtSettings = convertCRTRecordToSettings(record);
    var crt = CRTSettings({ data: crtSettings });
    var { importSettings = {} } = crt.getRaw();
    var { extraIdFields = [] } = importSettings;

    return (
        <div>
            <EditExtraIdFieldsModal
                _id={ _id } crt={ crt }
                onSuccessfulUpdate={ onSuccessfulUpdate }
                { ...modal.passthrough }
            />
            <FieldPointerList
                dataPointers={ extraIdFields.map(it => it.pointer) }
                availableFieldDataByPointer={ keyBy({
                    items: crt.allCustomFields(),
                    byProp: 'pointer'
                }) }
            />
            <Button onClick={ modal.handleShow }>
                { translate('Edit') }
            </Button>
        </div>
    )
}

export default ImportSettings;
