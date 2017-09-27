# immutable-error

Immutable Error provides harmonized error generator for modules in the
[Immutable App](https://www.npmjs.com/package/immutable-app) ecosystem.

## Creating a new error generator instance

    var immutableError = new ImmutableError({
        class: 'Foo',
        errorCodes: {
            100: 'foo error'
        },
        nameProperty: 'foo',
    })

ImmutableError must be instantiated with an object containing the configuration
options for the error generator.

The `class` property will be used as a prefix for all error messages.

The `codes` object defines a mapping of error codes to default error messages.
Error codes must start at a number grater than 100 with a maximum length of
three digits.

The `nameProperty` property will be used to get the name of the instance that
the error occured with if both are set.

## error

    var error = immutableError.error(this, 100, 'foo error', err, {foo: true})

The `error` method generates and returns a new Error.

The arguments to error are:

* instance - the instance (this) context that the error occurred in
* code - the error code
* message - a custom error message
* error - the original Error object if re-throwing a caught error
* data - any additional error data to include

All arguments are optional and an error will always be generated.

## assert

    immutableError.assert(foo === true, this, 100)

The `assert` method will evaluate its first argument and throw an error if it does
not evaluate as truthy.

The subsequent arguments to assert will be passed to error to generate the
Error.

Unlike `error` the `assert` method will throw the Error.

## throw

    immutableError.throw(this, 100)

The `throw` method calls `error` with the passed arguments and throws the
generated error.

## Generating an error without an instance

    var error = immutableError.error(null, 100)

If an error is being generated outside of the context of a specific class
instance then null should be passed as the first argument.

## Generating an error without a code

    var error = immutableError.error(this, null, 'foo')

If a code is not available for the error null or 0 should be used.

## Generating an error with a custom error message

    var error = immutableError.error(this, 100, 'custom error message')

A custom error can be passed as the third argument. If this argument is not a
string it will not be used.

## Generating an error from an existing error object

    try {
        ...
    } catch (err) {
        var error = immutableError.error(this, 100, null, err)
    }

When catching and rethrowing an error pass the original error as the fourth
argument and it will be added to the data of the error that is generated.

## Error codes

The error codes defined by modules must be three digits starting with 100.

The error code will be used to lookup the default message for the error.

For registered classes the error code will be appended to a two digit prefix
that identifies the class that generated the error.

If the class generating the error is not registered then the error code will
always be 10000.

For classes that are registered where an error code is not specified the
error code will be the class prefix followed by three zeros.

The three digit error code will always be stored in `error.data.internalCode`.

### Registered classes

| base code | class                                                            |
|-----------|------------------------------------------------------------------|
| 20000     | ImmutableAppComponent                                            |