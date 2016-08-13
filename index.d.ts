export interface IExpression<TType, TResult> {
    (target: TType): TResult;
}
export declare const apply: <TType, TResult>(expression: IExpression<TType, TResult>, target: TType) => TResult;
export declare const validate: <TType, TResult>(expression: IExpression<TType, TResult>) => void;
export declare const getProperty: <TType, TResult>(expression: IExpression<TType, TResult>) => string;
