import * as Internals from "./internals"

export interface IExpression<TType, TResult>
{
    (target: TType): TResult;
}

/*
 * Validates given function and applies it to `target`.
 */
export const apply = <TType, TResult>(expression: IExpression<TType, TResult>, target: TType) => 
{
    validate(expression);
    return expression(target);
}

/*
 * Throws errors if given function is not a valid property expression.
 */
export const validate = <TType, TResult>(expression: IExpression<TType, TResult>) =>
{
    let sourceCode = expression.toString();
    Internals.validate(sourceCode);
}

/*
 * Validates given function and gets property name. Useful for immutable.js.
 */
export const getProperty = <TType, TResult>(expression: IExpression<TType, TResult>) =>
{
    let sourceCode = expression.toString();
    return Internals.getProperty(sourceCode);
}
