import useFetchAll from './use-fetch-all';

const useReadRecord = (options, dependencies = []) => {
    var {
        collection, recordType, id,
        shouldFetchSchema = true,
        shouldFetchFieldDefinitions = true,
    } = options;

    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        ...(shouldFetchFieldDefinitions && ({
            fieldDefinitions: agent.readFieldDefinitions({
                collection,
                recordType,
            })
        })),
        ...(shouldFetchSchema && {
            schema: agent.readRecordSchema({
                collection,
                recordType,
            }),
        }),
        record: agent.readRecord({
            collection,
            recordType,
            id
        })
    }), [ collection, recordType, id, ...dependencies ]);

    if (!didFetch) {
        return [ didFetch, undefined ];
    }

    var {
        record,
        ...related
    } = fetched.record.data;

    return [ didFetch, {
        ...(shouldFetchSchema && {
            schema: fetched.schema.data
        }),
        record,
        related,
    }];
}

export default useReadRecord;
