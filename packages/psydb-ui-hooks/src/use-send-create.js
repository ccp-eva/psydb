import { demuxed } from '@mpieva/psydb-ui-utils';
import useSend from './use-send';

const useSendCreate = (options) => {
    var {
        collection,
        recordType,
        onSuccessfulUpdate,
        onFailedUpdate,
        additionalPayloadProps,
        autoPayload = true,
        ...otherOptions
    } = options;

    var send = useSend((data, formikBag, moreAdditionalPayloadProps) => ({
        type: (
            recordType
            ? `${collection}/${recordType}/create`
            : `${collection}/create`
        ),
        ...(autoPayload ? {
            payload: {
                props: data,
                ...additionalPayloadProps,
                ...moreAdditionalPayloadProps
            }
        } : {
            payload: data
        })
    }), {
        onSuccessfulUpdate: (response) => {
            var recordId = response.data.data.find(it => (
                it.collectionName === collection
            )).channelId;
            demuxed([ onSuccessfulUpdate ])({ id: recordId, response })
        },
        onFailedUpdate,
        ...otherOptions
    });

    return send;
}

export default useSendCreate;
