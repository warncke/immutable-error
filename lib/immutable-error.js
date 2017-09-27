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
    this.codes = {}
    // validate and set codes
    _.each(args.codes, (message, code) => {
        // validate code
        if (!code.match(/^[1-9]\d\d$/)) {
            throw new Error (`invalide code ${code}`)
        }
        // set code
        this.codes[code] = message
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
 * @param {string} message
 * @param {Error} error
 */
function assert (assert, instance, code, message, error) {
    if (!assert) {
        this.throw(instance, code, message, error)
    }
}

/**
 * @function error
 *
 * generate new error.
 *
 * @param {any} instance
 * @param {number} code
 * @param {string} message
 * @param {Error} error
 */
function error (instance, code, message, error) {

}