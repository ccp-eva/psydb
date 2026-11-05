import { jsonpointer, convertPathToPointer } from '@mpieva/psydb-core-utils';

const getFieldValue = (formValues, dataXPath) => {
    return jsonpointer.get(
        formValues,
        convertPathToPointer(dataXPath)
    );
}

export default getFieldValue;
