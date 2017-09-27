'use strict'

/* npm modules */
const chai = require('chai')

/* application modules */
const ImmutableError = require('../lib/immutable-error')

/* chai config */
const assert = chai.assert

describe('immutable-error registered class', function () {

    var immutableError

    beforeEach(function () {
        immutableError = new ImmutableError({
            class: 'ImmutableAppComponent',
            errorCodes: {
                100: 'foo error'
            },
            nameProperty: 'foo',
        })
    })

    it('should set default class error code', function () {
        var error = immutableError.error()
        assert.strictEqual(error.message, 'ImmutableAppComponent Error')
        assert.strictEqual(error.code, 20000)
        assert.deepEqual(error.data, {})
    })

    it('should set class error code', function () {
        var error = immutableError.error(null, 100)
        assert.strictEqual(error.message, 'ImmutableAppComponent Error: foo error')
        assert.strictEqual(error.code, 20100)
        assert.deepEqual(error.data, {internalCode: 100})
    })

})