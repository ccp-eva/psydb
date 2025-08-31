'use strict';

class DriverError extends Error {
    static name = 'RequestError'

    constructor (...args) {
        var [ message, ...pass ] = args;
        super(...args);
        this.name = this.constructor.name;
        //this.message = `${this.constructor.name} : ${message}`;
        this.message = message;
    }
}

class RequestError extends DriverError {
    static name = 'RequestError'

    constructor (bag) {
        super(bag.message);
        this.httpStatusCode = bag.httpStatusCode;
        this.response = bag.response;
    }

    static fromResponse (response) {
        var { data, status } = response;
        var bag = {
            httpStatusCode: status,
            message: data,    
        }
        return new RequestError.prototype.constructor(bag);
    }
}

class ApiError extends RequestError {
    static name = 'ApiError'
    constructor (bag) {
        super({
            httpStatusCode: bag.statusCode,
            message: bag.apiMessage,
            response: bag.response,
        });

        this.httpStatus = bag.httpStatus;
        this.apiStatus = bag.apiStatus;
        this.apiMessage = bag.apiMessage;
        this.apiStack = bag.apiStack;
    }
    static fromResponse (response) {
        var { data, status } = response;
       
        var bag = {
            httpStatusCode: data?.statusCode || status,
            httpStatus: data?.status,
            
            apiStatus: data?.apiStatus,
            apiMessage: data?.data?.message,
            apiStack: data?.data?.stack,
            
            message: data?.data?.message || data,
            response: response,
        }

        return new ApiError.prototype.constructor(bag);
    }
}

module.exports = {
    DriverError,
    RequestError,
    ApiError
}
