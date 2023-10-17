import { jsonpointer } from '@mpieva/psydb-core-utils';
import { fixRelated } from '@mpieva/psydb-common-lib';
import stringifyFieldValue from './stringify-field-value';

const applyValueToDisplayFields = ({
    record,
    
    related,
    relatedRecordLabels, // FIXME
    relatedHelperSetItems, // FIXME
    relatedCustomRecordTypeLabels, // FIXME
    
    displayFieldData,

    language,
    locale,
    timezone,
}) => {

    if (!related) {
        related = fixRelated({
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        }, { isResponse: false })
    }

    return (
        displayFieldData.map(it => {
            var {
                key, type, props,
                pointer, dataPointer, // FIXME
            } = it;

            var rawValue = jsonpointer.get(record, (pointer || dataPointer));

            var str = stringifyFieldValue({
                rawValue,
                fieldDefinition: it,
   
                related,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,

                record,

                language,
                locale,
                timezone,
            });

            return {
                ...it,
                value: str
            }
        })
    )
}

export default applyValueToDisplayFields;
