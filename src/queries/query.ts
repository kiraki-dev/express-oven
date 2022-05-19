export enum Operation {
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    SmallerThan = '<',
    SmallerThanOrEqual = '<=',
    Equal = '==',
    NotEqual = '!=',
    ArrayContains = 'array-contains',
    ArrayContainsAny = 'array-contains-any',
    In = 'in',
    NotIn = 'not-in',
}

// export const OrClause = Symbol('or');
// export const AndClause = Symbol('and');

export enum OperationKeywords {
    Or = '$or',
    And = '$and',
}

type Query = Record<string, {
    condition: Operation,
    paramValue: string,
}>

export type AndQuery = Query & {[key in OperationKeywords]?: Query};

export type OrQuery = AndQuery[];
