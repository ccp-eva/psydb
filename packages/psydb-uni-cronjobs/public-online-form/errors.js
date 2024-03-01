var { oneLine } = require('common-tags');

class RemapMailError extends Error {
    constructor (bag) {
        var { mail, pair } = bag;
        var message = oneLine`
            Cannot Remap Pair "${pair.key}=${pair.value}"
            in mail from
            "${mail.replyTo[0].name} <${mail.replyTo[0].address}>"
            received at "${mail.date.toISOString()} UTC"
            (MessageId: "${mail.messageId}")
        `
        super(message);
        this.name = 'RemapMailError';

        this.getExtraInfo = () => ({
            ...bag
        })
    }
}

module.exports = {
    RemapMailError,
}
