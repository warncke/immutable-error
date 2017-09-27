'use strict'

/* npm modules */
const _ = require('lodash')
const defined = require('if-defined')

/* exports */
module.exports = ImmutableError

// table of registered error codes
const classErrorCodes = {
    ImmutableAppComponent: 20000,
}

// do not allow class error codes to be changed
Object.freeze(classErrorCodes)

/**
 * @function ImmutableError
 *
 * return new ImmutableError instance
 *
 * @param ImmutableError
 *
 * @param {object} args
 *
 * @return {ImmutableError}
 */
function ImmutableError (args) {
    // require valid class name
    if (typeof args.class !== 'string' || !args.class.length) {
        throw new Error('valid class required')
    }
    // set class
    this.class = args.class
    // set class error code - may be undefined
    this.classErrorCode = classErrorCodes[this.class]
    // create table of codes
    this.errorCodes = {}
    // validate and set codes
    _.each(args.errorCodes, (message, code) => {
        // validate code
        if (!code.match(/^[1-9]\d\d$/)) {
            throw new Error (`invalide code ${code}`)
        }
        // set code
        this.errorCodes[code] = message
    })
    // validate name if defined
    if (defined(args.nameProperty)) {
        if (typeof args.nameProperty !== 'string' || ! args.nameProperty.length) {
            throw new Error('invalid name')
        }
        this.nameProperty = args.nameProperty
    }
}

/* public methods */
ImmutableError.prototype = {
    assert: assert,
    error: error,
    throw: _throw,
}

/**
 * @function assert
 *
 * check if asserted value is truthy. throw error if not.
 *
 * @param {boolean} assert
 * @param {any} instance
 * @param {number} code
 * @param {string} customMessage
 * @param {Error} original
 * @param {object} data
 *
 * @throws {Error}
 */
function assert (assert, instance, code, customMessage, original, data) {
    if (!assert) {
        this.throw(instance, code, customMessage, original, data)
    }
}

/**
 * @function error
 *
 * generate new error.
 *
 * @param {any} instance
 * @param {number} code
 * @param {string} customMessage
 * @param {Error} original
 * @param {object} data
 *
 * @returns {Error}
 */
function error (instance, code, customMessage, original, data) {
    // validate code
    if (defined(this.errorCodes[code])) {
        // make sure code is number
        code = parseInt(code)
    }
    // do not use code if invalid
    else {
        code = undefined
    }
    // build error message
    var message = this.class
    // add instance name if defined
    if (typeof instance === 'object' && instance && defined(this.nameProperty) && defined(instance[this.nameProperty])) {
        message += `.${instance[this.nameProperty]}`
    }
    // add error
    message += ' Error'
    // add message if defined
    if (typeof customMessage === 'string' && customMessage.length) {
        message += `: ${customMessage}`
    }
    // otherwise use default message for code if defined
    else if (defined(code)) {
        message += `: ${this.errorCodes[code]}`
    }
    // if there is no message use original
    else if (typeof original === 'object' && original) {
        message += `: ${original.message}`
    }
    // create new error
    var error = new Error(message)
    error.data = {}
    // set original in data if defined
    if (typeof original === 'object' && original) {
        error.data.original = {
            code: original.code,
            data: original.data,
            message: original.message,
            stack: original.stack,
        }
    }
    // merge any data to error
    _.merge(error.data, data)
    // set internal error code if defined
    if (defined(code)) {
        error.data.internalCode = code
    }
    // if class is registered then set class error code
    if (defined(this.classErrorCode)) {
        error.code = defined(code) ? this.classErrorCode + code : this.classErrorCode
    }
    // if class is not registered use default error code
    else {
        error.code = 10000
    }
    // return Error
    return error
}

/**
 * @function _throw
 *
 * throw an error
 *
 * @param {any} instance
 * @param {number} code
 * @param {string} customMessage
 * @param {Error} original
 * @param {object} data
 *
 * @throws {Error}
 */
function _throw (instance, code, customMessage, original, data) {
    throw this.error(instance, code, customMessage, original, data)
}