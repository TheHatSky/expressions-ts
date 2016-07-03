Expression
========

[![build status](https://gitlab.com/thehat/expression.ts/badges/master/build.svg)](https://gitlab.com/thehat/expression.ts/commits/master)

A wrapper over function containing property expression.

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

Usage
-----

```typescript
class Model
{
    value: string;
    numberValue: number;
}

let model = new Model();
model.value = "modelThing";
model.numberValue = 12351;

const logInfo = <TResult>(exp: Expression<Model, TResult>) =>
{
    Expression.validate(exp);

    let property = Expression.getProperty(exp);
    console.log("Expression over property: " + property);
    console.log("Has a velue ", exp(model));
}

logInfo(m => m.value)
// Expression over property: value
// Has a velue "modelThing"

logInfo(m => m.numberValue)
// Expression over property: numberValue
// Has a velue 12351

logInfo(m => {
    console.log("This should throw an error");
})
// Throws: "Expression is not a single return statement. ..."
```
