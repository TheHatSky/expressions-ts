/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/expression.ts" />

class A
{
    value: string;
    func: () => {};
}

describe("An arrow expression source code", () => 
{
    it("should cause an error if it isn't a valid arrow function.", () =>
    {
        let sourceCode = "some => some.simpleString =>";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Source code contains too much arrows (=>). Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain arrow.", () =>
    {
        let sourceCode = "some some.simpleString";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Source code doesn't contain arrow (=>). Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain token.", () =>
    {
        let sourceCode = " => some.simpleString";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression token is empty.");
    });

    it("should cause an error if doesn't contain body.", () =>
    {
        let sourceCode = "some => ";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is empty.");
    });

    it("should cause an error if body is not correlated to token.", () =>
    {
        let sourceCode = "some => test.test";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not correlated to token. Body: \"test.test\", token: \"some\".");
    });

    it("should cause an error if body is not a property expression", () =>
    {
        let sourceCode = "some => test";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not a property expression. Body: \"test\".");
    });

    it("should cause an error if body is not a simple property expression", () =>
    {
        let sourceCode = "some => some.test.test2";

        let isValidArrowFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not a simple property expression. Body: \"some.test.test2\".");
    });

    it("should be a valid arrow function.", () =>
    {
        let sourceCode = "some => some.simpleString";

        let validateFunc = () => Expression.__Internals.validateLambda(sourceCode);

        expect(validateFunc).not.toThrow();
    });
});

describe("An es3 function expression source code", () => 
{
    it("should cause an error if it isn't a valid function.", () =>
    {
        let sourceCode = "fun (some) { return some.simpleString }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Expression is not a function. Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain (.", () =>
    {
        let sourceCode = "function x) { return some.simpleString }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Expression is not a function. Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain ).", () =>
    {
        let sourceCode = "function (x { return some.simpleString }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Expression is not a function. Code: "${sourceCode}".`);
    });

    it("should cause an error if contains many arguments.", () =>
    {
        let sourceCode = "function (test, test2) { return some.simpleString }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Expression is not a single argument function. Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain argument.", () =>
    {
        let sourceCode = "function () { return some.simpleString }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression token is empty.");
    });

    it("should cause an error if doesn't contain return statement.", () =>
    {
        let sourceCode = "function (text) { test(); }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError(`Expression is not a single return statement. Code: "${sourceCode}".`);
    });

    it("should cause an error if doesn't contain body.", () =>
    {
        let sourceCode = "function (text) { return; }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is empty.");
    });

    it("should cause an error if body is not correlated to token.", () =>
    {
        let sourceCode = "function (some) { return test.test; }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not correlated to token. Body: \"test.test\", token: \"some\".");
    });

    it("should cause an error if body is not a property expression.", () =>
    {
        let sourceCode = "function (some) { return test; }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not a property expression. Body: \"test\".");
    });

    it("should cause an error if body is not a simple property expression.", () =>
    {
        let sourceCode = "function (some) { return some.test.test2; }";

        let isValidArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(isValidArrowFunc).toThrowError("Expression body is not a simple property expression. Body: \"some.test.test2\".");
    });

    it("should be a valid function.", () =>
    {
        let sourceCode = "function (some) { return some.test; }";

        let validateArrowFunc = () => Expression.__Internals.validateFunction(sourceCode);

        expect(validateArrowFunc).not.toThrow();
    });
});

describe("An expression", () =>
{
    it("should not be a function call.", () =>
    {
        let expression: Expression<A, void> = (target) => target.func();

        let isValid = () => Expression.validate(expression);

        expect(isValid).toThrowError("Invalid property expression. Body: \"target.func()\".");
    });

    it("should not be an assignment statement.", () =>
    {
        let expression: Expression<A, void> = (target) => target.value = "asd";

        let isValid = () => Expression.validate(expression);

        expect(isValid).toThrowError("Invalid property expression. Body: \"target.value = \"asd\"\".");
    });
});
