"use strict";
var Internals = require("./internals");
/*
 * Validates given function and applies it to `target`.
 */
exports.apply = function (expression, target) {
    exports.validate(expression);
    return expression(target);
};
/*
 * Throws errors if given function is not a valid property expression.
 */
exports.validate = function (expression) {
    var sourceCode = expression.toString();
    Internals.validate(sourceCode);
};
/*
 * Validates given function and gets property name. Useful for immutable.js.
 */
exports.getProperty = function (expression) {
    var sourceCode = expression.toString();
    return Internals.getProperty(sourceCode);
};
