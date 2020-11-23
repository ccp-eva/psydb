'use strict';
module.exports = {
    animal: {
        chimpanzee: require('./chimpanzee-animal'),
        bonobo: require('./bonobo-animal'),
    },
    human: {
        child: require('./child-human'),
        teacher: require('./teacher-human'),
    }
}
