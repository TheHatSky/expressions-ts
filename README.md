[![Build Status](https://travis-ci.org/TheHatSky/expressions-ts.svg?branch=master)](https://travis-ci.org/TheHatSky/expressions-ts)
[![Code Climate](https://codeclimate.com/github/TheHatSky/expressions-ts/badges/gpa.svg)](https://codeclimate.com/github/TheHatSky/expressions-ts)
[![Test Coverage](https://codeclimate.com/github/TheHatSky/expressions-ts/badges/coverage.svg)](https://codeclimate.com/github/TheHatSky/expressions-ts/coverage)

# Expression

TypeScript expressions interface.

`Expression<TType, TResult>` is an interface that extends `Function`. Module `Expression` contains following methods:

```typescript
/*
* Throws errors if given function is not a valid property expression.
*/
validate<TType, TResult>(exp: Expression<TType, TResult>) : void

/*
* Validates given function and applies it to `target`.
*/
apply<TType, TResult>(exp: Expression<TType, TResult>, target: TType) : TResult

/*
* Validates given function and gets property name. Useful for immutable.js.
*/
getProperty<TType, TResult>(exp: Expression<TType, TResult>) : string
```

## Install
```shell
npm install --save expressions-ts
```

## Usage

```typescript

import * as Expression from 'expression-ts'

class Model
{
    value: string;
    numberValue: number;
}

let model = new Model();
model.value = "modelThing";
model.numberValue = 12351;

const logInfo = <TResult>(exp: Expression.IExpression<Model, TResult>) =>
{
    Expression.validate(exp);

    let property = Expression.getProperty(exp);
    console.log("Expression over property: " + property);
    console.log("Has a velue ", exp(model));
}

logInfo(m => m.value)
// Expression over property: value
// Has a value "modelThing"

logInfo(m => m.numberValue)
// Expression over property: numberValue
// Has a value 12351

logInfo(m => {
    console.log("This should throw an error");
})
// Throws: "Expression is not a single return statement. ..."
```
