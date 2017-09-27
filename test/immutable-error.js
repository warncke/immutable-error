'use strict'

/* npm modules */
const chai = require('chai')

/* application modules */
const ImmutableError = require('../lib/immutable-error')

/* chai config */
const assert = chai.assert

describe('immutable-error', function () {

    var immutableError

    beforeEach(function () {
        immutableError = new ImmutableError({
            class: 'Foo',
            errorCodes: {
                100: 'foo error'
            },
            nameProperty: 'foo',
        })
    })

    it('should instantiate new error instance', function () {
        assert.isObject(immutableError)
        assert.isFunction(immutableError.assert)
        assert.isFunction(immutableError.error)
        assert.isFunction(immutableError.throw)
    })

    it('should create a default error', function () {
        var error = immutableError.error()
        assert.strictEqual(error.message, 'Foo Error')
        assert.strictEqual(error.code, 10000)
        assert.deepEqual(error.data, {})
    })

    it('should create error with instance name', function () {
        var error = immutableError.error({foo: 'foo'})
        assert.strictEqual(error.message, 'Foo.foo Error')
        assert.strictEqual(error.code, 10000)
        assert.deepEqual(error.data, {})
    })

    it('should create error with a code and default message', function () {
        var error = immutableError.error({foo: 'foo'}, 100)
        assert.strictEqual(error.message, 'Foo.foo Error: foo error')
        assert.strictEqual(error.code, 10000)
        assert.deepEqual(error.data, {internalCode: 100})
    })

    it('should create error with a code and custom message', function () {
        var error = immutableError.error({foo: 'foo'}, 100, 'foobar')
        assert.strictEqual(error.message, 'Foo.foo Error: foobar')
        assert.strictEqual(error.code, 10000)
        assert.deepEqual(error.data, {internalCode: 100})
    })

    it('should create error with an original error', function () {
        var original = new Error('bar')

        var error = immutableError.error({foo: 'foo'}, 100, 'foobar', original)

        assert.deepEqual(error.data.original, {
            code: original.code,
            data: original.data,
            message: original.message,
            stack: original.stack,
        })
    })

    it('should create error with custom data', function () {
        var error = immutableError.error({foo: 'foo'}, 100, 'foobar', null, {foo: true})
        assert.deepEqual(error.data, {foo: true, internalCode: 100})
    })

    it('should use original error for message if none set', function () {
        var original = new Error('bar')
 
        var error = immutableError.error(null, null, null, original)
        assert.strictEqual(error.message, 'Foo Error: bar')
        assert.strictEqual(error.code, 10000)
    })

    it('should use original error for code if none set', function () {
        var original = new Error('bar')
        original.code = 100
 
        var error = immutableError.error(null, null, null, original)
        assert.strictEqual(error.message, 'Foo Error: bar')
        assert.strictEqual(error.code, 10000)
    })

    it('should not throw when assert true', function () {
        assert.doesNotThrow(function () {
            immutableError.assert(true)
        })
    })

    it('should throw when assert false', function () {
        var original = new Error('bar')

        try {
            immutableError.assert(false, {foo: 'foo'}, 100, 'foobar', original, {foo: true})
        } catch (err) {
            var error = err
        }

        assert.strictEqual(error.message, 'Foo.foo Error: foobar')
        assert.strictEqual(error.code, 10000)
        assert.strictEqual(error.data.foo, true)
        assert.strictEqual(error.data.internalCode, 100)
        assert.deepEqual(error.data.original, {
            code: original.code,
            data: original.data,
            message: original.message,
            stack: original.stack,
        })
    })

})