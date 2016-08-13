"use strict";
var Internals = require("./internals");
exports.apply = function (expression, target) {
    exports.validate(expression);
    return expression(target);
};
exports.validate = function (expression) {
    var sourceCode = expression.toString();
    Internals.validate(sourceCode);
};
exports.getProperty = function (expression) {
    var sourceCode = expression.toString();
    return Internals.getProperty(sourceCode);
};
