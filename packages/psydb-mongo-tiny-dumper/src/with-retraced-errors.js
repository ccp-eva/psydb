'use strict';

// NOTE: this is primarily used to trace mongodb driver errors
// to the correct place in our code instead of haveing the stack trace
// point to somewhere inside the mongodb driver without ever
// showing where in our code this error occured
var withRetracedErrors = async (promise) => {
    try {
        return await promise;
    }
    catch (error) {
        throw new Error(error);
    }
}

module.exports = withRetracedErrors;
