import agent from '@mpieva/psydb-ui-request-agents';

const arrify = (a) => (
    Array.isArray(a) ? a : [ a ]
);

// FIXME: since introducing dependencies i dont rally like the
// signature of that function anmoyre
// createSend({ createMessage, onXXX, dependencies }) is probably more readable
const createSend = (
    createMessage,
    options = {}
) => {
    var {
        onSuccessfulUpdate,
        onFailedUpdate,
    } = options;
   
    // FIXME: createMessage will change on every render
    // probably; so curretly the dependency checks do nothing
    var send = (...args) => {
        var message = createMessage(...args);
        
        agent.send({ message })
        .then((response) => {
            if (onSuccessfulUpdate) {
                onSuccessfulUpdate = arrify(onSuccessfulUpdate);
                for (var fn of onSuccessfulUpdate) {
                    fn(response);
                }
            }
        })
        .catch((error) => {
            if (onFailedUpdate) {
                onFailedUpdate = arrify(onFailedUpdate);
                for (var fn of onFailedUpdate) {
                    fn(error)
                }
            }
            else {
                throw error;
            }
        })
    }

    return send;
}

export default createSend;
