import useFetchAll from './use-fetch-all';

const useReadRecord = (options, dependencies = []) => {
    var {
        collection, recordType, id,
        shouldFetchSchema = true,
        shouldFetchCRTSettings = true,
        extraAxiosConfig,
        extraEffect,
    } = options;

    var [ didFetch, fetched ] = useFetchAll(
        (agent) => ({
            ...(shouldFetchCRTSettings && ({
                crtSettings: agent.readCRTSettings({
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
                id,
                extraAxiosConfig,
            })
        }),
        { 
            dependencies: [ collection, recordType, id, ...dependencies ],
            extraEffect
        }
    );

    if (!didFetch) {
        return [ didFetch, undefined ];
    }

    if (fetched.didReject) {
        return [ didFetch, fetched ];
    }

    var {
        didReject,
        record,
        ...related
    } = fetched.record.data;

    return [ didFetch, {
        ...(shouldFetchCRTSettings && {
            crtSettings: fetched.crtSettings.data,
        }),
        ...(shouldFetchSchema && {
            schema: fetched.schema.data
        }),
        record,
        related,
    }];
}

export default useReadRecord;
