interface Expression<TType, TResult>
{
    (target: TType): TResult;
}

module Expression
{
    /*
     * Validates given function and applies it to `target`.
     */
    export const apply = <TType, TResult>(expression: Expression<TType, TResult>, target: TType) => 
    {
        validate(expression);
        return expression(target);
    }

    /*
     * Throws errors if given function is not a valid property expression.
     */
    export const validate = <TType, TResult>(expression: Expression<TType, TResult>) =>
    {
        let sourceCode = expression.toString();
        __Internals.validate(sourceCode);
    }

    /*
     * Validates given function and gets property name. Useful for immutable.js.
     */
    export const getProperty = <TType, TResult>(expression: Expression<TType, TResult>) =>
    {
        let sourceCode = expression.toString();
        return __Internals.getProperty(sourceCode);
    }

    export namespace __Internals
    {
        const ArrowToken = "=>";
        const FunctionToken = "function";
        const ReturnToken = "return";

        interface ExpressionParts
        {
            token: string;
            propertyExpressionBody: string;
        }

        export const validate = (sourceCode: string) =>
        {
            if (isLambda(sourceCode))
                validateLambda(sourceCode);
            else 
                validateFunction(sourceCode);
        }

        export const getProperty = (sourceCode: string) =>
        {
            let expressionParts: ExpressionParts;

            if (isLambda(sourceCode))
                expressionParts = getLambdaExpressionParts(sourceCode);
            else 
                expressionParts = getFunctionExpressionParts(sourceCode);

            return getPropertyFromParts(expressionParts);
        }

        const isLambda = (sourceCode: string) =>
        {
            return sourceCode.indexOf(ArrowToken) >= 0;
        }

        export const validateLambda = (sourceCode: string) =>
        {
            let expressionParts = getLambdaExpressionParts(sourceCode);

            validatePropertyExpressionBody(expressionParts);
        }

        const getLambdaExpressionParts = (sourceCode: string): ExpressionParts =>
        {
            let parts = sourceCode
                .split(ArrowToken)
                .map(part => part.trim());

            if (parts.length == 1)
                throw new Error(`Source code doesn't contain arrow (${ArrowToken}). Code: "${sourceCode}".`);
            if (parts.length >= 3)
                throw new Error(`Source code contains too much arrows (${ArrowToken}). Code: "${sourceCode}".`);

            let token = parts[0];
            let propertyExpressionBody = parts[1];

            return {
                token: token,
                propertyExpressionBody: propertyExpressionBody
            };
        }

        export const validateFunction = (sourceCode: string) =>
        {
            let expressionParts = getFunctionExpressionParts(sourceCode);

            validatePropertyExpressionBody(expressionParts);
        }

        const getFunctionExpressionParts = (sourceCode: string) : ExpressionParts =>
        {
            // "function (x){ return x.test; }"

            let code = sourceCode.trim();
            if (code.indexOf(FunctionToken) != 0)
                throw Error(`Expression is not a function. Code: "${sourceCode}".`);

            code = code
                .substr(FunctionToken.length)
                .trim();
            // "(x){ return x.test; }"

            if (code.indexOf("(") != 0)
                throw Error(`Expression is not a function. Code: "${sourceCode}".`);

            let indexOfTokenEnd = code.indexOf(")");
            if (indexOfTokenEnd < 0)
                throw Error(`Expression is not a function. Code: "${sourceCode}".`);

            let token = code.substr(1, indexOfTokenEnd - 1);
            if (token.indexOf(",") >= 0)
                throw Error(`Expression is not a single argument function. Code: "${sourceCode}".`);
            
            let body = code
                .substr(indexOfTokenEnd + 1)
                .replace("{", "")
                .replace("}", "")
                .replace(";", "")
                .trim();
            // "return x.test"

            if (body.indexOf(ReturnToken) < 0)
                throw Error(`Expression is not a single return statement. Code: "${sourceCode}".`);

            body = body
                .substr(ReturnToken.length)
                .trim();
            // "x.test"

            return {
                token: token,
                propertyExpressionBody: body
            };
        }

        const validatePropertyExpressionBody = (expressionParts: ExpressionParts) =>
        {
            if (!expressionParts.token)
                throw new Error("Expression token is empty.");
            if (!expressionParts.propertyExpressionBody)
                throw new Error("Expression body is empty.");

            let property = getPropertyFromParts(expressionParts);
            if (!property)
                throw new Error("Expression body has no property.");
        }

        const getPropertyFromParts = (expressionParts: ExpressionParts) =>
        {
            if (!expressionParts.token)
                throw new Error("Expression token is empty.");
            if (!expressionParts.propertyExpressionBody)
                throw new Error("Expression body is empty.");

            let parts = expressionParts.propertyExpressionBody
                .split(".")
                .map(part => part.trim());

            if (parts.length == 1)
                throw new Error(`Expression body is not a property expression. Body: "${expressionParts.propertyExpressionBody}".`);
            if (parts.length >= 3)
                throw new Error(`Expression body is not a simple property expression. Body: "${expressionParts.propertyExpressionBody}".`);

            let expressionToken = parts[0];
            let property = parts[1];

            if (expressionParts.token != expressionToken)
                throw new Error(`Expression body is not correlated to token. Body: "${expressionParts.propertyExpressionBody}", token: "${expressionParts.token}".`);

            let restrictedSymbols = [",", "(", ")", "{", "}", "+", "-", "!", "?", "<", ">", "*", "/", "="];
            restrictedSymbols.forEach(symbol => {
                if (property.indexOf(symbol) >= 0)
                    throw new Error(`Invalid property expression. Body: "${expressionParts.propertyExpressionBody}".`);
            });

            return property;
        } 
    }
}
