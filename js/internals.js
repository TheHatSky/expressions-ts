"use strict";
var ArrowToken = "=>";
var FunctionToken = "function";
var ReturnToken = "return";
exports.validate = function (sourceCode) {
    if (isLambda(sourceCode))
        exports.validateLambda(sourceCode);
    else
        exports.validateFunction(sourceCode);
};
exports.getProperty = function (sourceCode) {
    var expressionParts;
    if (isLambda(sourceCode))
        expressionParts = getLambdaExpressionParts(sourceCode);
    else
        expressionParts = getFunctionExpressionParts(sourceCode);
    return getPropertyFromParts(expressionParts);
};
var isLambda = function (sourceCode) {
    return sourceCode.indexOf(ArrowToken) >= 0;
};
exports.validateLambda = function (sourceCode) {
    var expressionParts = getLambdaExpressionParts(sourceCode);
    validatePropertyExpressionBody(expressionParts);
};
var getLambdaExpressionParts = function (sourceCode) {
    var parts = sourceCode
        .split(ArrowToken)
        .map(function (part) { return part.trim(); });
    if (parts.length == 1)
        throw new Error("Source code doesn't contain arrow (" + ArrowToken + "). Code: \"" + sourceCode + "\".");
    if (parts.length >= 3)
        throw new Error("Source code contains too much arrows (" + ArrowToken + "). Code: \"" + sourceCode + "\".");
    var token = parts[0];
    var propertyExpressionBody = parts[1];
    return {
        token: token,
        propertyExpressionBody: propertyExpressionBody
    };
};
exports.validateFunction = function (sourceCode) {
    var expressionParts = getFunctionExpressionParts(sourceCode);
    validatePropertyExpressionBody(expressionParts);
};
var getFunctionExpressionParts = function (sourceCode) {
    // "function (x){ return x.test; }"
    var code = sourceCode.trim();
    if (code.indexOf(FunctionToken) != 0)
        throw Error("Expression is not a function. Code: \"" + sourceCode + "\".");
    code = code
        .substr(FunctionToken.length)
        .trim();
    // "(x){ return x.test; }"
    if (code.indexOf("(") != 0)
        throw Error("Expression is not a function. Code: \"" + sourceCode + "\".");
    var indexOfTokenEnd = code.indexOf(")");
    if (indexOfTokenEnd < 0)
        throw Error("Expression is not a function. Code: \"" + sourceCode + "\".");
    var token = code.substr(1, indexOfTokenEnd - 1);
    if (token.indexOf(",") >= 0)
        throw Error("Expression is not a single argument function. Code: \"" + sourceCode + "\".");
    var body = code
        .substr(indexOfTokenEnd + 1)
        .replace("{", "")
        .replace("}", "")
        .replace(";", "")
        .trim();
    // "return x.test"
    if (body.indexOf(ReturnToken) < 0)
        throw Error("Expression is not a single return statement. Code: \"" + sourceCode + "\".");
    body = body
        .substr(ReturnToken.length)
        .trim();
    // "x.test"
    return {
        token: token,
        propertyExpressionBody: body
    };
};
var validatePropertyExpressionBody = function (expressionParts) {
    if (!expressionParts.token)
        throw new Error("Expression token is empty.");
    if (!expressionParts.propertyExpressionBody)
        throw new Error("Expression body is empty.");
    var property = getPropertyFromParts(expressionParts);
    if (!property)
        throw new Error("Expression body has no property.");
};
var getPropertyFromParts = function (expressionParts) {
    if (!expressionParts.token)
        throw new Error("Expression token is empty.");
    if (!expressionParts.propertyExpressionBody)
        throw new Error("Expression body is empty.");
    var parts = expressionParts.propertyExpressionBody
        .split(".")
        .map(function (part) { return part.trim(); });
    if (parts.length == 1)
        throw new Error("Expression body is not a property expression. Body: \"" + expressionParts.propertyExpressionBody + "\".");
    if (parts.length >= 3)
        throw new Error("Expression body is not a simple property expression. Body: \"" + expressionParts.propertyExpressionBody + "\".");
    var expressionToken = parts[0];
    var property = parts[1];
    if (expressionParts.token != expressionToken)
        throw new Error("Expression body is not correlated to token. Body: \"" + expressionParts.propertyExpressionBody + "\", token: \"" + expressionParts.token + "\".");
    var restrictedSymbols = [",", "(", ")", "{", "}", "+", "-", "!", "?", "<", ">", "*", "/", "="];
    restrictedSymbols.forEach(function (symbol) {
        if (property.indexOf(symbol) >= 0)
            throw new Error("Invalid property expression. Body: \"" + expressionParts.propertyExpressionBody + "\".");
    });
    return property;
};
