import useWriteRequest from './use-write-request';

const useSend = (
    createMessage,
    options = {}
) => {
    var send = useWriteRequest((agent, ...args) => (
        agent.send({ message: createMessage(...args)})
    ), options);

    return send;
}

export default useSend;
